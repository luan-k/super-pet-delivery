package api

import (
	"database/sql"
	db "fiberInit/db/sqlc"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type createProductRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description" validate:"required"`
	UserID      int64  `json:"user_id" validate:"required"`
}

func (server *Server) createProduct(ctx *gin.Context) {
	var req createProductRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreateProductParams{
		Name:        req.Name,
		Description: req.Description,
		UserID:      req.UserID,
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

type listProductRequest struct {
	PageID   int32 `form:"page_id" binding:"required,min=1"`
	PageSize int32 `form:"page_size" binding:"required,min=5,max=10"`
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

	products, err := server.store.ListProducts(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, products)
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
	Name        string `json:"name"`
	Description string `json:"description"`
	UserID      int64  `json:"user_id"`
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

	arg := db.UpdateProductParams{
		ID:          productID,
		Name:        existingProduct.Name,
		Description: existingProduct.Description,
		UserID:      existingProduct.UserID,
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
