package api

import (
	"fmt"
	"log"
	db "super-pet-delivery/db/sqlc"
	"super-pet-delivery/token"
	"super-pet-delivery/util"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

// Server serves HTTP requests for our api.
type Server struct {
	config     util.Config
	store      db.SortableStore
	tokenMaker token.Maker
	router     *gin.Engine
}

// NewServer creates a new HTTP server and set up routing.
func NewServer(config util.Config, store db.SortableStore) (*Server, error) {
	tokenMaker, err := token.NewPasetoMaker(config.TokenSymmetricKey)
	if err != nil {
		return nil, fmt.Errorf("cannot create token maker: %w", err)
	}

	server := &Server{
		config:     config,
		store:      store,
		tokenMaker: tokenMaker,
	}

	// Create the initial user
	err = server.createInitialUser(store)
	if err != nil {
		log.Fatal("cannot create initial user:", err)
	}

	// Create dummy data
	//err = server.createDummyData(store)
	/* if err != nil {
		log.Fatal("cannot create dummy data:", err)
	} */

	server.setupRouter()
	return server, nil
}

// Add the CORSMiddleware function here
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://54.94.135.147")
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://superpetdelivery.com.br")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Cookie, cookie, Cookies, cookies, accept, origin, Cache-Control, X-Requested-With, Cookie")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func (server *Server) setupRouter() {
	router := gin.Default()

	config := cors.DefaultConfig()
	router.Use(CORSMiddleware())
	authRoutes := router.Group("/").Use(authMiddleware(server.tokenMaker))

	config.AllowOrigins = []string{"http://localhost:3000", "http://54.94.135.147", "http://superpetdelivery.com.br"}
	config.AllowHeaders = []string{"Authorization", "Cookie"}

	config.AllowCredentials = true
	//router.Use(cors.New(config))
	authRoutes.Use(cors.New(config))

	router.POST("/users/login", server.loginUser)
	authRoutes.POST("/tokens/renew_access", server.RenewAccessTokenHeader)

	authRoutes.POST("/users", server.createUser)
	authRoutes.GET("/users/:id", server.getUser)
	authRoutes.GET("/users", server.listUser)
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
	authRoutes.GET("/clients/:id", server.getClient)
	authRoutes.GET("/clients", server.listClient)
	authRoutes.PUT("/clients/:id", server.updateClient)
	authRoutes.DELETE("/clients/:id", server.deleteClient)

	authRoutes.POST("/sales", server.createSale)
	authRoutes.GET("/sales/:id", server.getSale)
	authRoutes.GET("/sales", server.listSale)
	authRoutes.GET("/sales/all", server.listAllSales)
	authRoutes.PUT("/sales/:id", server.updateSale)
	authRoutes.DELETE("/sales/:id", server.deleteSale)

	authRoutes.POST("/pdf/", server.createPdf)
	//authRoutes.GET("/pdf/", server.getPdf)

	authRoutes.POST("/images", server.createImage)
	router.GET("/images/:id", server.getImage)
	router.GET("/media/:year/:month/:filename", server.getImagePath)
	router.GET("/images", server.listImage)
	authRoutes.PUT("/images/:id", server.updateImage)
	authRoutes.DELETE("/images/:id", server.deleteImage)

	authRoutes.POST("/link_images/:image_id/:product_id", server.associateImageWithProduct)
	authRoutes.DELETE("/link_images/:image_id/:product_id", server.disassociateImageWithProduct)

	server.router = router
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
