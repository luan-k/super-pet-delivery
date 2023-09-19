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

func fetchClientData(clientID int64) (*Client, error) {
	// Define the API URL with the client ID
	apiURL := fmt.Sprintf("http://localhost:8080/clients/%d", clientID)

	// Make an HTTP GET request to fetch client data
	response, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status code: %d", response.StatusCode)
	}

	// Parse the JSON response
	var client Client
	data, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(data, &client); err != nil {
		return nil, err
	}

	return &client, nil
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

	// Fetch client data using the client_id from the sale response
	client, err := fetchClientData(sale.ClientID)
	if err != nil {
		fmt.Println("Error fetching client data from API:", err)
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
	filePath := "index.html"

	// Create the HTML file
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	// Execute the template with the sale and client data and write the result to the file
	tmpl, err := template.New("html").Parse(htmlTemplate)
	if err != nil {
		fmt.Println("Error parsing HTML template:", err)
		return
	}

	data := struct {
		Sale   *Sale
		Client *Client
	}{
		Sale:   sale,
		Client: client,
	}

	err = tmpl.Execute(file, data)
	if err != nil {
		fmt.Println("Error executing template:", err)
		return
	}

	fmt.Println("HTML file generated successfully at", filePath)

	// Use Gotenberg to convert the HTML to PDF, including the image parameter
	pdfFilePath := "test.pdf"
	// Run the Gotenberg command
	gotenbergCmd := exec.Command("curl", "--request", "POST", "http://localhost:3000/forms/chromium/convert/html", "--form", fmt.Sprintf("files=@\"%s\"", filePath), "--form", "files=@\"img.png\"", "-o", pdfFilePath)

	// Start the command
	if err := gotenbergCmd.Start(); err != nil {
		fmt.Println("Error starting Gotenberg command:", err)
		return
	}

	// Wait for the command to finish
	if err := gotenbergCmd.Wait(); err != nil {
		fmt.Println("Error waiting for Gotenberg command to finish:", err)
		return
	}

	fmt.Println("HTML converted to PDF successfully at", pdfFilePath)
}
