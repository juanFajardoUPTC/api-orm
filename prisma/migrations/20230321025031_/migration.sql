/*
  Warnings:

  - A unique constraint covering the columns `[codigo_estudiante,codigo_materia]` on the table `inscripciones` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `inscripciones_codigo_estudiante_codigo_materia_key` ON `inscripciones`(`codigo_estudiante`, `codigo_materia`);
