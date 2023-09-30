package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	db "super-pet-delivery/db/sqlc"
	"time"

	"github.com/gin-gonic/gin"
)

func (server *Server) createImage(ctx *gin.Context) {
	// Handle file upload
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Check if the file exists
	if file == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Use the original filename for storing the image
	filename := file.Filename

	// Replace backslashes with forward slashes in filename
	filename = strings.ReplaceAll(filename, "\\", "/")

	// Generate a subdirectory path based on the current month and year
	currentTime := time.Now()
	year := currentTime.Format("2006")
	month := currentTime.Format("01")
	subdirectoryPath := fmt.Sprintf("./images/%s/%s", year, month)

	// Create the subdirectory if it doesn't exist
	if _, err := os.Stat(subdirectoryPath); os.IsNotExist(err) {
		err := os.MkdirAll(subdirectoryPath, 0755)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	}

	// Check if the file with the same name already exists within the subdirectory
	filePath := filepath.Join(subdirectoryPath, filename)
	fileExists := true
	counter := 1

	for fileExists {
		_, err := os.Stat(filePath)
		if os.IsNotExist(err) {
			fileExists = false
		} else {
			// Append a number to the filename and check again
			filenameWithoutExt := strings.TrimSuffix(filename, filepath.Ext(filename))
			newFilename := fmt.Sprintf("%s_%d%s", filenameWithoutExt, counter, filepath.Ext(filename))
			filePath = filepath.Join(subdirectoryPath, newFilename)
			counter++
		}
	}

	// Save the uploaded file with the unique filename
	err = ctx.SaveUploadedFile(file, filePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	arg := db.CreateImageParams{
		Name:        filename,
		Description: "",
		Alt:         filename,
		ImagePath:   "/images/" + filepath.Join(year, month, filepath.Base(filePath)), // Store the relative path to the image
	}

	image, err := server.store.CreateImage(ctx, arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, image)
}

type getImageRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) getImage(ctx *gin.Context) {
	var req getImageRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	image, err := server.store.GetImage(ctx, req.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, image)
}

type getImagePathRequest struct {
	Year     int64  `uri:"year" binding:"required,min=1"`
	Month    int64  `uri:"month" binding:"required,min=1"`
	Filename string `uri:"filename" binding:"required"`
}

func (server *Server) getImagePath(ctx *gin.Context) {
	var req getImagePathRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Construct the absolute file path based on the parameters
	monthStr := fmt.Sprintf("%02d", req.Month) // Format with zero-padding
	filePath := fmt.Sprintf("./images/%d/%s/%s", req.Year, monthStr, req.Filename)

	fmt.Printf("Constructed file path: %s\n", filePath)

	// Check if the file exists
	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	// Serve the image file as a response
	ctx.File(filePath)
}

/*
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

type disassociateCategoryWithProductRequest struct {
	CategoryID int64 `uri:"category_id" binding:"required,min=1"`
	ProductID  int64 `uri:"product_id" binding:"required,min=1"`
}

func (server *Server) disassociateCategoryWithProduct(ctx *gin.Context) {
	var req disassociateCategoryWithProductRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.DisassociateProductFromCategoryParams{
		CategoryID: req.CategoryID,
		ProductID:  req.ProductID,
	}

	category, err := server.store.DisassociateProductFromCategory(ctx, arg)
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
*/
