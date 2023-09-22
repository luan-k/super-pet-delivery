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

	// Use the CORS middleware
	/* config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Add the origins you want to allow
	router.Use(cors.New(config)) */

	server.setupRouter()
	return server, nil
}

func (server *Server) setupRouter() {
	router := gin.Default()
	authRoutes := router.Group("/").Use(authMiddleware(server.tokenMaker))

	router.POST("/users/login", server.loginUser)

	authRoutes.POST("/users", server.createUser)
	router.GET("/users/:id", server.getUser)
	router.GET("/users", server.listUser)
	authRoutes.PUT("/users/:id", server.updateUser)
	authRoutes.DELETE("/users/:id", server.deleteUser)

	authRoutes.POST("/products", server.createProduct)
	router.GET("/products/:id", server.getProduct)
	router.GET("/products", server.listProduct)
	// ideally would be paginated as well but for now its good enough
	router.GET("/users/:id/products", server.listProductsByUser)
	authRoutes.PUT("/products/:id", server.updateProduct)
	authRoutes.DELETE("/products/:id", server.deleteProduct)

	authRoutes.POST("/categories", server.createCategory)
	router.GET("/categories/:id", server.getCategory)
	router.GET("/categories", server.listCategory)
	authRoutes.PUT("/categories/:id", server.updateCategory)
	authRoutes.DELETE("/categories/:id", server.deleteCategory)

	authRoutes.POST("/link_categories/:category_id/:product_id", server.associateCategoryWithProduct)
	authRoutes.DELETE("/link_categories/:category_id/:product_id", server.disassociateCategoryWithProduct)

	authRoutes.POST("/clients", server.createClient)
	router.GET("/clients/:id", server.getClient)
	router.GET("/clients", server.listClient)
	authRoutes.PUT("/clients/:id", server.updateClient)
	authRoutes.DELETE("/clients/:id", server.deleteClient)

	authRoutes.POST("/sales", server.createSale)
	router.GET("/sales/:id", server.getSale)
	router.GET("/sales", server.listSale)
	authRoutes.PUT("/sales/:id", server.updateSale)
	authRoutes.DELETE("/sales/:id", server.deleteSale)

	authRoutes.POST("/pdf/:id", server.createPdf)

	server.router = router
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
