package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"
	"os/exec"
)

type Sale struct {
	ID          int64  `json:"id"`
	ClientID    int64  `json:"client_id"`
	Product     string `json:"product"`
	Price       int    `json:"price"`
	Observation string `json:"observation"`
	CreatedAt   string `json:"created_at"`
	// Add more fields as needed
}

func fetchSaleData(saleID int64) (*Sale, error) {
	// Define the API URL with the sale ID
	apiURL := fmt.Sprintf("http://localhost:8080/sales/%d", saleID)

	// Make an HTTP GET request to fetch sale data
	response, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status code: %d", response.StatusCode)
	}

	// Parse the JSON response
	var sale Sale
	data, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(data, &sale); err != nil {
		return nil, err
	}

	return &sale, nil
}

func main() {
	// Define the sale ID you want to retrieve
	saleID := int64(33)

	// Fetch sale data from the API
	sale, err := fetchSaleData(saleID)
	if err != nil {
		fmt.Println("Error fetching sale data from API:", err)
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
        <img style="width: 333px;" src="img.png" />
        <h1>Sale Details</h1>
        <p>ID: {{.ID}}</p>
        <p>Product: {{.Product}}</p>
        <p>Price: ${{.Price}}</p>
        <p>Observation: {{.Observation}}</p>
        <p>Created At: {{.CreatedAt}}</p>
    </body>
    </html>
    `

	// Specify the file path where you want to save the HTML file
	filePath := "index.html"

	// Create the HTML file
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	// Execute the template with the sale data and write the result to the file
	tmpl, err := template.New("html").Parse(htmlTemplate)
	if err != nil {
		fmt.Println("Error parsing HTML template:", err)
		return
	}

	err = tmpl.Execute(file, sale)
	if err != nil {
		fmt.Println("Error executing template:", err)
		return
	}

	fmt.Println("HTML file generated successfully at", filePath)

	// Use Gotenberg to convert the HTML to PDF, including the image parameter
	pdfFilePath := "test.pdf"
	gotenbergCmd := exec.Command("curl", "--request", "POST", "http://localhost:3000/forms/chromium/convert/html", "--form", fmt.Sprintf("files=@\"%s\"", filePath), "--form", "files=@\"img.png\"", "-o", pdfFilePath)

	// Run the Gotenberg command and wait for it to finish
	err = gotenbergCmd.Run()
	if err != nil {
		fmt.Println("Error converting HTML to PDF using Gotenberg:", err)
		return
	}

	fmt.Println("HTML converted to PDF successfully at", pdfFilePath)
}
