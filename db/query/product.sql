-- name: CreateProduct :one
INSERT INTO products (
    name,
    description,
    user_id
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetProduct :one
SELECT * FROM products 
WHERE id = $1 LIMIT 1;

-- name: ListProductsByUser :many
SELECT * FROM products
WHERE user_id = $1
ORDER BY id;

-- name: ListProducts :many
SELECT * FROM products 
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: UpdateProduct :one
UPDATE  products 
SET 
    name = COALESCE($2, name),
    description = COALESCE($3, description),
    user_id = COALESCE($4, user_id)
WHERE id = $1
RETURNING *;

-- name: DeleteProduct :exec
DELETE FROM products 
WHERE id = $1;