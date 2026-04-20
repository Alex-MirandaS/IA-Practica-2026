"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportCsvService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const import_target_dto_1 = require("./dto/import-target.dto");
const curso_entity_1 = require("../curso/entities/curso.entity");
const carrera_entity_1 = require("../carrera/entities/carrera.entity");
const pensum_entity_1 = require("../pensum/entities/pensum.entity");
const curso_prerrequisito_entity_1 = require("../curso-prerrequisito/entities/curso-prerrequisito.entity");
const historial_academico_entity_1 = require("../historial-academico/entities/historial-academico.entity");
const estudiante_entity_1 = require("../estudiante/entities/estudiante.entity");
const semestre_entity_1 = require("../semestre/entities/semestre.entity");
const ciclo_entity_1 = require("../ciclo/entities/ciclo.entity");
let ImportCsvService = class ImportCsvService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async importByTarget(targetInput, fileBuffer) {
        const target = (0, import_target_dto_1.normalizeImportTarget)(targetInput);
        if (!target) {
            throw new common_1.BadRequestException(`Tabla no soportada: ${targetInput}`);
        }
        const rows = this.parseCsv(fileBuffer);
        if (rows.length === 0) {
            throw new common_1.BadRequestException('El CSV no contiene filas de datos');
        }
        const result = {
            target,
            processed: rows.length,
            inserted: 0,
            updated: 0,
            warnings: [],
        };
        await this.dataSource.transaction(async (manager) => {
            switch (target) {
                case import_target_dto_1.ImportTarget.CURSO:
                    await this.importCursos(rows, manager, result);
                    break;
                case import_target_dto_1.ImportTarget.CARRERA:
                    await this.importCarreras(rows, manager, result);
                    break;
                case import_target_dto_1.ImportTarget.PENSUM:
                    await this.importPensum(rows, manager, result);
                    break;
                case import_target_dto_1.ImportTarget.CURSO_PRERREQUISITO:
                    await this.importCursoPrerrequisito(rows, manager, result);
                    break;
                case import_target_dto_1.ImportTarget.HISTORIAL_ACADEMICO:
                    await this.importHistorialAcademico(rows, manager, result);
                    break;
                case import_target_dto_1.ImportTarget.ESTUDIANTE:
                    await this.importEstudiantes(rows, manager, result);
                    break;
                default:
                    throw new common_1.BadRequestException(`Tabla no soportada: ${targetInput}`);
            }
        });
        return result;
    }
    async importCursos(rows, manager, result) {
        const repository = manager.getRepository(curso_entity_1.Curso);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const codigoRaw = this.requiredValueFromAliases(row, ['codigo', 'cod', 'codigo_curso'], i);
            const codigo = this.normalizeCursoCodigo(codigoRaw);
            const nombre = this.requiredValueFromAliases(row, ['nombre', 'curso', 'nombre_curso'], i);
            const idExterno = this.optionalIntByAliases(row, ['id_externo', 'idexterno', 'externo'], 'id_externo', i);
            const idDirecto = this.optionalIntByAliases(row, ['id'], 'id', i);
            const currentByCodigo = await repository.findOne({ where: { codigo } });
            const currentById = idDirecto != null ? await repository.findOne({ where: { id: idDirecto } }) : null;
            const current = currentByCodigo ?? currentById;
            const payload = {
                codigo,
                nombre,
                id_externo: idExterno,
            };
            if (current) {
                Object.assign(current, payload);
                await repository.save(current);
                result.updated += 1;
            }
            else {
                await repository.save(repository.create(idDirecto ? { ...payload, id: idDirecto } : payload));
                result.inserted += 1;
            }
        }
    }
    async importCarreras(rows, manager, result) {
        const repository = manager.getRepository(carrera_entity_1.Carrera);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const nombre = this.requiredValueFromAliases(row, ['nombre_carrera', 'nombre', 'carrera'], i);
            const idDirecto = this.optionalIntByAliases(row, ['id'], 'id', i);
            const current = idDirecto != null ? await repository.findOne({ where: { id: idDirecto } }) : await repository.findOne({ where: { nombre } });
            if (current) {
                current.nombre = nombre;
                await repository.save(current);
                result.updated += 1;
            }
            else {
                await repository.save(repository.create(idDirecto ? { id: idDirecto, nombre } : { nombre }));
                result.inserted += 1;
            }
        }
    }
    async importPensum(rows, manager, result) {
        const repository = manager.getRepository(pensum_entity_1.Pensum);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const idDirecto = this.optionalIntByAliases(row, ['id'], 'id', i);
            const obligatorio = this.optionalBooleanByAliases(row, ['obligatorio', 'es_obligatorio', 'tipo'], true, i);
            const creditos = this.requiredIntFromAliases(row, ['creditos', 'credito'], 'creditos', i);
            const idSemestre = await this.resolveSemestre(row, i, manager);
            const idCarrera = await this.resolveCarrera(row, i, manager);
            const idCurso = await this.resolveCurso(row, i, manager);
            const current = idDirecto != null
                ? await repository.findOne({ where: { id: idDirecto } })
                : await this.findPensumByRelations(repository, idSemestre, idCarrera, idCurso);
            const payload = {
                obligatorio,
                creditos,
                semestre: idSemestre != null ? { id: idSemestre } : undefined,
                carrera: idCarrera != null ? { id: idCarrera } : undefined,
                curso: idCurso != null ? { id: idCurso } : undefined,
            };
            if (current) {
                Object.assign(current, payload);
                await repository.save(current);
                result.updated += 1;
            }
            else {
                await repository.save(repository.create(idDirecto ? { id: idDirecto, ...payload } : payload));
                result.inserted += 1;
            }
        }
    }
    async importCursoPrerrequisito(rows, manager, result) {
        const repository = manager.getRepository(curso_prerrequisito_entity_1.CursoPrerrequisito);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const idPensum = await this.resolvePensumReference(row, i, manager);
            const idPrerrequisito = await this.resolveCurso(row, i, manager, {
                required: true,
                idAliases: ['id_prerrequisito'],
                lookupAliases: ['codigo_prerrequisito', 'prerrequisito', 'prerrequisito_id', 'nombre_prerrequisito'],
            });
            const current = await repository
                .createQueryBuilder('cp')
                .where('cp.id_pensum = :idPensum', { idPensum })
                .andWhere('cp.id_prerrequisito = :idPrerrequisito', { idPrerrequisito })
                .getOne();
            if (current) {
                result.warnings.push(`Fila ${i + 2}: curso_prerrequisito ya existe`);
                continue;
            }
            await repository.save(repository.create({
                pensum: { id: idPensum },
                prerrequisito: { id: idPrerrequisito },
            }));
            result.inserted += 1;
        }
    }
    async importHistorialAcademico(rows, manager, result) {
        const repository = manager.getRepository(historial_academico_entity_1.HistorialAcademico);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const idEstudiante = await this.resolveEstudiante(row, i, manager);
            const idCursoResolved = await this.resolveCurso(row, i, manager, { required: true });
            if (idCursoResolved == null) {
                throw new common_1.BadRequestException(`Fila ${i + 2}: debe enviar un curso valido`);
            }
            const idCurso = idCursoResolved;
            const idCiclo = await this.resolveCiclo(row, i, manager);
            const nota = this.optionalDecimalByAliases(row, ['nota', 'calificacion'], 'nota', i);
            const aprobado = this.optionalBooleanMaybeByAliases(row, ['aprobado', 'aprobada'], i);
            const anio = this.optionalIntByAliases(row, ['anio', 'año'], 'anio', i);
            const intentos = this.optionalIntByAliases(row, ['intentos', 'intento'], 'intentos', i) ?? 1;
            const current = await this.findHistorialAcademico(repository, idEstudiante, idCurso, idCiclo, anio);
            const payload = {
                estudiante: { id: idEstudiante },
                curso: { id: idCurso },
                ciclo: idCiclo != null ? { id: idCiclo } : undefined,
                nota,
                aprobado,
                anio,
                intentos,
            };
            if (current) {
                Object.assign(current, payload);
                await repository.save(current);
                result.updated += 1;
            }
            else {
                await repository.save(repository.create(payload));
                result.inserted += 1;
            }
        }
    }
    async importEstudiantes(rows, manager, result) {
        const repository = manager.getRepository(estudiante_entity_1.Estudiante);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const carnet = this.requiredValueFromAliases(row, ['carnet'], i);
            const nombre = this.optionalValueFromAliases(row, ['nombre', 'nombres'], i);
            const apellido = this.optionalValueFromAliases(row, ['apellido', 'apellidos'], i);
            const correo = this.optionalValueFromAliases(row, ['correo', 'email', 'mail'], i);
            const idCarrera = await this.resolveCarrera(row, i, manager);
            const idDirecto = this.optionalIntByAliases(row, ['id'], 'id', i);
            const current = idDirecto != null ? await repository.findOne({ where: { id: idDirecto } }) : await repository.findOne({ where: { carnet } });
            const payload = {
                carnet,
                nombre,
                apellido,
                correo,
                carrera: idCarrera != null ? { id: idCarrera } : undefined,
            };
            if (current) {
                Object.assign(current, payload);
                await repository.save(current);
                result.updated += 1;
            }
            else {
                await repository.save(repository.create(idDirecto ? { id: idDirecto, ...payload } : payload));
                result.inserted += 1;
            }
        }
    }
    parseCsv(buffer) {
        const text = buffer.toString('utf-8').replace(/^\uFEFF/, '').trim();
        if (!text) {
            return [];
        }
        const lines = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        if (lines.length < 2) {
            return [];
        }
        const delimiter = this.detectDelimiter(lines[0]);
        const headers = this.splitCsvLine(lines[0], delimiter).map((header) => header.trim());
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.splitCsvLine(lines[i], delimiter);
            if (values.every((value) => value.trim().length === 0)) {
                continue;
            }
            if (values.length !== headers.length) {
                throw new common_1.BadRequestException(`Fila ${i + 1}: cantidad de columnas invalida (esperadas ${headers.length}, recibidas ${values.length})`);
            }
            const row = {};
            headers.forEach((header, index) => {
                row[header] = (values[index] ?? '').trim();
            });
            rows.push(row);
        }
        return rows;
    }
    detectDelimiter(headerLine) {
        const commaCount = (headerLine.match(/,/g) ?? []).length;
        const semicolonCount = (headerLine.match(/;/g) ?? []).length;
        return semicolonCount > commaCount ? ';' : ',';
    }
    splitCsvLine(line, delimiter) {
        const values = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                const isEscaped = inQuotes && line[i + 1] === '"';
                if (isEscaped) {
                    current += '"';
                    i += 1;
                    continue;
                }
                inQuotes = !inQuotes;
                continue;
            }
            if (char === delimiter && !inQuotes) {
                values.push(current);
                current = '';
                continue;
            }
            current += char;
        }
        values.push(current);
        return values;
    }
    normalizedKey(value) {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
    }
    findValueByAliases(row, aliases) {
        const normalizedAliases = aliases.map((alias) => this.normalizedKey(alias));
        for (const key of Object.keys(row)) {
            if (normalizedAliases.includes(this.normalizedKey(key))) {
                return row[key];
            }
        }
        return undefined;
    }
    requiredValueFromAliases(row, aliases, index) {
        const displayName = aliases[0];
        const value = this.findValueByAliases(row, aliases);
        if (!value || value.trim().length === 0) {
            throw new common_1.BadRequestException(`Fila ${index + 2}: ${displayName} es requerido`);
        }
        return value.trim();
    }
    optionalValueFromAliases(row, aliases, index) {
        const value = this.findValueByAliases(row, aliases);
        if (!value || value.trim().length === 0) {
            return undefined;
        }
        return value.trim();
    }
    requiredIntFromAliases(row, aliases, field, index) {
        const value = this.requiredValueFromAliases(row, aliases, index);
        return this.parseIntegerValue(value, field, index);
    }
    optionalIntByAliases(row, aliases, field, index) {
        const value = this.findValueByAliases(row, aliases);
        if (!value || value.trim().length === 0) {
            return undefined;
        }
        return this.parseIntegerValue(value, field, index);
    }
    optionalDecimalByAliases(row, aliases, field, index) {
        const value = this.findValueByAliases(row, aliases);
        if (!value || value.trim().length === 0) {
            return undefined;
        }
        const normalized = value.trim().replace(',', '.');
        const parsed = Number.parseFloat(normalized);
        if (Number.isNaN(parsed)) {
            throw new common_1.BadRequestException(`Fila ${index + 2}: ${field} debe ser numerico`);
        }
        return parsed;
    }
    optionalBooleanByAliases(row, aliases, defaultValue, index) {
        const value = this.findValueByAliases(row, aliases);
        if (!value || value.trim().length === 0) {
            return defaultValue;
        }
        const normalized = value.trim().toLowerCase();
        if (['1', 'true', 't', 'si', 'yes', 'y'].includes(normalized)) {
            return true;
        }
        if (['0', 'false', 'f', 'no', 'n'].includes(normalized)) {
            return false;
        }
        if (['obligatorio', 'troncal', 'mandatory'].includes(normalized)) {
            return true;
        }
        if (['optativo', 'electivo', 'optional'].includes(normalized)) {
            return false;
        }
        throw new common_1.BadRequestException(`Fila ${index + 2}: valor booleano invalido (${value})`);
    }
    optionalBooleanMaybeByAliases(row, aliases, index) {
        const value = this.findValueByAliases(row, aliases);
        if (!value || value.trim().length === 0) {
            return undefined;
        }
        const normalized = value.trim().toLowerCase();
        if (['1', 'true', 't', 'si', 'yes', 'y'].includes(normalized)) {
            return true;
        }
        if (['0', 'false', 'f', 'no', 'n'].includes(normalized)) {
            return false;
        }
        throw new common_1.BadRequestException(`Fila ${index + 2}: valor booleano invalido (${value})`);
    }
    async resolveCarrera(row, index, manager) {
        const idCarrera = this.optionalIntByAliases(row, ['id_carrera'], 'id_carrera', index);
        if (idCarrera != null) {
            await this.assertForeignKey(index, idCarrera, 'id_carrera', carrera_entity_1.Carrera, manager);
            return idCarrera;
        }
        const nombreCarrera = this.findValueByAliases(row, ['carrera', 'nombre_carrera'])?.trim();
        if (!nombreCarrera) {
            return undefined;
        }
        const repository = manager.getRepository(carrera_entity_1.Carrera);
        const current = await repository.findOne({ where: { nombre: nombreCarrera } });
        if (current) {
            return current.id;
        }
        const created = await repository.save(repository.create({ nombre: nombreCarrera }));
        return created.id;
    }
    async resolveSemestre(row, index, manager) {
        const idSemestre = this.optionalIntByAliases(row, ['id_semestre'], 'id_semestre', index);
        if (idSemestre != null) {
            await this.assertForeignKey(index, idSemestre, 'id_semestre', semestre_entity_1.Semestre, manager);
            return idSemestre;
        }
        const semestreRaw = this.findValueByAliases(row, ['semestre'])?.trim();
        if (!semestreRaw) {
            return undefined;
        }
        const semestreValue = this.normalizeIntegerLikeValue(semestreRaw);
        const repository = manager.getRepository(semestre_entity_1.Semestre);
        const current = await repository.findOne({ where: { semestre: semestreValue } });
        if (current) {
            return current.id;
        }
        const created = await repository.save(repository.create({ semestre: semestreValue }));
        return created.id;
    }
    async resolveCurso(row, index, manager, options = {}) {
        const idAliases = options.idAliases ?? ['id_curso'];
        const lookupAliases = options.lookupAliases ?? ['codigo', 'codigo_curso', 'cod', 'curso', 'nombre_curso', 'nombre'];
        const idCurso = this.optionalIntByAliases(row, idAliases, idAliases[0], index);
        if (idCurso != null) {
            await this.assertForeignKey(index, idCurso, idAliases[0], curso_entity_1.Curso, manager);
            return idCurso;
        }
        const codigoRaw = this.findValueByAliases(row, lookupAliases.filter((alias) => ['codigo', 'codigo_curso', 'cod'].includes(alias)))?.trim();
        const codigo = codigoRaw ? this.normalizeCursoCodigo(codigoRaw) : undefined;
        const nombre = this.findValueByAliases(row, lookupAliases.filter((alias) => ['curso', 'nombre_curso', 'nombre'].includes(alias)))?.trim();
        if (!codigo && !nombre) {
            if (options.required) {
                throw new common_1.BadRequestException(`Fila ${index + 2}: debe enviar ${idAliases[0]}, codigo o nombre del curso`);
            }
            return undefined;
        }
        const repository = manager.getRepository(curso_entity_1.Curso);
        const byCodigo = codigo ? await repository.findOne({ where: { codigo } }) : undefined;
        if (byCodigo) {
            return byCodigo.id;
        }
        const byNombre = nombre ? await repository.findOne({ where: { nombre } }) : undefined;
        if (byNombre) {
            return byNombre.id;
        }
        const codigoFinal = codigo ?? `${idAliases[0].toUpperCase()}-${Date.now()}-${index}`;
        const nombreFinal = nombre ?? codigoFinal;
        const created = await repository.save(repository.create({ codigo: codigoFinal, nombre: nombreFinal }));
        return created.id;
    }
    normalizeCursoCodigo(codigo) {
        const normalized = codigo.trim();
        if (/^-?\d+\.0+$/.test(normalized)) {
            return normalized.replace(/\.0+$/, '');
        }
        return normalized;
    }
    normalizeIntegerLikeValue(value) {
        const normalized = value.trim().replace(',', '.');
        if (/^-?\d+\.0+$/.test(normalized)) {
            return normalized.replace(/\.0+$/, '');
        }
        return normalized;
    }
    parseIntegerValue(value, field, index) {
        const normalized = this.normalizeIntegerLikeValue(value);
        if (!/^-?\d+$/.test(normalized)) {
            throw new common_1.BadRequestException(`Fila ${index + 2}: ${field} debe ser un numero entero`);
        }
        const parsed = Number.parseInt(normalized, 10);
        if (Number.isNaN(parsed)) {
            throw new common_1.BadRequestException(`Fila ${index + 2}: ${field} debe ser un numero entero`);
        }
        return parsed;
    }
    async resolveEstudiante(row, index, manager) {
        const idEstudiante = this.optionalIntByAliases(row, ['id_estudiante'], 'id_estudiante', index);
        if (idEstudiante != null) {
            await this.assertForeignKey(index, idEstudiante, 'id_estudiante', estudiante_entity_1.Estudiante, manager);
            return idEstudiante;
        }
        const carnet = this.findValueByAliases(row, ['carnet'])?.trim();
        if (!carnet) {
            throw new common_1.BadRequestException(`Fila ${index + 2}: debe enviar id_estudiante o carnet`);
        }
        const repository = manager.getRepository(estudiante_entity_1.Estudiante);
        const current = await repository.findOne({ where: { carnet } });
        if (current) {
            return current.id;
        }
        const created = await repository.save(repository.create({ carnet }));
        return created.id;
    }
    async resolveCiclo(row, index, manager) {
        const idCiclo = this.optionalIntByAliases(row, ['id_ciclo'], 'id_ciclo', index);
        if (idCiclo != null) {
            await this.assertForeignKey(index, idCiclo, 'id_ciclo', ciclo_entity_1.Ciclo, manager);
            return idCiclo;
        }
        const cicloValue = this.findValueByAliases(row, ['ciclo'])?.trim();
        if (!cicloValue) {
            return undefined;
        }
        const repository = manager.getRepository(ciclo_entity_1.Ciclo);
        const current = await repository.findOne({ where: { ciclo: cicloValue } });
        if (current) {
            return current.id;
        }
        const created = await repository.save(repository.create({ ciclo: cicloValue }));
        return created.id;
    }
    async resolvePensumReference(row, index, manager) {
        const idPensum = this.optionalIntByAliases(row, ['id_pensum'], 'id_pensum', index);
        if (idPensum != null) {
            await this.assertForeignKey(index, idPensum, 'id_pensum', pensum_entity_1.Pensum, manager);
            return idPensum;
        }
        const idSemestre = await this.resolveSemestre(row, index, manager);
        const idCarrera = await this.resolveCarrera(row, index, manager);
        const idCurso = await this.resolveCurso(row, index, manager, { required: true });
        if (idSemestre == null && idCarrera == null && idCurso == null) {
            throw new common_1.BadRequestException(`Fila ${index + 2}: debe enviar id_pensum o suficientes datos para identificar el pensum`);
        }
        const repository = manager.getRepository(pensum_entity_1.Pensum);
        const qb = repository.createQueryBuilder('pensum');
        if (idSemestre != null) {
            qb.andWhere('pensum.id_semestre = :idSemestre', { idSemestre });
        }
        if (idCarrera != null) {
            qb.andWhere('pensum.id_carrera = :idCarrera', { idCarrera });
        }
        if (idCurso != null) {
            qb.andWhere('pensum.id_curso = :idCurso', { idCurso });
        }
        const current = await qb.getOne();
        if (!current) {
            throw new common_1.BadRequestException(`Fila ${index + 2}: pensum no encontrado`);
        }
        return current.id;
    }
    async findPensumByRelations(repository, idSemestre, idCarrera, idCurso) {
        if (idSemestre == null && idCarrera == null && idCurso == null) {
            return null;
        }
        const qb = repository.createQueryBuilder('pensum');
        if (idSemestre != null) {
            qb.andWhere('pensum.id_semestre = :idSemestre', { idSemestre });
        }
        if (idCarrera != null) {
            qb.andWhere('pensum.id_carrera = :idCarrera', { idCarrera });
        }
        if (idCurso != null) {
            qb.andWhere('pensum.id_curso = :idCurso', { idCurso });
        }
        return (await qb.getOne());
    }
    async findHistorialAcademico(repository, idEstudiante, idCurso, idCiclo, anio) {
        const qb = repository.createQueryBuilder('ha');
        qb.where('ha.id_estudiante = :idEstudiante', { idEstudiante }).andWhere('ha.id_curso = :idCurso', { idCurso });
        if (idCiclo != null) {
            qb.andWhere('ha.id_ciclo = :idCiclo', { idCiclo });
        }
        if (anio != null) {
            qb.andWhere('ha.anio = :anio', { anio });
        }
        return (await qb.getOne());
    }
    async assertForeignKey(rowIndex, value, fieldName, entity, manager) {
        if (value == null) {
            return;
        }
        const exists = await manager.getRepository(entity).exist({ where: { id: value } });
        if (!exists) {
            throw new common_1.BadRequestException(`Fila ${rowIndex + 2}: ${fieldName} no existe (${value})`);
        }
    }
};
exports.ImportCsvService = ImportCsvService;
exports.ImportCsvService = ImportCsvService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ImportCsvService);
//# sourceMappingURL=import-csv.service.js.map