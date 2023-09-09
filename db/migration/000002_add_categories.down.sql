-- Drop the foreign keys in "product_categories" table
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_product_id_fkey";
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_category_id_fkey";

-- Drop the "product_categories" table
DROP TABLE "product_categories";

-- Drop the "categories" table
DROP TABLE "categories";
