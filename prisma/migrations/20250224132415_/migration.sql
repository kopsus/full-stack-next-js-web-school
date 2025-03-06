/*
  Warnings:

  - You are about to drop the column `answer` on the `Exam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "answer" TEXT;

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "answer";
