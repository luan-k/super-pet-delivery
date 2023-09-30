package api

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
	db "super-pet-delivery/db/sqlc"
	"text/template"
	"time"

	"github.com/gin-gonic/gin"
)

type Sale struct {
	ID          int64     `json:"id"`
	ClientID    int64     `json:"client_id"`
	Product     string    `json:"product"`
	Price       int64     `json:"price"`
	Observation string    `json:"observation"`
	CreatedAt   time.Time `json:"created_at"`
}

type Client struct {
	ID                  int64  `json:"id"`
	FullName            string `json:"full_name"`
	PhoneWhatsApp       string `json:"phone_whatsapp"`
	PhoneLine           string `json:"phone_line"`
	PetName             string `json:"pet_name"`
	PetBreed            string `json:"pet_breed"`
	AddressStreet       string `json:"address_street"`
	AddressNumber       string `json:"address_number"`
	AddressNeighborhood string `json:"address_neighborhood"`
	AddressReference    string `json:"address_reference"`
}

func (server *Server) fetchSaleData(saleID int64, ctx *gin.Context) (*db.Sale, error) {
	// Use your custom store method to fetch sale data
	sale, err := server.store.GetSale(ctx, saleID)
	if err != nil {
		return nil, err
	}

	// Return a pointer to the sale data
	return &sale, nil
}

func (server *Server) fetchClientData(clientID int64, ctx *gin.Context) (*db.Client, error) {
	// Use your custom store method to fetch client data
	client, err := server.store.GetClient(ctx, clientID)
	if err != nil {
		return nil, err
	}

	// Return a pointer to the client data
	return &client, nil
}

func (server *Server) createPdf(ctx *gin.Context) {
	// Get the sale ID from the URL parameter
	saleIDStr := ctx.Param("id")
	saleID, err := strconv.ParseInt(saleIDStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sale ID"})
		return
	}

	// Fetch sale data from the API
	sale, err := server.fetchSaleData(saleID, ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sale data"})
		return
	}

	// Fetch client data using the client_id from the sale response
	client, err := server.fetchClientData(sale.ClientID, ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch client data"})
		return
	}

	// Define an HTML template
	htmlTemplate := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sale Details</title>
    </head>
    <body>
        <img style="width: 210px;" src="img.png" />
        <h1>Sale Details</h1>
        <p>ID: {{.Sale.ID}}</p>
        <p>Product: {{.Sale.Product}}</p>
        <p>Price: ${{.Sale.Price}}</p>
        <p>Observation: {{.Sale.Observation}}</p>
        <p>Created At: {{.Sale.CreatedAt}}</p>
        
        <h1>Client Details</h1>
        <p>ID: {{.Client.ID}}</p>
        <p>Full Name: {{.Client.FullName}}</p>
        <p>Phone (WhatsApp): {{.Client.PhoneWhatsApp}}</p>
        <p>Phone (Line): {{.Client.PhoneLine}}</p>
        <p>Pet Name: {{.Client.PetName}}</p>
        <p>Pet Breed: {{.Client.PetBreed}}</p>
        <p>Address Street: {{.Client.AddressStreet}}</p>
        <p>Address Number: {{.Client.AddressNumber}}</p>
        <p>Address Neighborhood: {{.Client.AddressNeighborhood}}</p>
        <p>Address Reference: {{.Client.AddressReference}}</p>
    </body>
    </html>
    `

	// Specify the file path where you want to save the HTML file
	filePath := "api/pdf/index.html"

	// Create the HTML file
	file, err := os.Create(filePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create HTML file"})
		return
	}
	defer file.Close()

	// Execute the template with the sale and client data and write the result to the file
	tmpl, err := template.New("html").Parse(htmlTemplate)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse HTML template"})
		return
	}

	rspSale := &Sale{
		ID:          sale.ID,
		ClientID:    sale.ClientID,
		Product:     sale.Product,
		Price:       sale.Price,
		Observation: sale.Observation,
		CreatedAt:   sale.CreatedAt,
	}
	rspClient := &Client{
		ID:                  client.ID,
		FullName:            client.FullName,
		PhoneWhatsApp:       client.PhoneWhatsapp,
		PhoneLine:           client.PhoneLine,
		PetName:             client.PetName,
		PetBreed:            client.PetBreed,
		AddressStreet:       client.AddressStreet,
		AddressNumber:       client.AddressNumber,
		AddressNeighborhood: client.AddressNeighborhood,
		AddressReference:    client.AddressReference,
	}

	// Now you can use the converted sale and client in your struct literal
	data := struct {
		Sale   *Sale
		Client *Client
	}{
		Sale:   rspSale,
		Client: rspClient,
	}

	err = tmpl.Execute(file, data)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute HTML template"})
		return
	}

	// Introduce a delay (e.g., 1 second) before starting the Gotenberg command
	time.Sleep(3 * time.Second)

	// Use Gotenberg to convert the HTML to PDF, including the image parameter
	pdfFilePath := "test.pdf"
	err2 := convertHTMLToPDF(filePath, "api/pdf/img.png", pdfFilePath)
	if err2 != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert HTML to PDF using Go"})
		return
	}

	// Return the PDF file as a response
	ctx.File(pdfFilePath)
}

func convertHTMLToPDF(filePath, imgPath, pdfPath string) error {
	// Create a buffer to store the form data
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	// Add the HTML file
	htmlFile, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer htmlFile.Close()

	htmlPart, err := writer.CreateFormFile("files", "index.html")
	if err != nil {
		return err
	}
	_, err = io.Copy(htmlPart, htmlFile)
	if err != nil {
		return err
	}

	// Add the image file
	imgFile, err := os.Open(imgPath)
	if err != nil {
		return err
	}
	defer imgFile.Close()

	imgPart, err := writer.CreateFormFile("files", "img.png")
	if err != nil {
		return err
	}
	_, err = io.Copy(imgPart, imgFile)
	if err != nil {
		return err
	}

	// Close the multipart writer
	writer.Close()

	// Create a POST request to Gotenberg
	req, err := http.NewRequest("POST", "http://gotenberg:3000/forms/chromium/convert/html", &requestBody)
	if err != nil {
		return err
	}

	// Set the content type for the request
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Send the POST request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Check if the request was successful
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("api request failed with status code: %d", resp.StatusCode)
	}

	// Create the PDF file
	pdfFile, err := os.Create(pdfPath)
	if err != nil {
		return err
	}
	defer pdfFile.Close()

	// Copy the response body (PDF content) to the PDF file
	_, err = io.Copy(pdfFile, resp.Body)
	if err != nil {
		return err
	}

	return nil
}

/* curl \
--request POST 'http://pdf-generator:3000/forms/chromium/convert/html' \
--form 'files=@"api/pdf/index.html"' \
--form 'files=@"api/pdf/img.png"' \
-o test.pdf */
