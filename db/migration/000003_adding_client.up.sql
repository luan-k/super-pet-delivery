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