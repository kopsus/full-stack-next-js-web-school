/*
  Warnings:

  - Made the column `birthday` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthday` on table `Parent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthday` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthday` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "birthday" SET NOT NULL;

-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "birthday" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "birthday" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "birthday" SET NOT NULL;
