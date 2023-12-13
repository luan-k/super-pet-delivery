package db

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type CustomQuerier interface {
	Querier
	ListClientsSorted(ctx context.Context, arg ListClientsParams, sortField string, sortDirection string) ([]Client, error)
}

type CustomQueries struct {
	*Queries
	db *sqlx.DB // or *sqlx.Tx if you're using a transaction
}

func NewCustomQueries(db *sqlx.DB, q *Queries) *CustomQueries {
	return &CustomQueries{
		Queries: q,
		db:      db,
	}
}
func (q *CustomQueries) ListClientsSorted(ctx context.Context, arg ListClientsParams, sortField string, sortDirection string) ([]Client, error) {
	query := fmt.Sprintf(`SELECT * FROM client ORDER BY %s %s LIMIT $1 OFFSET $2`, sortField, sortDirection)
	rows, err := q.db.QueryxContext(ctx, query, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []Client
	for rows.Next() {
		var c Client
		if err := rows.StructScan(&c); err != nil {
			return nil, err
		}
		clients = append(clients, c)
	}

	return clients, nil
}
