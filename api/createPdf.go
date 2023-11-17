package api

import (
	"bytes"
	"fmt"
	"html/template"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
	db "super-pet-delivery/db/sqlc"
	"time"

	"github.com/gin-gonic/gin"
)

type Sale struct {
	ID          int64     `json:"sale_id"`
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

type createPdfRequest struct {
	SaleId []int64 `json:"sale_id" validate:"required"`
}

type Report struct {
	Sale
	Client
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
	var req createPdfRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	var report []Report

	//result := req.saleID[0]

	for _, saleid := range req.SaleId {
		fmt.Printf("\n sale Id: %d", saleid)
	}

	//report
	for _, requestSaleId := range req.SaleId {
		sale, err := server.fetchSaleData(requestSaleId, ctx)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sale data"})
			return
		}

		saleArg := Sale{
			ID:          sale.ID,
			ClientID:    sale.ClientID,
			Product:     sale.Product,
			Price:       sale.Price,
			Observation: sale.Observation,
		}

		// Fetch client data using the client_id from the sale response
		client, err := server.fetchClientData(sale.ClientID, ctx)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch client data"})
			return
		}

		clientArg := Client{
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

		// Create a new Report entry and assign the dereferenced Sale
		reportEntry := Report{
			Sale:   saleArg,   // Dereference the pointer here
			Client: clientArg, // You need to fetch client data and assign it here
		}

		// Append the Report entry to the report slice
		report = append(report, reportEntry)
	}

	// Create a new buffer to store the HTML output
	var htmlBuffer = new(strings.Builder)

	// Define the HTML template with a loop for sections
	htmlTemplate := `
	    <!DOCTYPE html>
	    <html>
	    <head>
	        <title>Sale Details</title>
	    </head>
	    <body>
			{{range .Reports}}
				<section>
					<h1>Sale code: {{.Sale.ID}}</h1>
					<img style="width: 210px;" src="img.png" />
					<h2>Sale Details</h2>
					<p>ID: {{.Sale.ID}}</p>
					<p>Product: {{.Sale.Product}}</p>
					<p>Price: ${{.Sale.Price}}</p>
					<p>Observation: {{.Sale.Observation}}</p>
					<p>Created At: {{.Sale.CreatedAt}}</p>

					<h2>Client Details</h2>
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
				</section>
			{{end}}
	    </body>
	    </html>
	`

	// Parse the HTML template
	tmpl, err := template.New("pdf").Parse(htmlTemplate)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse HTML template"})
		return
	}

	// Create a structure to pass to the template
	templateData := struct {
		Reports []Report
	}{
		Reports: report,
	}

	// Execute the template with the data and write to the buffer
	err = tmpl.Execute(htmlBuffer, templateData)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute HTML template"})
		return
	}

	// Save the generated HTML to a single file
	filePath := "api/pdf/index.html"
	err = os.WriteFile(filePath, []byte(htmlBuffer.String()), 0644)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save HTML file"})
		return
	}
	// For demonstration purposes, you can print the HTML to the console
	fmt.Println(htmlBuffer.String())

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
	//ctx.JSON(http.StatusOK, report)
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
