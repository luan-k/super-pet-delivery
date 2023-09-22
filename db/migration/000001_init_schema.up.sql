CREATE TABLE "users" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "full_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "hashed_password" varchar NOT NULL,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01 00:00:00Z',
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "products" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL,
  "user_id" bigint NOT NULL
);

ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
