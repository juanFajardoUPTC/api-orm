-- CreateTable
CREATE TABLE `estudiantes` (
    `codigo` INTEGER NOT NULL,
    `nombre` VARCHAR(45) NULL,
    `apellido` VARCHAR(45) NULL,
    `tipo_documento` VARCHAR(45) NULL,
    `numero_documento` INTEGER NULL,
    `estado` TINYINT NULL,
    `genero` VARCHAR(45) NULL,

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
    `codigo` INTEGER NOT NULL,
    `nombre` VARCHAR(45) NULL,
    `cupos` INTEGER NULL,
    `estado` TINYINT NULL,

    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inscripciones` ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`codigo_estudiante`) REFERENCES `estudiantes`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripciones` ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`codigo_materia`) REFERENCES `materias`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;
