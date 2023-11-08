package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

/* type renewAccessTokenRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type renewAccessTokenResponse struct {
	AccessToken          string    `json:"access_token"`
	AccessTokenExpiresAt time.Time `json:"access_token_expires_at"`
}

func (server *Server) renewAccessToken(ctx *gin.Context) {
	var req renewAccessTokenRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	refreshPayload, err := server.tokenMaker.VerifyToken(req.RefreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	fmt.Printf(refreshPayload.Username, " <---- refresh payload username ||   ")
	fmt.Printf(refreshPayload.ID.String(), " <---- refresh payload ID || ")
	fmt.Printf(refreshPayload.ID.URN(), " <---- refresh payload ID || ")

	session, err := server.store.GetSession(ctx, refreshPayload.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	if session.IsBlocked {
		err := fmt.Errorf("blocked session")
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	if session.Username != refreshPayload.Username {
		err := fmt.Errorf("incorrect session user")
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	if session.RefreshToken != req.RefreshToken {
		err := fmt.Errorf("incorrect session token")
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	if time.Now().After(session.ExpiresAt) {
		err := fmt.Errorf("expired session")
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	accessToken, accessPayload, err := server.tokenMaker.CreateToken(
		refreshPayload.Username,
		server.config.AccessTokenDuration,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	rsp := renewAccessTokenResponse{
		AccessToken:          accessToken,
		AccessTokenExpiresAt: accessPayload.ExpiredAt,
	}
	ctx.JSON(http.StatusOK, rsp)
} */

func (server *Server) RenewAccessTokenHeader(ctx *gin.Context) (string, error) {
	// refresh token was set when logging in
	refreshToken, err := ctx.Cookie("refresh_token")
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, "refresh token not found in cookies")
		return "", err
	}

	refreshPayload, err := server.tokenMaker.VerifyToken(refreshToken)
	if err != nil {
		return "", err
	}

	session, err := server.store.GetSession(ctx, refreshPayload.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("--- Error no rows ---")
			return "", err
		}
		fmt.Println("--- Some Other error ---")
		return "", err
	}

	if session.IsBlocked {
		return "", fmt.Errorf("blocked session")
	}

	if session.Username != refreshPayload.Username {
		return "", fmt.Errorf("incorrect session user")
	}

	if session.RefreshToken != refreshToken {
		return "", fmt.Errorf("incorrect session token")
	}

	if time.Now().After(session.ExpiresAt) {
		return "", fmt.Errorf("expired session")
	}

	accessToken, _, err := server.tokenMaker.CreateToken(
		refreshPayload.Username,
		server.config.AccessTokenDuration,
	)
	if err != nil {
		return "", err
	}

	// Set the access token as a cookie
	ctx.SetCookie("access_token", accessToken, int(server.config.AccessTokenDuration.Seconds()), "/", "", false, false)
	fmt.Print("the acess token is set inside")

	// Return the JSON response
	return accessToken, nil
}
