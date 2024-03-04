package db

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/lib/pq"
)

type Store interface {
	Querier
}

type SortableStore interface {
	Store
	ListClientsSorted(ctx context.Context, arg ListClientsParams, sortField string, sortDirection string) ([]Client, error)
	SearchClients(ctx context.Context, search string, pageId int, pageSize int, sortField string, sortDirection string) ([]Client, error)
	ListSalesSorted(ctx context.Context, arg ListSalesParams, sortField string, sortDirection string) ([]Sale, error)
	SearchSales(ctx context.Context, search string, pageId int, pageSize int, sortField string, sortDirection string) ([]Sale, error)
	ListProductsSorted(ctx context.Context, arg ListProductsParams, sortField string, sortDirection string) ([]Product, error)
	SearchProducts(ctx context.Context, search string, pageId int, pageSize int, sortField string, sortDirection string) ([]Product, error)
}

// Store provides all functions to execute db queries and transaction
type SQLStore struct {
	db *sql.DB
	*Queries
}
type SortableSQLStore struct {
	*SQLStore
}

// NewStore creates a new store
func NewStore(db *sql.DB) Store {
	return &SQLStore{
		db:      db,
		Queries: New(db),
	}
}

func NewSortableStore(db *sql.DB) SortableStore {
	return &SortableSQLStore{
		SQLStore: NewStore(db).(*SQLStore),
	}
}

func (store *SortableSQLStore) ListClientsSorted(ctx context.Context, arg ListClientsParams, sortField string, sortDirection string) ([]Client, error) {
	// Define a map of valid sort fields and directions
	validSortFields := map[string]bool{"full_name": true, "pet_name": true, "phone_whatsapp": true}
	validSortDirections := map[string]bool{"asc": true, "desc": true}

	// Validate the sort field and direction
	if !validSortFields[sortField] {
		return nil, fmt.Errorf("invalid sort field: %s", sortField)
	}
	if !validSortDirections[sortDirection] {
		return nil, fmt.Errorf("invalid sort direction: %s", sortDirection)
	}

	// Create the SQL query
	query := fmt.Sprintf("SELECT * FROM client ORDER BY %s %s LIMIT $1 OFFSET $2", sortField, sortDirection)
	fmt.Println(query)
	// Execute the query
	rows, err := store.db.QueryContext(ctx, query, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a Client slice
	var clients []Client
	for rows.Next() {
		var client Client
		if err := rows.Scan(&client.ID, &client.FullName, &client.PhoneWhatsapp, &client.PhoneLine, &client.PetName, &client.PetBreed, &client.AddressStreet, &client.AddressCity, &client.AddressNumber, &client.AddressNeighborhood, &client.AddressReference, &client.CreatedAt, &client.ChangedAt); err != nil {
			return nil, err
		}
		clients = append(clients, client)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return clients, nil
}

func (store *SortableSQLStore) SearchClients(ctx context.Context, search string, pageId int, pageSize int, sortField string, sortDirection string) ([]Client, error) {
	offset := (pageId - 1) * pageSize

	query := `SELECT * FROM client WHERE 
        LOWER(full_name) LIKE LOWER($1) OR 
        LOWER(phone_whatsapp) LIKE LOWER($1) OR 
        LOWER(phone_line) LIKE LOWER($1) OR 
        LOWER(pet_name) LIKE LOWER($1) OR 
        LOWER(pet_breed) LIKE LOWER($1) OR 
        LOWER(address_street) LIKE LOWER($1) OR 
		LOWER(address_city) LIKE LOWER($1) OR
        LOWER(address_number) LIKE LOWER($1) OR 
        LOWER(address_neighborhood) LIKE LOWER($1) OR 
        LOWER(address_reference) LIKE LOWER($1) OR
		CAST(id AS TEXT) LIKE LOWER($1)`

	if sortField != "" && sortDirection != "" {
		query += fmt.Sprintf(" ORDER BY %s %s", sortField, sortDirection)
	}

	query += " LIMIT $2 OFFSET $3"

	rows, err := store.db.QueryContext(ctx, query, "%"+search+"%", pageSize, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []Client
	for rows.Next() {
		var c Client
		if err = rows.Scan(&c.ID, &c.FullName, &c.PhoneWhatsapp, &c.PhoneLine, &c.PetName, &c.PetBreed, &c.AddressStreet, &c.AddressCity, &c.AddressNumber, &c.AddressNeighborhood, &c.AddressReference, &c.CreatedAt, &c.ChangedAt); err != nil {
			return nil, err
		}
		clients = append(clients, c)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return clients, nil
}

func (store *SortableSQLStore) ListSalesSorted(ctx context.Context, arg ListSalesParams, sortField string, sortDirection string) ([]Sale, error) {
	// Define a map of valid sort fields and directions
	validSortFields := map[string]bool{"product": true, "price": true, "created_at": true, "client_name": true}
	validSortDirections := map[string]bool{"asc": true, "desc": true}

	// If sortField is provided, validate it
	if sortField != "" {
		if !validSortFields[sortField] {
			return nil, fmt.Errorf("invalid sort field: %s", sortField)
		}
	} else {
		// If sortField is not provided, use a default value
		sortField = "product"
	}

	// If sortDirection is provided, validate it
	if sortDirection != "" {
		if !validSortDirections[sortDirection] {
			return nil, fmt.Errorf("invalid sort direction: %s", sortDirection)
		}
	} else {
		// If sortDirection is not provided, use a default value
		sortDirection = "asc"
	}

	// Create the SQL query
	query := fmt.Sprintf("SELECT * FROM sale ORDER BY %s %s LIMIT $1 OFFSET $2", sortField, sortDirection)

	// Execute the query
	rows, err := store.db.QueryContext(ctx, query, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a Sale slice
	var sales []Sale
	for rows.Next() {
		var sale Sale
		if err := rows.Scan(&sale.ID, &sale.ClientID, &sale.ClientName, &sale.Product, &sale.Price, &sale.Observation, &sale.CreatedAt, &sale.ChangedAt, &sale.PdfGeneratedAt); err != nil {
			return nil, err
		}
		sales = append(sales, sale)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return sales, nil
}

func (store *SortableSQLStore) SearchSales(ctx context.Context, search string, pageId int, pageSize int, sortField string, sortDirection string) ([]Sale, error) {
	offset := (pageId - 1) * pageSize

	query := `SELECT * FROM sale WHERE 
        LOWER(product) LIKE LOWER($1) OR 
		LOWER(client_name) LIKE LOWER($1) OR
        LOWER(observation) LIKE LOWER($1) OR
        CAST(price AS TEXT) LIKE LOWER($1) OR
		CAST(id AS TEXT) LIKE LOWER ($1)`

	if sortField != "" && sortDirection != "" {
		query += fmt.Sprintf(" ORDER BY %s %s", sortField, sortDirection)
	}

	query += " LIMIT $2 OFFSET $3"

	rows, err := store.db.QueryContext(ctx, query, "%"+search+"%", pageSize, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sales []Sale
	for rows.Next() {
		var s Sale
		if err = rows.Scan(&s.ID, &s.ClientID, &s.ClientName, &s.Product, &s.Price, &s.Observation, &s.CreatedAt, &s.ChangedAt, &s.PdfGeneratedAt); err != nil {
			return nil, err
		}
		sales = append(sales, s)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sales, nil
}

func (store *SortableSQLStore) ListProductsSorted(ctx context.Context, arg ListProductsParams, sortField string, sortDirection string) ([]Product, error) {
	// Define a map of valid sort fields and directions
	validSortFields := map[string]bool{"name": true, "description": true, "price": true, "username": true, "sku": true}
	validSortDirections := map[string]bool{"asc": true, "desc": true}

	// Validate the sort field and direction
	if !validSortFields[sortField] {
		return nil, fmt.Errorf("invalid sort field: %s", sortField)
	}
	if !validSortDirections[sortDirection] {
		return nil, fmt.Errorf("invalid sort direction: %s", sortDirection)
	}

	// Create the SQL query
	query := fmt.Sprintf("SELECT * FROM products ORDER BY %s %s LIMIT $1 OFFSET $2", sortField, sortDirection)

	// Execute the query
	rows, err := store.db.QueryContext(ctx, query, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Scan the results into a Product slice
	var products []Product
	for rows.Next() {
		var product Product
		if err := rows.Scan(&product.ID, &product.Name, &product.Description, &product.UserID, &product.Username, &product.Price, &product.Sku, pq.Array(&product.Images), &product.CreatedAt, &product.ChangedAt); err != nil {
			return nil, err
		}
		products = append(products, product)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return products, nil
}

func (store *SortableSQLStore) SearchProducts(ctx context.Context, search string, pageId int, pageSize int, sortField string, sortDirection string) ([]Product, error) {
	offset := (pageId - 1) * pageSize

	query := `SELECT * FROM products WHERE
        LOWER(name) LIKE LOWER($1) OR
        LOWER(description) LIKE LOWER($1) OR
        CAST(price AS TEXT) LIKE LOWER($1) OR
        LOWER(username) LIKE LOWER($1) OR
		LOWER(sku) LIKE LOWER($1)`

	if sortField != "" && sortDirection != "" {
		query += fmt.Sprintf(" ORDER BY %s %s", sortField, sortDirection)
	}

	query += " LIMIT $2 OFFSET $3"

	rows, err := store.db.QueryContext(ctx, query, "%"+search+"%", pageSize, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		if err = rows.Scan(&p.ID, &p.Name, &p.Description, &p.UserID, &p.Username, &p.Price, &p.Sku, pq.Array(&p.Images), &p.CreatedAt, &p.ChangedAt); err != nil {
			return nil, err
		}
		products = append(products, p)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return products, nil
}
