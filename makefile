DB_URL=postgresql://root:secret@localhost:5432/product-db?sslmode=disable

postgres:
	docker run --name postgres-product-db -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:12-alpine

createdb:
	winpty docker exec -it postgres-product-db createdb --username=root --owner=root product-db

dropdb:
	winpty docker exec -it postgres-product-db dropdb product-db

migrateup:
	migrate -path db/migration -database "$(DB_URL)" -verbose up

migratedown:
	migrate -path db/migration -database "$(DB_URL)" -verbose down

sqlc_win:
	docker run --rm -v "D:\Work\WK\super-pet-delivery:/src" -w /src kjconroy/sqlc generate

test:
	go test -v -cover -short ./...

server:
	go run main.go

.PHONY: postgres createdb dropdb migrateup migratedown sqlc test server