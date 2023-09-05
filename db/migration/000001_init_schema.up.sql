CREATE TABLE "users" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar NOT NULL,
  "full_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL
);

CREATE TABLE "products" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL,
  "user_id" bigint NOT NULL
);

ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
