package api

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
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

	server.setupRouter()
	return server, nil
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
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

	config.AllowOrigins = []string{"http://superpetdelivery.com.br"}
	config.AllowHeaders = []string{"Authorization", "Cookie"}

	config.AllowCredentials = true
	//router.Use(cors.New(config))
	authRoutes.Use(cors.New(config))

	router.POST("/users/login", server.loginUser)
	authRoutes.POST("/tokens/renew_access", server.RenewAccessTokenHeader)
	authRoutes.POST("/users/logout", server.logoutUser)

	authRoutes.POST("/users", server.createUser)
	authRoutes.GET("/users/:id", server.getUser)
	authRoutes.GET("/current_user", server.GetLoggedInUser)
	authRoutes.GET("/users", server.listUser)
	authRoutes.PUT("/users/:id", server.updateUser)
	authRoutes.DELETE("/users/:id", server.deleteUser)

	authRoutes.POST("/products", server.createProduct)
	router.GET("/product/:url", server.getProductByURL)
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
	authRoutes.POST("/link_categories/multiple/:product_id", server.associateMultipleCategoriesWithProduct)
	authRoutes.DELETE("/link_categories/:category_id/:product_id", server.disassociateCategoryWithProduct)
	authRoutes.DELETE("/link_categories/multiple/:product_id", server.disassociateMultipleCategoriesWithProduct)
	router.GET("/categories/by_product/:product_id", server.listProductCategories)

	authRoutes.POST("/clients", server.createClient)
	authRoutes.GET("/clients/:id", server.getClient)
	authRoutes.GET("/clients", server.listClient)
	authRoutes.PUT("/clients/:id", server.updateClient)
	authRoutes.DELETE("/clients/:id", server.deleteClient)

	authRoutes.POST("/sales", server.createSale)
	authRoutes.GET("/sales/:id", server.getSale)
	authRoutes.GET("/sales", server.listSale)
	authRoutes.GET("/sales/all", server.listAllSales)
	authRoutes.POST("/sales/by_date", server.GetSalesByDate)
	authRoutes.GET("/sales/by_client/:client_id", server.GetSalesByClientID)
	authRoutes.PUT("/sales/:id", server.updateSale)
	authRoutes.DELETE("/sales/:id", server.deleteSale)
	authRoutes.DELETE("/sales/delete", server.deleteSales)

	authRoutes.POST("/pdf/", server.createPdf)
	//authRoutes.GET("/pdf/", server.getPdf)

	authRoutes.POST("/images", server.createImage)
	router.GET("/images/:id", server.getImage)
	router.POST("/images-multiple", server.getImages)
	router.GET("/media/:year/:month/:filename", server.getImagePath)
	authRoutes.GET("/images", server.listImage)
	authRoutes.PUT("/images/:id", server.updateImage)
	authRoutes.DELETE("/images/:id", server.deleteImage)

	authRoutes.POST("/link_images/:image_id/:product_id", server.associateImageWithProduct)
	authRoutes.POST("/link_images/multiple/:product_id", server.associateMultipleImagesWithProduct)
	authRoutes.DELETE("/link_images/:image_id/:product_id", server.disassociateImageWithProduct)
	authRoutes.DELETE("/link_images/multiple/:product_id", server.disassociateMultipleImagesWithProduct)
	router.GET("/images/by_product/:product_id", server.listProductImages)
	authRoutes.PUT("/images/by_product/:product_id", server.editImageOrder)

	authRoutes.POST("/slider_images", server.CreateSliderImage)
	router.GET("/slider_images", server.ListSliderImages)
	authRoutes.POST("/slider_images/update", server.UpdateSliderImage)
	authRoutes.POST("/slider_images/update_by_image_id", server.UpdateSliderImageByImageId)
	authRoutes.POST("/slider_images/delete", server.DeleteSliderImages)
	authRoutes.POST("/slider_images/delete_by_image_id", server.DeleteSliderImagesByImageId)

	router.POST("/contact", server.HandleForm)

	server.router = router
}

// Start runs the HTTP server on a specific address.
func (server *Server) Start(address string) error {
	// Define HTTPS server configuration with the provided SSL certificate and private key
	s := &http.Server{
		Addr: ":443",
		// Specify the SSL certificate and private key
		TLSConfig: &tls.Config{
			Certificates: []tls.Certificate{{
				// Parse the certificate and private key from the provided PEM-encoded data
				Certificate: [][]byte{[]byte(`-----BEGIN CERTIFICATE-----
MIIEujCCA6KgAwIBAgIUeyfDBTz7pTl/2WoJW1IsUelYxDgwDQYJKoZIhvcNAQEL
BQAwgYsxCzAJBgNVBAYTAlVTMRkwFwYDVQQKExBDbG91ZEZsYXJlLCBJbmMuMTQw
MgYDVQQLEytDbG91ZEZsYXJlIE9yaWdpbiBTU0wgQ2VydGlmaWNhdGUgQXV0aG9y
aXR5MRYwFAYDVQQHEw1TYW4gRnJhbmNpc2NvMRMwEQYDVQQIEwpDYWxpZm9ybmlh
MB4XDTI0MDQwNDAwMTEwMFoXDTM5MDQwMTAwMTEwMFowYjEZMBcGA1UEChMQQ2xv
dWRGbGFyZSwgSW5jLjEdMBsGA1UECxMUQ2xvdWRGbGFyZSBPcmlnaW4gQ0ExJjAk
BgNVBAMTHUNsb3VkRmxhcmUgT3JpZ2luIENlcnRpZmljYXRlMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmvCle9VwKqcBTCDxhyD4eroZNStB2DPNmbQf
a2cTXTfjStWUD9ZbeAtRZpnmkvP+EwKJR+VMuo1nICWGvqpqYsAhF6rHXOZYp9Ww
CHuxRwYbHTAJ4yR6Fw1YHF9OL45DWTyiRlO8kPuaooSM174ipTmCvLDyCM2TXIJP
ALm8Exv42lE9ohRb8nekZZwaZi7+Nyc+4umcMXizDEP4JSEx1zuf+5OVpo/ZNBcs
JmZpyn+Xdhscg86hnFmQo0v5obR0faRK1pM0S0CA39XIFR8L6vg/FC6tg4yE6XOg
XPYTJZrvYsVGjNDQ+zfimAxA2OVwgZbqOMV6yZnh9EkL1UJypwIDAQABo4IBPDCC
ATgwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcD
ATAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBT59hu9eM6H5KHZRD3rBy80NL+FzTAf
BgNVHSMEGDAWgBQk6FNXXXw0QIep65TbuuEWePwppDBABggrBgEFBQcBAQQ0MDIw
MAYIKwYBBQUHMAGGJGh0dHA6Ly9vY3NwLmNsb3VkZmxhcmUuY29tL29yaWdpbl9j
YTA9BgNVHREENjA0ghkqLnN1cGVycGV0ZGVsaXZlcnkuY29tLmJyghdzdXBlcnBl
dGRlbGl2ZXJ5LmNvbS5icjA4BgNVHR8EMTAvMC2gK6AphidodHRwOi8vY3JsLmNs
b3VkZmxhcmUuY29tL29yaWdpbl9jYS5jcmwwDQYJKoZIhvcNAQELBQADggEBAFnC
z2i5wT4bNKGcxlX8kkq924sV0uxs/lKkcEbBDUryJ7QMxlgLcjgU/r3RKpR/ZT5i
7BLBil2X9gELCi5tNClA1fCT1zYyEGNaq/SKmLYVy0VqGDy4R7nq2JNSJzubt/0j
VSgyDnGH5Z0ZAiQqzffvXzRtEKNuBj9rZEf84ijPMe4NHO6CooBelwjndku7aVtA
IrY66OKeFbWLkHMKk+Vgcwh0Fxp6jACdIb9LTsE5mZH+tSlrgumuUHQZrlLOA5Ye
QRnR54it1kSu9usHnDfkLEj5XfS1q6C+JEk21rX5+JC8QxtrCoCDAOa7h8PsD4F/
BW/sNZp3MNiyhlKwxkM=
-----END CERTIFICATE-----`)},
				// Parse the private key
				PrivateKey: []byte(`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCa8KV71XAqpwFM
IPGHIPh6uhk1K0HYM82ZtB9rZxNdN+NK1ZQP1lt4C1FmmeaS8/4TAolH5Uy6jWcg
JYa+qmpiwCEXqsdc5lin1bAIe7FHBhsdMAnjJHoXDVgcX04vjkNZPKJGU7yQ+5qi
hIzXviKlOYK8sPIIzZNcgk8AubwTG/jaUT2iFFvyd6RlnBpmLv43Jz7i6ZwxeLMM
Q/glITHXO5/7k5Wmj9k0FywmZmnKf5d2GxyDzqGcWZCjS/mhtHR9pErWkzRLQIDf
1cgVHwvq+D8ULq2DjITpc6Bc9hMlmu9ixUaM0ND7N+KYDEDY5XCBluo4xXrJmeH0
SQvVQnKnAgMBAAECggEAQ92Yfo9U3DnehZwAbzHv5MHS/Mj/xFWcfvC4unChuLkc
I9E9U1qPIhvDAe/zYPbimS0JOKalXylEvH3zcVxv0OVbGWTCglybBJjCzFRxqCxy
f+xkyEtX9vTvXS4ZrxbfRR0b7zYKaG7sorbwgidUQY7ZRxEyUszI+UJSnHy+dpeg
000TbDaq2i4evn3dqvVdKzTvnrJZ53AGuFd+blJ4P0zwccp8IXVyhj04d0bQdT16
UGv/CBwI/j9jtx0YvOVDXY35F+taBV+SiTP+Ok2O7ERPgYBwgk7AONPQudhcgn0U
ICKDtmaVWprt260+49wNzn5YUzMAQqLT+WXxM2j+gQKBgQDZzWI1wZ74EUmQyvsz
/1pCpcNbeKv3EQfaweQ1qJROxG1oUflMMeWj7LoyOnNiYq1Zh6jCKBnkWlMdOmqG
r9F5ca/YaxCioVJm80PHrqKAA5JqLsIGSQZb79s0g6shAfRL9bbXzFUQLgqzKRXb
3A5FfB1P6+e6QxOdOAy13bsp4QKBgQC2HPOJbQqB49jCP6RFA6dWxYqsm7fVhITo
skRNoHI3lRrOtYJDNrBFwxNuos9y0DvVwJZsFhUmnNMno03bhHHqfNOxvRsROGhZ
l3hXNJnkw63a+t0gfSXpjc/pvP7D4gk2Yj33hyfoh4rR8xl5CxVCFBTSc7gRxYwT
3NczTKz9hwKBgBW6YZPPTxacUuR4+3qCfPStKMIVVcJ+FnSCZ0vbF4CMJAYGN4Kc
b7ZcxW6BWkV0ZqrJ19IWwg5/3E7MJxhsrc8ZwlsqwywWP+w5VIe1KkzvDko9g+mw
m0vMr+ebQxU15rM1PhplLg9BKJwa+y1F1L6l1R7GAAYa7vf+QXZbOnLBAoGALtbT
bI03HqFTpuJnhbii2ZaFTE/gwHINHSx8lNqnhdQ7yN62WkM+ozLBVLtbT9RvD1Mx
XStw1TWQuaku5T7zbbQdXqGczJkNfb2Pnh5RVp1doezT4v9NOPzYdO2/OPJyHCK4
fWmtwgjak5VK/+7x0MUJdfd9aFS+6nzqfK9D7xECgYEAksLM5JsvaE0xJ06fOjjt
m2GZE7KJ1OyKfvoyZJLwXpd6UM3SszrgVSN9QEVCIaz/Cwh7lYlvY5p2v6nBiuDd
1TFeu/pbdwQwLT+sXaugTQwOqN5uNT1StSoWphQ6mLWJh2MF0HqWcfzvFhIQ+hmN
PdYcxDG9YxXbS2Z/bfORmq0=
-----END PRIVATE KEY-----`)},
			},
		},
	}

	// Start HTTPS server
	err := s.ListenAndServeTLS("", "")
	if err != nil {
		return err
	}

	return nil
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
