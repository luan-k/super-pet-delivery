package api

import (
	"fmt"
	db "super-pet-delivery/db/sqlc"
	"super-pet-delivery/token"
	"super-pet-delivery/util"

	"github.com/gin-gonic/gin"
)

// Server serves HTTP requests for our api.
type Server struct {
	config     util.Config
	store      db.Store
	tokenMaker token.Maker
	router     *gin.Engine
}

// NewServer creates a new HTTP server and set up routing.
func NewServer(config util.Config, store db.Store) (*Server, error) {
	tokenMaker, err := token.NewPasetoMaker(config.TokenSymmetricKey)
	if err != nil {
		return nil, fmt.Errorf("cannot create token maker: %w", err)
	}

	server := &Server{
		config:     config,
		store:      store,
		tokenMaker: tokenMaker,
	}
	router := gin.Default()

	// Use the CORS middleware
	/* config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Add the origins you want to allow
	router.Use(cors.New(config)) */

	router.POST("/users", server.createUser)
	router.GET("/users/:id", server.getUser)
	router.GET("/users", server.listUser)
	router.PUT("/users/:id", server.updateUser)
	router.DELETE("/users/:id", server.deleteUser)

	router.POST("/products", server.createProduct)
	router.GET("/products/:id", server.getProduct)
	router.GET("/products", server.listProduct)
	// ideally would be paginated as well but for now its good enough
	router.GET("/users/:id/products", server.listProductsByUser)
	router.PUT("/products/:id", server.updateProduct)
	router.DELETE("/products/:id", server.deleteProduct)

	router.POST("/categories", server.createCategory)
	router.GET("/categories/:id", server.getCategory)
	router.GET("/categories", server.listCategory)
	router.PUT("/categories/:id", server.updateCategory)
	router.DELETE("/categories/:id", server.deleteCategory)

	router.POST("/link_categories/:category_id/:product_id", server.associateCategoryWithProduct)
	router.DELETE("/link_categories/:category_id/:product_id", server.disassociateCategoryWithProduct)

	router.POST("/clients", server.createClient)
	router.GET("/clients/:id", server.getClient)
	router.GET("/clients", server.listClient)
	router.PUT("/clients/:id", server.updateClient)
	router.DELETE("/clients/:id", server.deleteClient)

	router.POST("/sales", server.createSale)
	router.GET("/sales/:id", server.getSale)
	router.GET("/sales", server.listSale)
	router.PUT("/sales/:id", server.updateSale)
	router.DELETE("/sales/:id", server.deleteSale)

	router.POST("/pdf/:id", server.createPdf)

	server.router = router
	return server, nil
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
