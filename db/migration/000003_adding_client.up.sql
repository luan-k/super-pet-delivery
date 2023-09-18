CREATE TABLE "client" (
  "id" BIGSERIAL PRIMARY KEY,
  "full_name" varchar NOT NULL,
  "phone_whatsapp" varchar NOT NULL,
  "phone_line" varchar NOT NULL,
  "pet_name" varchar NOT NULL,
  "pet_breed" varchar NOT NULL,
  "address_street" varchar NOT NULL,
  "address_number" varchar NOT NULL,
  "address_neighborhood" varchar NOT NULL,
  "address_reference" varchar NOT NULL
);

CREATE TABLE "sale" (
  "id" BIGSERIAL PRIMARY KEY,
  "client_id" BIGSERIAL NOT NULL,
  "product" varchar NOT NULL,
  "price" bigint NOT NULL,
  "observation" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "changed_at" timestamptz NOT NULL DEFAULT '0001-01-01 00:00:00Z',
  "pdf_generated_at" timestamptz NOT NULL DEFAULT '0001-01-01 00:00:00Z'
);

ALTER TABLE "sale" ADD FOREIGN KEY ("client_id") REFERENCES "client" ("id");
