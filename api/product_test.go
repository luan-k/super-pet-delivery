package api

import (
	"bytes"
	"encoding/json"
	"io"
	db "super-pet-delivery/db/sqlc"
	"super-pet-delivery/util"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestCreateProductAPI(t *testing.T) {

}

// randomProduct generates a random product for testing
func randomProduct() db.Product {
	return db.Product{
		ID:          util.RandomInt(1, 1000),
		Name:        util.RandomString(10),
		Description: util.RandomString(50),
		UserID:      util.RandomInt(1, 1000),
	}
}

// requireBodyMatchProduct checks if the response body matches the expected product
func requireBodyMatchProduct(t *testing.T, body *bytes.Buffer, product db.Product) {
	data, err := io.ReadAll(body)
	require.NoError(t, err)

	var gotProduct db.Product
	err = json.Unmarshal(data, &gotProduct)
	require.NoError(t, err)
	require.Equal(t, product, gotProduct)
}

// TestGetProductAPI tests the GetProduct API endpoint.
func TestGetProductAPI(t *testing.T) {
	// TODO: Implement test cases for getting a product by ID.
}

// TestListProductAPI tests the ListProducts API endpoint.
func TestListProductAPI(t *testing.T) {
	// TODO: Implement test cases for listing products.
}

// TestListProductsByUserAPI tests the ListProductsByUser API endpoint.
func TestListProductsByUserAPI(t *testing.T) {
	// TODO: Implement test cases for listing products by user ID.
}

// TestUpdateProductAPI tests the UpdateProduct API endpoint.
func TestUpdateProductAPI(t *testing.T) {
	// TODO: Implement test cases for updating a product.
}

// TestDeleteProductAPI tests the DeleteProduct API endpoint.
func TestDeleteProductAPI(t *testing.T) {
	// TODO: Implement test cases for deleting a product.
}
