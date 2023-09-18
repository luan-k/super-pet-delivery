-- name: CreateSale :one
INSERT INTO sale (
    client_id,
    product,
    price,
    observation
) VALUES (
    $1, $2, $3, $4
) RETURNING *;

-- name: GetSale :one
SELECT * FROM sale
WHERE id = $1 LIMIT 1;

-- name: ListSales :many
SELECT * FROM sale
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: UpdateSale :one
UPDATE sale 
SET 
    client_id = COALESCE($2, client_id),
    product = COALESCE($3, product),
    price = COALESCE($4, price),
    observation = COALESCE($5, observation)
WHERE id = $1
RETURNING *;

-- name: DeleteSale :exec
DELETE FROM sale
WHERE id = $1;
