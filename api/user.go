package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	db "super-pet-delivery/db/sqlc"
	"super-pet-delivery/util"
	"time"

	"github.com/gin-gonic/gin"
)

type createUserRequest struct {
	Username string `json:"username" binding:"required"`
	FullName string `json:"full_name"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

// we use this so the hashed password isnt sent back to the client
type userResponse struct {
	ID                int64     `json:"id"`
	Username          string    `json:"username"`
	FullName          string    `json:"full_name"`
	Email             string    `json:"email"`
	PasswordChangedAt time.Time `json:"password_changed_at"`
	CreatedAt         time.Time `json:"created_at"`
}

func newUserResponse(user db.User) userResponse {
	return userResponse{
		ID:                user.ID,
		Username:          user.Username,
		FullName:          user.FullName,
		Email:             user.Email,
		PasswordChangedAt: user.PasswordChangedAt,
		CreatedAt:         user.CreatedAt,
	}
}

func (server *Server) createUser(ctx *gin.Context) {
	var req createUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	arg := db.CreateUserParams{
		Username:       req.Username,
		FullName:       req.FullName,
		Email:          req.Email,
		HashedPassword: hashedPassword,
	}

	user, err := server.store.CreateUser(ctx, arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	rsp := newUserResponse(user)

	ctx.JSON(http.StatusOK, rsp)
}

type getUserRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) getUser(ctx *gin.Context) {
	var req getUserRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	user, err := server.store.GetUser(ctx, req.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, user)
}

type listUserRequest struct {
	PageID   int32 `form:"page_id" binding:"required,min=1"`
	PageSize int32 `form:"page_size" binding:"required,min=5,max=10"`
}

func (server *Server) listUser(ctx *gin.Context) {
	var req listUserRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListUsersParams{
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	}

	users, err := server.store.ListUsers(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, users)
}

type updateUserRequest struct {
	Username string `json:"username"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
}

func (server *Server) updateUser(ctx *gin.Context) {
	var req updateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	userID, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	fmt.Println(userID)
	if err != nil {
		fmt.Println("error in parsing id")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Fetch the existing user data from db
	existingUser, err := server.store.GetUser(ctx, userID)
	if err != nil {
		fmt.Println("error in getting user")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Update only the fields that are provided in the request
	if req.Username != "" {
		existingUser.Username = req.Username
	}
	if req.FullName != "" {
		existingUser.FullName = req.FullName
	}
	if req.Email != "" {
		existingUser.Email = req.Email
	}

	arg := db.UpdateUserParams{
		ID:       userID,
		Username: existingUser.Username,
		FullName: existingUser.FullName,
		Email:    existingUser.Email,
	}

	// Perform the update operation with the modified user data
	user, err := server.store.UpdateUser(ctx, arg)
	if err != nil {
		fmt.Println("error in updating user")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, user)
}

type deleteUserRequest struct {
	UserID int64 `json:"user_id"`
}

func (server *Server) deleteUser(ctx *gin.Context) {
	var req deleteUserRequest
	fmt.Printf("request: before jsonthing %v\n", req)
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	fmt.Printf("request: after jsonthing %v\n", req)
	userID, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Fetch the existing user data from db
	_, err = server.store.GetUser(ctx, userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Check for existing products associated with the user being deleted
	products, err := server.store.ListProductsByUser(ctx, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if len(products) > 0 {
		// If products are associated, check if a new user ID is provided in the request body
		if req.UserID != 0 {
			// Update the products' ownership to the new user ID
			for _, p := range products {
				arg := db.UpdateProductParams{
					ID:          p.ID,
					Name:        p.Name,
					Description: p.Description,
					UserID:      req.UserID,
				}
				_, err := server.store.UpdateProduct(ctx, arg)
				if err != nil {
					fmt.Printf("error in updating product: %v\n", err)
					ctx.JSON(http.StatusInternalServerError, errorResponse(err))
					return
				}
				// You can do something with the updatedProduct if needed
			}
		} else {
			// If no new user ID is provided, return an error indicating products are associated
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "User has associated products. Provide a new user ID to reassign products."})
			return
		}
	}

	// delete existing user
	err = server.store.DeleteUser(ctx, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, "User deleted successfully")
}

type loginUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

type loginUserResponse struct {
	AccessToken string       `json:"access_token"`
	User        userResponse `json:"user"`
}

func (server *Server) loginUser(ctx *gin.Context) {
	var req loginUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	user, err := server.store.GetUserByUsername(ctx, req.Username)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	err = util.CheckPassword(req.Password, user.HashedPassword)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	accessToken, err := server.tokenMaker.CreateToken(
		user.Username,
		server.config.AccessTokenDuration,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	rsp := loginUserResponse{
		AccessToken: accessToken,
		User:        newUserResponse(user),
	}
	ctx.JSON(http.StatusOK, rsp)
}
