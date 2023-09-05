package api

import (
	db "fiberInit/db/sqlc"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Server serves HTTP requests for our banking service.
type Server struct {
	store  *db.Store
	router *gin.Engine
}

// NewServer creates a new HTTP server and set up routing.
func NewServer(store *db.Store) *Server {
	server := &Server{store: store}
	router := gin.Default()

	// Use the CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Add the origins you want to allow
	router.Use(cors.New(config))

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

	server.router = router
	return server
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
