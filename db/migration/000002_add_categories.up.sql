CREATE TABLE "categories" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" varchar NOT NULL
);

CREATE TABLE "product_categories" (
  "product_id" bigint NOT NULL,
  "category_id" bigint NOT NULL,
  CONSTRAINT unique_product_category UNIQUE (product_id, category_id)
);

ALTER TABLE "product_categories" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "product_categories" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");