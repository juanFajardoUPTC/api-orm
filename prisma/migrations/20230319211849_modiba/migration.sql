-- CreateTable
CREATE TABLE `estudiantes` (
    `codigo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `apellido` VARCHAR(45) NOT NULL,
    `tipo_documento` VARCHAR(45) NOT NULL,
    `numero_documento` VARCHAR(15) NOT NULL,
    `estado` VARCHAR(1) NULL,
    `genero` VARCHAR(3) NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inscripciones` (
    `id_inscripcion` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo_estudiante` INTEGER NOT NULL,
    `codigo_materia` INTEGER NOT NULL,
    `fecha_inscripcion` DATE NOT NULL,

    INDEX `codigo_estudiante`(`codigo_estudiante`),
    INDEX `codigo_materia`(`codigo_materia`),
    PRIMARY KEY (`id_inscripcion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materias` (
    `codigo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `cupos` INTEGER NULL,
    `estado` VARCHAR(1) NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inscripciones` ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`codigo_estudiante`) REFERENCES `estudiantes`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripciones` ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`codigo_materia`) REFERENCES `materias`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;
