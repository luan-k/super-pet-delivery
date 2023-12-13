package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	db "super-pet-delivery/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createClientRequest struct {
	FullName            string `json:"full_name" binding:"required"`
	PhoneWhatsapp       string `json:"phone_whatsapp"`
	PhoneLine           string `json:"phone_line"`
	PetName             string `json:"pet_name"`
	PetBreed            string `json:"pet_breed"`
	AddressStreet       string `json:"address_street"`
	AddressNumber       string `json:"address_number"`
	AddressNeighborhood string `json:"address_neighborhood"`
	AddressReference    string `json:"address_reference"`
}

func (server *Server) createClient(ctx *gin.Context) {
	var req createClientRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreateClientParams{
		FullName:            req.FullName,
		PhoneWhatsapp:       req.PhoneWhatsapp,
		PhoneLine:           req.PhoneLine,
		PetName:             req.PetName,
		PetBreed:            req.PetBreed,
		AddressStreet:       req.AddressStreet,
		AddressNumber:       req.AddressNumber,
		AddressNeighborhood: req.AddressNeighborhood,
		AddressReference:    req.AddressReference,
	}

	client, err := server.store.CreateClient(ctx, arg)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, client)
}

type getClientRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) getClient(ctx *gin.Context) {
	var req getClientRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	client, err := server.store.GetClient(ctx, req.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, client)
}

type listClientResponse struct {
	Total   int64       `json:"total"`
	Clients []db.Client `json:"clients"`
}

type listClientRequest struct {
	PageID        int32  `form:"page_id" binding:"required,min=1"`
	PageSize      int32  `form:"page_size" binding:"required,min=5,max=50"`
	SortField     string `form:"sort_field" binding:""`
	SortDirection string `form:"sort_direction" binding:""`
}

func (server *Server) listClient(ctx *gin.Context) {
	var req listClientRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.ListClientsParams{
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	}

	// Fetch the total number of clients
	total, err := server.store.CountClients(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var clients []db.Client
	// Check if sort fields are provided
	if req.SortField != "" && req.SortDirection != "" {
		// Fetch the paginated clients with sorting
		clients, err = server.store.ListClientsSorted(ctx, arg, req.SortField, req.SortDirection)
	} else {
		// Fetch the paginated clients without sorting
		clients, err = server.store.ListClients(ctx, arg)
	}
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Create the response structure
	response := listClientResponse{
		Total:   total,
		Clients: clients,
	}

	ctx.JSON(http.StatusOK, response)
}

type updateClientRequest struct {
	FullName            string `json:"full_name"`
	PhoneWhatsapp       string `json:"phone_whatsapp"`
	PhoneLine           string `json:"phone_line"`
	PetName             string `json:"pet_name"`
	PetBreed            string `json:"pet_breed"`
	AddressStreet       string `json:"address_street"`
	AddressNumber       string `json:"address_number"`
	AddressNeighborhood string `json:"address_neighborhood"`
	AddressReference    string `json:"address_reference"`
}

func (server *Server) updateClient(ctx *gin.Context) {
	var req updateClientRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	clientID, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	fmt.Println(clientID)
	if err != nil {
		fmt.Println("error in parsing id")
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// Fetch the existing client data from db
	existingClient, err := server.store.GetClient(ctx, clientID)
	if err != nil {
		fmt.Println("error in getting client")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Update only the fields that are provided in the request
	// Conditional Checks for Updating Client Fields

	if req.FullName != "" {
		existingClient.FullName = req.FullName
	}

	if req.PhoneWhatsapp != "" {
		existingClient.PhoneWhatsapp = req.PhoneWhatsapp
	}

	if req.PhoneLine != "" {
		existingClient.PhoneLine = req.PhoneLine
	}

	if req.PetName != "" {
		existingClient.PetName = req.PetName
	}

	if req.PetBreed != "" {
		existingClient.PetBreed = req.PetBreed
	}

	if req.AddressStreet != "" {
		existingClient.AddressStreet = req.AddressStreet
	}

	if req.AddressNumber != "" {
		existingClient.AddressNumber = req.AddressNumber
	}

	if req.AddressNeighborhood != "" {
		existingClient.AddressNeighborhood = req.AddressNeighborhood
	}

	if req.AddressReference != "" {
		existingClient.AddressReference = req.AddressReference
	}

	// TODO ideally this would be made using helper function with a loop, but that proved more challenging than I expected

	arg := db.UpdateClientParams{
		ID:                  clientID,
		FullName:            existingClient.FullName,
		PhoneWhatsapp:       existingClient.PhoneWhatsapp,
		PhoneLine:           existingClient.PhoneLine,
		PetName:             existingClient.PetName,
		PetBreed:            existingClient.PetBreed,
		AddressStreet:       existingClient.AddressStreet,
		AddressNumber:       existingClient.AddressNumber,
		AddressNeighborhood: existingClient.AddressNeighborhood,
		AddressReference:    existingClient.AddressReference,
	}

	// Perform the update operation with the modified client data
	client, err := server.store.UpdateClient(ctx, arg)
	if err != nil {
		fmt.Println("error in updating client")
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, client)
}

type deleteClientRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) deleteClient(ctx *gin.Context) {
	var req deleteClientRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// delete existing client
	err := server.store.DeleteClient(ctx, req.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, "Client deleted successfully")
}
