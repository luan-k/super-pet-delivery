DB_URL=postgresql://root:secret@localhost:5432/product-db?sslmode=disable

postgres:
	docker run --name postgres-product-db -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:12-alpine

createdb:
	winpty docker exec -it postgres-product-db createdb --username=root --owner=root product-db

dropdb:
	winpty docker exec -it postgres-product-db dropdb product-db

new_migrate:
	migrate create -ext sql -dir db/migration -seq migration_name

migrateup:
	migrate -path db/migration -database "$(DB_URL)" -verbose up

migrateup1:
	migrate -path db/migration -database "$(DB_URL)" -verbose up 1

migratedown:
	migrate -path db/migration -database "$(DB_URL)" -verbose down

migratedown1:
	migrate -path db/migration -database "$(DB_URL)" -verbose down 1


sqlc_win:
	docker run --rm -v "D:\Work\WK\super-pet-delivery:/src" -w /src kjconroy/sqlc generate

test:
	go test -v -cover -short ./...

server:
	go run main.go

mock:
	mockgen --package mockdb --destination db/mock/store.go super-pet-delivery/db/sqlc Store

.PHONY: postgres createdb dropdb migrateup migratedown sqlc test server mock migrateup1 migratedown1