// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0
// source: slider_image_widget.sql

package db

import (
	"context"
)

const createSliderImage = `-- name: CreateSliderImage :one
INSERT INTO slider_image_widget (
    image_id,
    "order"
) VALUES (
    $1, $2
) RETURNING id, image_id, "order"
`

type CreateSliderImageParams struct {
	ImageID int64 `json:"image_id"`
	Order   int32 `json:"order"`
}

func (q *Queries) CreateSliderImage(ctx context.Context, arg CreateSliderImageParams) (SliderImageWidget, error) {
	row := q.db.QueryRowContext(ctx, createSliderImage, arg.ImageID, arg.Order)
	var i SliderImageWidget
	err := row.Scan(&i.ID, &i.ImageID, &i.Order)
	return i, err
}

const deleteByImageId = `-- name: DeleteByImageId :exec
DELETE FROM slider_image_widget
WHERE image_id = $1
`

func (q *Queries) DeleteByImageId(ctx context.Context, imageID int64) error {
	_, err := q.db.ExecContext(ctx, deleteByImageId, imageID)
	return err
}

const deleteSliderImage = `-- name: DeleteSliderImage :exec
DELETE FROM slider_image_widget
WHERE id = $1
`

func (q *Queries) DeleteSliderImage(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteSliderImage, id)
	return err
}

const listSliderImages = `-- name: ListSliderImages :many
SELECT id, image_id, "order" FROM slider_image_widget
ORDER BY id DESC
LIMIT $1
OFFSET $2
`

type ListSliderImagesParams struct {
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListSliderImages(ctx context.Context, arg ListSliderImagesParams) ([]SliderImageWidget, error) {
	rows, err := q.db.QueryContext(ctx, listSliderImages, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []SliderImageWidget{}
	for rows.Next() {
		var i SliderImageWidget
		if err := rows.Scan(&i.ID, &i.ImageID, &i.Order); err != nil {
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

const updateSliderImage = `-- name: UpdateSliderImage :one
UPDATE slider_image_widget
SET "order" = COALESCE($2, "order")
WHERE id = $1
RETURNING id, image_id, "order"
`

type UpdateSliderImageParams struct {
	ID    int64 `json:"id"`
	Order int32 `json:"order"`
}

func (q *Queries) UpdateSliderImage(ctx context.Context, arg UpdateSliderImageParams) (SliderImageWidget, error) {
	row := q.db.QueryRowContext(ctx, updateSliderImage, arg.ID, arg.Order)
	var i SliderImageWidget
	err := row.Scan(&i.ID, &i.ImageID, &i.Order)
	return i, err
}

const updateSliderImageByImageId = `-- name: UpdateSliderImageByImageId :one
UPDATE slider_image_widget
SET "order" = COALESCE($2, "order")
WHERE image_id = $1
RETURNING id, image_id, "order"
`

type UpdateSliderImageByImageIdParams struct {
	ImageID int64 `json:"image_id"`
	Order   int32 `json:"order"`
}

func (q *Queries) UpdateSliderImageByImageId(ctx context.Context, arg UpdateSliderImageByImageIdParams) (SliderImageWidget, error) {
	row := q.db.QueryRowContext(ctx, updateSliderImageByImageId, arg.ImageID, arg.Order)
	var i SliderImageWidget
	err := row.Scan(&i.ID, &i.ImageID, &i.Order)
	return i, err
}
