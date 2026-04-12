CREATE DATABASE horario_genetico;
\c horario_genetico;

-- ============================
-- TABLAS BASE
-- ============================

-- Carrera / Ingeniería
CREATE TABLE carrera (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE semestre (
    id SERIAL PRIMARY KEY,
    semestre VARCHAR(50) NOT NULL
);

CREATE TABLE ciclo (
    id SERIAL PRIMARY KEY,
    ciclo VARCHAR(50) NOT NULL
);

CREATE TABLE seccion (
    id SERIAL PRIMARY KEY,
    seccion VARCHAR(10) NOT NULL
);

-- Estudiante
CREATE TABLE estudiante (
    id SERIAL PRIMARY KEY,
    carnet VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    correo VARCHAR(100),
    id_carrera INTEGER REFERENCES carrera(id)
);

-- ============================
-- PENSUM Y CURSOS
-- ============================

-- Curso
CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    -- ID del sistema externo (Proyecto 1)
    id_externo INTEGER
);

-- Relación carrera - curso (pensum)
CREATE TABLE pensum (
    id SERIAL PRIMARY KEY,
    obligatorio BOOLEAN DEFAULT TRUE,
    creditos INTEGER NOT NULL,
    id_semestre INTEGER REFERENCES semestre(id),
    id_carrera INTEGER REFERENCES carrera(id),
    id_curso INTEGER REFERENCES curso(id),
    CONSTRAINT unique_pensum UNIQUE (id_carrera, id_curso)
);

-- Prerrequisitos (relación curso -> curso)
CREATE TABLE curso_prerrequisito (
    id SERIAL PRIMARY KEY,
    id_pensum INTEGER REFERENCES pensum(id) ON DELETE CASCADE,
    id_prerrequisito INTEGER REFERENCES curso(id) ON DELETE CASCADE,
    CONSTRAINT unique_prerreq UNIQUE (id_pensum, id_prerrequisito)
);

-- ============================
-- HORARIO GENERAL (Proyecto 1)
-- ============================

CREATE TABLE horario_general (
    id SERIAL PRIMARY KEY,
    id_curso_horario INTEGER NOT NULL,
    id_seccion INTEGER,
    cupo_maximo INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    fecha_sincronizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_curso_horario UNIQUE (id_curso_horario)
);

-- ============================
-- HISTORIAL ACADÉMICO
-- ============================

CREATE TABLE historial_academico (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id),
    id_curso INTEGER REFERENCES curso(id),
    nota DECIMAL(5,2),
    aprobado BOOLEAN, -- APROBADO / REPROBADO
    anio INTEGER,
    id_ciclo INTEGER REFERENCES ciclo(id), -- Ej: 1S, 2S, VACACIONES
    intentos INTEGER DEFAULT 1
);

-- ============================
-- SELECCIÓN DE CURSOS (PRE-HORARIO)
-- ============================

CREATE TABLE seleccion_cursos (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id),
    id_curso INTEGER REFERENCES curso(id),
    seleccionado BOOLEAN DEFAULT TRUE
);

-- ============================
-- HORARIO PERSONAL DEL ESTUDIANTE
-- ============================

CREATE TABLE horario_estudiante (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id),
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_horario (
    id SERIAL PRIMARY KEY,
    id_horario INTEGER REFERENCES horario_estudiante(id) ON DELETE CASCADE,
    id_horario_general INTEGER REFERENCES horario_general(id)
);

-- ============================
-- NOTIFICACIONES
-- ============================

CREATE TABLE notificacion (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id),
    mensaje TEXT,
    leido BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- CONTROL DE REPITENCIAS
-- ============================

CREATE TABLE control_repitencias (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id),
    id_curso INTEGER REFERENCES curso(id),
    total_intentos INTEGER DEFAULT 0,
    alerta BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_estudiante_curso UNIQUE (id_estudiante, id_curso)
);

-- ============================
-- DASHBOARD (opcional - cache)
-- ============================

CREATE TABLE resumen_estudiante (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiante(id),
    cursos_aprobados INTEGER,
    cursos_reprobados INTEGER,
    porcentaje_aprobacion DECIMAL(5,2),
    creditos_acumulados INTEGER,
    promedio_general DECIMAL(5,2),
    promedio_limpio DECIMAL(5,2)
);

-- ============================
-- ÍNDICES (RENDIMIENTO)
-- ============================

CREATE INDEX idx_estudiante_carnet ON estudiante(carnet);
CREATE INDEX idx_historial_estudiante ON historial_academico(id_estudiante);
CREATE INDEX idx_horario_general ON horario_general(id_curso_horario);
CREATE INDEX idx_detalle_horario ON detalle_horario(id_horario);