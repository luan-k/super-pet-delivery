-- Drop the foreign key constraint in "products" table
ALTER TABLE "products" DROP CONSTRAINT "products_user_id_fkey";

-- Drop the "products" table
DROP TABLE IF EXISTS "products";

-- Drop the "users" table
DROP TABLE IF EXISTS "users";