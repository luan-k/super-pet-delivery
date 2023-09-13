package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	db "super-pet-delivery/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createCategoryRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description" validate:"required"`
}

func (server *Server) createCategory(ctx *gin.Context) {
	var req createCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreateCategoryParams{
		Name:        req.Name,
		Description: req.Description,
	}

	category, err := server.store.CreateCategory(ctx, arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, category)
}

type getCategoryRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) getCategory(ctx *gin.Context) {
	var req getCategoryRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	category, err := server.store.GetCategory(ctx, req.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, category)
}

type listCategoryRequest struct {
	PageID   int32 `form:"page_id" binding:"required,min=1"`
	PageSize int32 `form:"page_size" binding:"required,min=5,max=10"`
}

func (server *Server) listCategory(ctx *gin.Context) {
	var req listCategoryRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListCategoriesParams{
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	}

	categories, err := server.store.ListCategories(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, categories)
}

type updateCategoryRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func (server *Server) updateCategory(ctx *gin.Context) {
	var req updateCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	categoryID, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	fmt.Println(categoryID)
	if err != nil {
		fmt.Println("error in parsing id")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Fetch the existing category data from db
	existingCategory, err := server.store.GetCategory(ctx, categoryID)
	if err != nil {
		fmt.Println("error in getting category")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Update only the fields that are provided in the request
	if req.Name != "" {
		existingCategory.Name = req.Name
	}
	if req.Description != "" {
		existingCategory.Description = req.Description
	}

	arg := db.UpdateCategoryParams{
		ID:          categoryID,
		Name:        existingCategory.Name,
		Description: existingCategory.Description,
	}

	// Perform the update operation with the modified category data
	category, err := server.store.UpdateCategory(ctx, arg)
	if err != nil {
		fmt.Println("error in updating category")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, category)
}

type deleteCategoryRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) deleteCategory(ctx *gin.Context) {
	var req deleteCategoryRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// delete existing category
	err := server.store.DeleteCategory(ctx, req.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, "Category deleted successfully")
}

type associateCategoryWithProductRequest struct {
	CategoryID int64 `uri:"category_id" binding:"required,min=1"`
	ProductID  int64 `uri:"product_id" binding:"required,min=1"`
}

func (server *Server) associateCategoryWithProduct(ctx *gin.Context) {
	var req associateCategoryWithProductRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.AssociateProductWithCategoryParams{
		CategoryID: req.CategoryID,
		ProductID:  req.ProductID,
	}

	category, err := server.store.AssociateProductWithCategory(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, category)
}
