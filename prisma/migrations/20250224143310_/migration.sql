/*
  Warnings:

  - You are about to drop the column `answer` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `Assignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignmentId,studentId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "answer",
DROP COLUMN "fileType";

-- CreateTable
CREATE TABLE "AssignmentAnswer" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "resultId" INTEGER NOT NULL,

    CONSTRAINT "AssignmentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentAnswer_resultId_key" ON "AssignmentAnswer"("resultId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_assignmentId_studentId_key" ON "Result"("assignmentId", "studentId");

-- AddForeignKey
ALTER TABLE "AssignmentAnswer" ADD CONSTRAINT "AssignmentAnswer_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
