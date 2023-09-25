-- Drop foreign keys first
ALTER TABLE "product_images" DROP CONSTRAINT IF EXISTS "product_images_product_id_fkey";
ALTER TABLE "product_images" DROP CONSTRAINT IF EXISTS "product_images_image_id_fkey";

-- Drop the tables in reverse order
DROP TABLE IF EXISTS "product_images";
DROP TABLE IF EXISTS "images";
