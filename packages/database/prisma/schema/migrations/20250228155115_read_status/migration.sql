-- CreateEnum
CREATE TYPE "ReadStatus" AS ENUM ('UNREAD', 'READ', 'READING');

-- AlterTable
ALTER TABLE "book" ADD COLUMN     "readStatus" "ReadStatus" NOT NULL DEFAULT 'UNREAD';
