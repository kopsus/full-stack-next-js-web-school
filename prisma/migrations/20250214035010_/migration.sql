/*
  Warnings:

  - The `birthday` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `birthday` column on the `Parent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `birthday` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `birthday` column on the `Teacher` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3);
