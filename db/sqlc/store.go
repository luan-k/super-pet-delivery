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
	query := fmt.Sprintf("SELECT * FROM clients ORDER BY %s %s LIMIT $1 OFFSET $2", sortField, sortDirection)

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
		if err := rows.Scan(&client.ID, &client.FullName, &client.PetName, &client.PhoneWhatsapp); err != nil {
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
