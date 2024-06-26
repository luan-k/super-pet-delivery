package main

import (
	"database/sql"
	"log"
	"super-pet-delivery/api"
	db "super-pet-delivery/db/sqlc"
	"super-pet-delivery/util"

	_ "github.com/lib/pq"
)

func main() {
	//loading enviroment variables
	config, err := util.LoadConfig(".")
	if err != nil {
		log.Fatal("cannot load config:", err)
	}

	conn, err := sql.Open(config.DBDriver, config.DBSource)
	if err != nil {
		log.Fatal("cannot connect to db:", err)
	}

	store := db.NewSortableStore(conn)
	server, err := api.NewServer(config, store)
	if err != nil {
		log.Fatal("cannot create server:", err)
	}

	// Logging out the server address
	log.Printf("Starting server on addresss: %s", config.ServerAddress)

	err = server.Start(config.ServerAddress)
	if err != nil {
		log.Fatal("cannot start server:", err)
	}
}
