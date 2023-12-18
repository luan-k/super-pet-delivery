package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	db "super-pet-delivery/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createSaleRequest struct {
	ClientID    int64  `json:"client_id" binding:"required"`
	Product     string `json:"product" binding:"required"`
	Price       int64  `json:"price" binding:"required"`
	Observation string `json:"observation" binding:"required"`
}

func (server *Server) createSale(ctx *gin.Context) {
	var req createSaleRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreateSaleParams{
		ClientID:    req.ClientID,
		Product:     req.Product,
		Price:       req.Price,
		Observation: req.Observation,
	}

	sale, err := server.store.CreateSale(ctx, arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, sale)
}

type getSaleRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) getSale(ctx *gin.Context) {
	var req getSaleRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	sale, err := server.store.GetSale(ctx, req.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, sale)
}

type listSaleResponse struct {
	Total int64     `json:"total"`
	Sales []db.Sale `json:"sales"`
}

type listSaleRequest struct {
	PageID        int32  `form:"page_id" binding:"required,min=1"`
	PageSize      int32  `form:"page_size" binding:"required,min=5,max=50"`
	SortField     string `form:"sort_field" binding:""`
	SortDirection string `form:"sort_direction" binding:""`
	Search        string `form:"search" binding:""`
}

func (server *Server) listSale(ctx *gin.Context) {
	var req listSaleRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListSalesParams{
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	}

	// Fetch the total number of sales
	total, err := server.store.CountSales(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var sales []db.Sale
	// Check if sort fields and search are provided
	if req.SortField != "" && req.SortDirection != "" && req.Search != "" {
		// Fetch the paginated sales with sorting and search
		sales, err = server.store.SearchSales(ctx, req.Search, int(req.PageID), int(req.PageSize), req.SortField, req.SortDirection)
	} else if req.SortField != "" && req.SortDirection != "" {
		// Fetch the paginated sales with sorting
		sales, err = server.store.ListSalesSorted(ctx, arg, req.SortField, req.SortDirection)
	} else if req.Search != "" {
		// Fetch the paginated sales with search
		sales, err = server.store.SearchSales(ctx, req.Search, int(req.PageID), int(req.PageSize), "", "")
	} else {
		// Fetch the paginated sales without sorting or search
		sales, err = server.store.ListSales(ctx, arg)
	}
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Create the response structure
	response := listSaleResponse{
		Total: total,
		Sales: sales,
	}

	ctx.JSON(http.StatusOK, response)
}

type updateSaleRequest struct {
	Product     string `json:"product"`
	Price       int64  `json:"price"`
	Observation string `json:"observation"`
}

func (server *Server) updateSale(ctx *gin.Context) {
	var req updateSaleRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	saleID, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	fmt.Println(saleID)
	if err != nil {
		fmt.Println("error in parsing id")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Fetch the existing sale data from db
	existingSale, err := server.store.GetSale(ctx, saleID)
	if err != nil {
		fmt.Println("error in getting sale")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Update only the fields that are provided in the request
	// Conditional Checks for Updating Sale Fields

	if req.Product != "" {
		existingSale.Product = req.Product
	}

	if req.Price != 0 {
		existingSale.Price = req.Price
	}

	if req.Observation != "" {
		existingSale.Observation = req.Observation
	}

	arg := db.UpdateSaleParams{
		ID:          saleID,
		ClientID:    existingSale.ClientID,
		Product:     existingSale.Product,
		Price:       existingSale.Price,
		Observation: existingSale.Observation,
	}

	// Perform the update operation with the modified sale data
	sale, err := server.store.UpdateSale(ctx, arg)
	if err != nil {
		fmt.Println("error in updating sale")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, sale)
}

type deleteSaleRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) deleteSale(ctx *gin.Context) {
	var req deleteSaleRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Delete existing sale
	err := server.store.DeleteSale(ctx, req.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, "Sale deleted successfully")
}
