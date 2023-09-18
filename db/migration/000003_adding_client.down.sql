-- Remove foreign key constraints from "sale" table
ALTER TABLE "sale" DROP CONSTRAINT IF EXISTS "sale_client_id_fkey";

-- Drop the "sale" table
DROP TABLE IF EXISTS "sale";

-- Drop the "client" table
DROP TABLE IF EXISTS "client";
