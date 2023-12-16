package db

import (
	"context"
	"database/sql"
	"fmt"
)

type Store interface {
	Querier
}

type SortableStore interface {
	Store
	ListClientsSorted(ctx context.Context, arg ListClientsParams, sortField string, sortDirection string) ([]Client, error)
	SearchClients(ctx context.Context, search string, pageId int, pageSize int, sortField string, sortDirection string) ([]Client, error)
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
		if err := rows.Scan(&client.ID, &client.FullName, &client.PhoneWhatsapp, &client.PhoneLine, &client.PetName, &client.PetBreed, &client.AddressStreet, &client.AddressNumber, &client.AddressNeighborhood, &client.AddressReference); err != nil {
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
        LOWER(address_number) LIKE LOWER($1) OR 
        LOWER(address_neighborhood) LIKE LOWER($1) OR 
        LOWER(address_reference) LIKE LOWER($1)`

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
		if err = rows.Scan(&c.ID, &c.FullName, &c.PhoneWhatsapp, &c.PhoneLine, &c.PetName, &c.PetBreed, &c.AddressStreet, &c.AddressNumber, &c.AddressNeighborhood, &c.AddressReference); err != nil {
			return nil, err
		}
		clients = append(clients, c)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return clients, nil
}
