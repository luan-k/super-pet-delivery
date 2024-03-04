package api

import (
	"database/sql"
	"strings"
	db "super-pet-delivery/db/sqlc"

	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type createProductRequest struct {
	Name        string   `json:"name" validate:"required"`
	Description string   `json:"description" validate:"required"`
	UserID      int64    `json:"user_id" validate:"required"`
	Price       string   `json:"price"`
	Sku         string   `json:"sku"`
	Images      []string `json:"images"`
}

func (server *Server) createProduct(ctx *gin.Context) {
	var req createProductRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	productPrice := 0.0
	productImages := []string{}
	productSku := ""
	price, err := strconv.ParseFloat(strings.Replace(req.Price, ",", ".", -1), 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	if req.Price != "" {
		productPrice = price
	}
	if len(req.Images) > 0 {
		productImages = req.Images
	}
	if req.Sku != "" {
		productSku = req.Sku
	}

	user, err := server.store.GetUser(ctx, req.UserID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	arg := db.CreateProductParams{
		Name:        req.Name,
		Description: req.Description,
		UserID:      req.UserID,
		Username:    user.Username,
		Price:       productPrice,
		Sku:         productSku,
		Images:      productImages,
	}

	product, err := server.store.CreateProduct(ctx, arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, product)
}

type getProductRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) getProduct(ctx *gin.Context) {
	var req getProductRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	product, err := server.store.GetProduct(ctx, req.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, product)
}

type listProductResponse struct {
	Total    int64        `json:"total"`
	Products []db.Product `json:"products"`
}

type listProductRequest struct {
	PageID        int32  `form:"page_id" binding:"required,min=1"`
	PageSize      int32  `form:"page_size" binding:"required,min=5,max=100"`
	SortField     string `form:"sort_field" binding:""`
	SortDirection string `form:"sort_direction" binding:""`
	Search        string `form:"search" binding:""`
}

func (server *Server) listProduct(ctx *gin.Context) {
	var req listProductRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListProductsParams{
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	}

	total, err := server.store.CountProducts(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var products []db.Product
	// Check if sort fields and search are provided
	if req.SortField != "" && req.SortDirection != "" && req.Search != "" {
		// Fetch the paginated products with sorting and search
		products, err = server.store.SearchProducts(ctx, req.Search, int(req.PageID), int(req.PageSize), req.SortField, req.SortDirection)
	} else if req.SortField != "" && req.SortDirection != "" {
		// Fetch the paginated products with sorting
		products, err = server.store.ListProductsSorted(ctx, arg, req.SortField, req.SortDirection)
	} else if req.Search != "" {
		// Fetch the paginated products with search
		products, err = server.store.SearchProducts(ctx, req.Search, int(req.PageID), int(req.PageSize), "", "")
	} else {
		// Fetch the paginated products without sorting or search
		products, err = server.store.ListProducts(ctx, arg)
	}
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	response := listProductResponse{
		Total:    total,
		Products: products,
	}

	ctx.JSON(http.StatusOK, response)
}

type listProductsByUserRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) listProductsByUser(ctx *gin.Context) {
	var req listProductsByUserRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	products, err := server.store.ListProductsByUser(ctx, req.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, products)
}

type updateProductRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	UserID      int64    `json:"user_id"`
	Price       string   `json:"price"`
	Sku         string   `json:"sku"`
	Images      []string `json:"images"`
}

func (server *Server) updateProduct(ctx *gin.Context) {
	var req updateProductRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	productID, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	fmt.Println(productID)
	if err != nil {
		fmt.Println("error in parsing id")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Fetch the existing product data from db
	existingProduct, err := server.store.GetProduct(ctx, productID)
	if err != nil {
		fmt.Println("error in getting product")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	user, err := server.store.GetUser(ctx, req.UserID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	price, err := strconv.ParseFloat(strings.Replace(req.Price, ",", ".", -1), 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Update only the fields that are provided in the request
	if req.Name != "" {
		existingProduct.Name = req.Name
	}
	if req.Description != "" {
		existingProduct.Description = req.Description
	}
	if req.UserID != 0 {
		existingProduct.UserID = req.UserID
	}
	if req.Price != "" {
		existingProduct.Price = price
	}
	if req.Sku != "" {
		existingProduct.Sku = req.Sku
	}
	if len(req.Images) > 0 {
		existingProduct.Images = req.Images
	}

	arg := db.UpdateProductParams{
		ID:          productID,
		Name:        existingProduct.Name,
		Description: existingProduct.Description,
		UserID:      existingProduct.UserID,
		Username:    user.Username,
		Price:       existingProduct.Price,
		Sku:         existingProduct.Sku,
		Images:      existingProduct.Images,
	}

	// Perform the update operation with the modified product data
	product, err := server.store.UpdateProduct(ctx, arg)
	if err != nil {
		fmt.Println("error in updating product")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, product)
}

type deleteProductRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) deleteProduct(ctx *gin.Context) {
	var req deleteProductRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// delete existing product
	err := server.store.DeleteProduct(ctx, req.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, "Product deleted successfully")
}
