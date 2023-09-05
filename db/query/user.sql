-- name: CreateUser :one
INSERT INTO users (
    username,
    full_name,
    email
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetUser :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: UpdateUser :one
UPDATE users 
SET 
    username = COALESCE($2, username),
    full_name = COALESCE($3, full_name),
    email = COALESCE($4, email)
WHERE id = $1
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;