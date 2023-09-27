// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0
// source: image.sql

package db

import (
	"context"
)

const associateProductWithImage = `-- name: AssociateProductWithImage :one
INSERT INTO product_images (product_id, image_id)
VALUES ($1, $2)
RETURNING product_id, image_id
`

type AssociateProductWithImageParams struct {
	ProductID int64 `json:"product_id"`
	ImageID   int64 `json:"image_id"`
}

func (q *Queries) AssociateProductWithImage(ctx context.Context, arg AssociateProductWithImageParams) (ProductImage, error) {
	row := q.db.QueryRowContext(ctx, associateProductWithImage, arg.ProductID, arg.ImageID)
	var i ProductImage
	err := row.Scan(&i.ProductID, &i.ImageID)
	return i, err
}

const createImage = `-- name: CreateImage :one
INSERT INTO images (
    name,
    description,
    alt,
    image_path
) VALUES (
    $1, $2, $3, $4
) RETURNING id, name, description, alt, image_path
`

type CreateImageParams struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Alt         string `json:"alt"`
	ImagePath   string `json:"image_path"`
}

func (q *Queries) CreateImage(ctx context.Context, arg CreateImageParams) (Image, error) {
	row := q.db.QueryRowContext(ctx, createImage,
		arg.Name,
		arg.Description,
		arg.Alt,
		arg.ImagePath,
	)
	var i Image
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Alt,
		&i.ImagePath,
	)
	return i, err
}

const deleteImage = `-- name: DeleteImage :exec
DELETE FROM images 
WHERE id = $1
`

func (q *Queries) DeleteImage(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteImage, id)
	return err
}

const disassociateProductFromImage = `-- name: DisassociateProductFromImage :one
DELETE FROM product_images
WHERE product_id = $1 AND image_id = $2
RETURNING product_id, image_id
`

type DisassociateProductFromImageParams struct {
	ProductID int64 `json:"product_id"`
	ImageID   int64 `json:"image_id"`
}

func (q *Queries) DisassociateProductFromImage(ctx context.Context, arg DisassociateProductFromImageParams) (ProductImage, error) {
	row := q.db.QueryRowContext(ctx, disassociateProductFromImage, arg.ProductID, arg.ImageID)
	var i ProductImage
	err := row.Scan(&i.ProductID, &i.ImageID)
	return i, err
}

const getImage = `-- name: GetImage :one
SELECT id, name, description, alt, image_path FROM images 
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetImage(ctx context.Context, id int64) (Image, error) {
	row := q.db.QueryRowContext(ctx, getImage, id)
	var i Image
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Alt,
		&i.ImagePath,
	)
	return i, err
}

const listImages = `-- name: ListImages :many
SELECT id, name, description, alt, image_path FROM images 
ORDER BY id
LIMIT $1
OFFSET $2
`

type ListImagesParams struct {
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListImages(ctx context.Context, arg ListImagesParams) ([]Image, error) {
	rows, err := q.db.QueryContext(ctx, listImages, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Image{}
	for rows.Next() {
		var i Image
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.Alt,
			&i.ImagePath,
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

const listImagesByProduct = `-- name: ListImagesByProduct :many
SELECT c.id, c.name, c.description, c.alt, c.image_path
FROM images c
JOIN product_images pc ON c.id = pc.image_id
WHERE pc.product_id = $1
ORDER BY c.id
`

func (q *Queries) ListImagesByProduct(ctx context.Context, productID int64) ([]Image, error) {
	rows, err := q.db.QueryContext(ctx, listImagesByProduct, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []Image{}
	for rows.Next() {
		var i Image
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Description,
			&i.Alt,
			&i.ImagePath,
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

const updateImage = `-- name: UpdateImage :one
UPDATE images 
SET 
    name = COALESCE($2, name),
    description = COALESCE($3, description),
    alt = COALESCE($4, alt)
WHERE id = $1
RETURNING id, name, description, alt, image_path
`

type UpdateImageParams struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Alt         string `json:"alt"`
}

func (q *Queries) UpdateImage(ctx context.Context, arg UpdateImageParams) (Image, error) {
	row := q.db.QueryRowContext(ctx, updateImage,
		arg.ID,
		arg.Name,
		arg.Description,
		arg.Alt,
	)
	var i Image
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Description,
		&i.Alt,
		&i.ImagePath,
	)
	return i, err
}
