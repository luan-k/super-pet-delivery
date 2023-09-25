CREATE TABLE "images" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL,
  "alt" varchar NOT NULL,
  "path" varchar NOT NULL
);

CREATE TABLE "product_images" (
  "product_id" bigint NOT NULL,
  "image_id" bigint NOT NULL
);

ALTER TABLE "product_images" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_images" ADD FOREIGN KEY ("image_id") REFERENCES "images" ("id");
