package api

import (
	"context"
	"database/sql"
	"fmt"
	db "super-pet-delivery/db/sqlc"
	"super-pet-delivery/util"
)

func (server *Server) createInitialUser(store db.Store) error {
	fmt.Println("Checking if there is an Initial user")
	user, err := store.GetUser(context.Background(), 1)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if user.ID != 0 {
		fmt.Println("Initial user already exists, jumping to next task...")
		return nil
	}

	hashedPassword, err := util.HashPassword("123456")
	if err != nil {
		return err
	}
	initialUser := db.CreateUserParams{
		Username:       "luan",
		FullName:       "luankds",
		Email:          "luankds@gmail.com",
		HashedPassword: hashedPassword,
		Role:           "Administrator",
	}

	_, err = store.CreateUser(context.Background(), initialUser)
	if err != nil {
		fmt.Println("There wan an error in creating the initial user")
		return err
	}
	fmt.Println("initial user created successfully")
	return nil
}
