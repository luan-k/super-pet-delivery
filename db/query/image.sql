-- name: CreateImage :one
INSERT INTO images (
    name,
    description,
    alt,
    image_path
) VALUES (
    $1, $2, $3, $4
) RETURNING *;

-- name: GetImage :one
SELECT * FROM images 
WHERE id = $1 LIMIT 1;

-- name: ListImages :many
SELECT * FROM images 
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: AssociateProductWithImage :one
INSERT INTO product_images (product_id, image_id)
VALUES ($1, $2)
RETURNING *;

-- name: DisassociateProductFromImage :one
DELETE FROM product_images
WHERE product_id = $1 AND image_id = $2
RETURNING *;

-- name: ListImagesByProduct :many
SELECT c.*
FROM images c
JOIN product_images pc ON c.id = pc.image_id
WHERE pc.product_id = $1
ORDER BY c.id;


-- name: UpdateImage :one
UPDATE images 
SET 
    name = COALESCE($2, name),
    description = COALESCE($3, description),
    alt = COALESCE($4, alt)
WHERE id = $1
RETURNING *;

-- name: DeleteImage :exec
DELETE FROM images 
WHERE id = $1;

