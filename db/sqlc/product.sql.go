// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0
// source: product.sql

package db

import (
	"context"

	"github.com/lib/pq"
)

const countProducts = `-- name: CountProducts :one
SELECT COUNT(*) FROM products
`

func (q *Queries) CountProducts(ctx context.Context) (int64, error) {
	row := q.db.QueryRowContext(ctx, countProducts)
	var count int64
	err := row.Scan(&count)
	return count, err
}

const createProduct = `-- name: CreateProduct :one
INSERT INTO products (
    name,
    description,
    user_id,
    username,
    price,
    images
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING id, name, description, user_id, price, images, username
`

type CreateProductParams struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	UserID      int64    `json:"user_id"`
	Username    string   `json:"username"`
	Price       string   `json:"price"`
	Images      []string `json:"images"`
}

func (q *Queries) CreateProduct(ctx context.Context, arg CreateProductParams) (Product, error) {
	row := q.db.QueryRowContext(ctx, createProduct,
		arg.Name,
		arg.Description,
		arg.UserID,
		arg.Username,
		arg.Price,
		pq.Array(arg.Images),
	)
	var i Product
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.UserID,
		&i.Price,
		pq.Array(&i.Images),
		&i.Username,
	)
	return i, err
}

const deleteProduct = `-- name: DeleteProduct :exec
DELETE FROM products 
WHERE id = $1
`

func (q *Queries) DeleteProduct(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteProduct, id)
	return err
}

const getProduct = `-- name: GetProduct :one
SELECT id, name, description, user_id, price, images, username FROM products 
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetProduct(ctx context.Context, id int64) (Product, error) {
	row := q.db.QueryRowContext(ctx, getProduct, id)
	var i Product
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.UserID,
		&i.Price,
		pq.Array(&i.Images),
		&i.Username,
	)
	return i, err
}

const listProducts = `-- name: ListProducts :many
SELECT id, name, description, user_id, price, images, username FROM products 
ORDER BY id
LIMIT $1
OFFSET $2
`

type ListProductsParams struct {
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListProducts(ctx context.Context, arg ListProductsParams) ([]Product, error) {
	rows, err := q.db.QueryContext(ctx, listProducts, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Product{}
	for rows.Next() {
		var i Product
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.UserID,
			&i.Price,
			pq.Array(&i.Images),
			&i.Username,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listProductsByCategory = `-- name: ListProductsByCategory :many
SELECT p.id, p.name, p.description, p.user_id, p.price, p.images, p.username
FROM products p
JOIN product_categories pc ON p.id = pc.product_id
WHERE pc.category_id = $1
ORDER BY p.id
LIMIT $2
OFFSET $3
`

type ListProductsByCategoryParams struct {
	CategoryID int64 `json:"category_id"`
	Limit      int32 `json:"limit"`
	Offset     int32 `json:"offset"`
}

func (q *Queries) ListProductsByCategory(ctx context.Context, arg ListProductsByCategoryParams) ([]Product, error) {
	rows, err := q.db.QueryContext(ctx, listProductsByCategory, arg.CategoryID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Product{}
	for rows.Next() {
		var i Product
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.UserID,
			&i.Price,
			pq.Array(&i.Images),
			&i.Username,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listProductsByUser = `-- name: ListProductsByUser :many
SELECT id, name, description, user_id, price, images, username FROM products
WHERE user_id = $1
ORDER BY id
`

func (q *Queries) ListProductsByUser(ctx context.Context, userID int64) ([]Product, error) {
	rows, err := q.db.QueryContext(ctx, listProductsByUser, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Product{}
	for rows.Next() {
		var i Product
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.UserID,
			&i.Price,
			pq.Array(&i.Images),
			&i.Username,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateProduct = `-- name: UpdateProduct :one
UPDATE  products 
SET 
    name = COALESCE($2, name),
    description = COALESCE($3, description),
    user_id = COALESCE($4, user_id),
    username = COALESCE($5, username),
    price = COALESCE($6, price),
    images = COALESCE($7, images)
WHERE id = $1
RETURNING id, name, description, user_id, price, images, username
`

type UpdateProductParams struct {
	ID          int64    `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	UserID      int64    `json:"user_id"`
	Username    string   `json:"username"`
	Price       string   `json:"price"`
	Images      []string `json:"images"`
}

func (q *Queries) UpdateProduct(ctx context.Context, arg UpdateProductParams) (Product, error) {
	row := q.db.QueryRowContext(ctx, updateProduct,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.UserID,
		arg.Username,
		arg.Price,
		pq.Array(arg.Images),
	)
	var i Product
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.UserID,
		&i.Price,
		pq.Array(&i.Images),
		&i.Username,
	)
	return i, err
}
