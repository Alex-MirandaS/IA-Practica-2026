import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ImportResultDto } from './dto/import-result.dto';
import { ImportTarget, normalizeImportTarget } from './dto/import-target.dto';
import { Curso } from '../curso/entities/curso.entity';
import { Carrera } from '../carrera/entities/carrera.entity';
import { Pensum } from '../pensum/entities/pensum.entity';
import { CursoPrerrequisito } from '../curso-prerrequisito/entities/curso-prerrequisito.entity';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Semestre } from '../semestre/entities/semestre.entity';
import { Ciclo } from '../ciclo/entities/ciclo.entity';

type CsvRow = Record<string, string>;

@Injectable()
export class ImportCsvService {
  constructor(private readonly dataSource: DataSource) {}

  async importByTarget(targetInput: ImportTarget | string, fileBuffer: Buffer): Promise<ImportResultDto> {
    const target = normalizeImportTarget(targetInput);
    if (!target) {
      throw new BadRequestException(`Tabla no soportada: ${targetInput}`);
    }

    const rows = this.parseCsv(fileBuffer);
    if (rows.length === 0) {
      throw new BadRequestException('El CSV no contiene filas de datos');
    }

    const result: ImportResultDto = {
      target,
      processed: rows.length,
      inserted: 0,
      updated: 0,
      warnings: [],
    };

    await this.dataSource.transaction(async (manager) => {
      switch (target) {
        case ImportTarget.CURSO:
          await this.importCursos(rows, manager, result);
          break;
        case ImportTarget.CARRERA:
          await this.importCarreras(rows, manager, result);
          break;
        case ImportTarget.PENSUM:
          await this.importPensum(rows, manager, result);
          break;
        case ImportTarget.CURSO_PRERREQUISITO:
          await this.importCursoPrerrequisito(rows, manager, result);
          break;
        case ImportTarget.HISTORIAL_ACADEMICO:
          await this.importHistorialAcademico(rows, manager, result);
          break;
        case ImportTarget.ESTUDIANTE:
          await this.importEstudiantes(rows, manager, result);
          break;
        default:
          throw new BadRequestException(`Tabla no soportada: ${targetInput}`);
      }
    });

    return result;
  }

  private async importCursos(rows: CsvRow[], manager: EntityManager, result: ImportResultDto) {
    const repository = manager.getRepository(Curso);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const codigo = this.requiredValueFromAliases(row, ['codigo', 'cod', 'codigo_curso'], i);
      const nombre = this.requiredValueFromAliases(row, ['nombre', 'curso', 'nombre_curso'], i);
      const idExterno = this.optionalIntByAliases(row, ['id_externo', 'idexterno', 'externo'], 'id_externo', i);

      const idDirecto = this.optionalIntByAliases(row, ['id'], 'id', i);
      const current = idDirecto != null ? await repository.findOne({ where: { id: idDirecto } }) : await repository.findOne({ where: { codigo } });

      const payload: Partial<Curso> = {
        codigo,
        nombre,
        id_externo: idExterno,
      };

      if (current) {
        Object.assign(current, payload);
        await repository.save(current);
        result.updated += 1;
      } else {
        await repository.save(repository.create(idDirecto ? ({ ...payload, id: idDirecto } as Curso) : payload));
        result.inserted += 1;
      }
    }
  }

  private async importCarreras(rows: CsvRow[], manager: EntityManager, result: ImportResultDto) {
    const repository = manager.getRepository(Carrera);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const nombre = this.requiredValueFromAliases(row, ['nombre_carrera', 'nombre', 'carrera'], i);
      const idDirecto = this.optionalIntByAliases(row, ['id'], 'id', i);
      const current = idDirecto != null ? await repository.findOne({ where: { id: idDirecto } }) : await repository.findOne({ where: { nombre } });

      if (current) {
        current.nombre = nombre;
        await repository.save(current);
        result.updated += 1;
      } else {
        await repository.save(repository.create(idDirecto ? ({ id: idDirecto, nombre } as Carrera) : { nombre }));
        result.inserted += 1;
      }
    }
  }

  private async importPensum(rows: CsvRow[], manager: EntityManager, result: ImportResultDto) {
    const repository = manager.getRepository(Pensum);

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

      const payload: Partial<Pensum> = {
        obligatorio,
        creditos,
        semestre: idSemestre != null ? ({ id: idSemestre } as Semestre) : undefined,
        carrera: idCarrera != null ? ({ id: idCarrera } as Carrera) : undefined,
        curso: idCurso != null ? ({ id: idCurso } as Curso) : undefined,
      };

      if (current) {
        Object.assign(current, payload);
        await repository.save(current);
        result.updated += 1;
      } else {
        await repository.save(repository.create(idDirecto ? ({ id: idDirecto, ...payload } as Pensum) : payload));
        result.inserted += 1;
      }
    }
  }

  private async importCursoPrerrequisito(rows: CsvRow[], manager: EntityManager, result: ImportResultDto) {
    const repository = manager.getRepository(CursoPrerrequisito);

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

      await repository.save(
        repository.create({
          pensum: { id: idPensum } as Pensum,
          prerrequisito: { id: idPrerrequisito } as Curso,
        }),
      );
      result.inserted += 1;
    }
  }

  private async importHistorialAcademico(rows: CsvRow[], manager: EntityManager, result: ImportResultDto) {
    const repository = manager.getRepository(HistorialAcademico);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const idEstudiante = await this.resolveEstudiante(row, i, manager);
      const idCursoResolved = await this.resolveCurso(row, i, manager, { required: true });
      if (idCursoResolved == null) {
        throw new BadRequestException(`Fila ${i + 2}: debe enviar un curso valido`);
      }

      const idCurso = idCursoResolved;
      const idCiclo = await this.resolveCiclo(row, i, manager);
      const nota = this.optionalDecimalByAliases(row, ['nota', 'calificacion'], 'nota', i);
      const aprobado = this.optionalBooleanMaybeByAliases(row, ['aprobado', 'aprobada'], i);
      const anio = this.optionalIntByAliases(row, ['anio', 'año'], 'anio', i);
      const intentos = this.optionalIntByAliases(row, ['intentos', 'intento'], 'intentos', i) ?? 1;

      const current = await this.findHistorialAcademico(
        repository,
        idEstudiante,
        idCurso,
        idCiclo,
        anio,
      );

      const payload: Partial<HistorialAcademico> = {
        estudiante: { id: idEstudiante } as Estudiante,
        curso: { id: idCurso } as Curso,
        ciclo: idCiclo != null ? ({ id: idCiclo } as Ciclo) : undefined,
        nota,
        aprobado,
        anio,
        intentos,
      };

      if (current) {
        Object.assign(current, payload);
        await repository.save(current);
        result.updated += 1;
      } else {
        await repository.save(repository.create(payload));
        result.inserted += 1;
      }
    }
  }

  private async importEstudiantes(rows: CsvRow[], manager: EntityManager, result: ImportResultDto) {
    const repository = manager.getRepository(Estudiante);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const carnet = this.requiredValueFromAliases(row, ['carnet'], i);
      const nombre = this.optionalValueFromAliases(row, ['nombre', 'nombres'], i);
      const apellido = this.optionalValueFromAliases(row, ['apellido', 'apellidos'], i);
      const correo = this.optionalValueFromAliases(row, ['correo', 'email', 'mail'], i);
      const idCarrera = await this.resolveCarrera(row, i, manager);
      const idDirecto = this.optionalIntByAliases(row, ['id'], 'id', i);

      const current = idDirecto != null ? await repository.findOne({ where: { id: idDirecto } }) : await repository.findOne({ where: { carnet } });

      const payload: Partial<Estudiante> = {
        carnet,
        nombre,
        apellido,
        correo,
        carrera: idCarrera != null ? ({ id: idCarrera } as Carrera) : undefined,
      };

      if (current) {
        Object.assign(current, payload);
        await repository.save(current);
        result.updated += 1;
      } else {
        await repository.save(repository.create(idDirecto ? ({ id: idDirecto, ...payload } as Estudiante) : payload));
        result.inserted += 1;
      }
    }
  }

  private parseCsv(buffer: Buffer): CsvRow[] {
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

    const rows: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = this.splitCsvLine(lines[i], delimiter);
      if (values.every((value) => value.trim().length === 0)) {
        continue;
      }

      if (values.length !== headers.length) {
        throw new BadRequestException(
          `Fila ${i + 1}: cantidad de columnas invalida (esperadas ${headers.length}, recibidas ${values.length})`,
        );
      }

      const row: CsvRow = {};
      headers.forEach((header, index) => {
        row[header] = (values[index] ?? '').trim();
      });

      rows.push(row);
    }

    return rows;
  }

  private detectDelimiter(headerLine: string): ',' | ';' {
    const commaCount = (headerLine.match(/,/g) ?? []).length;
    const semicolonCount = (headerLine.match(/;/g) ?? []).length;
    return semicolonCount > commaCount ? ';' : ',';
  }

  private splitCsvLine(line: string, delimiter: ',' | ';'): string[] {
    const values: string[] = [];
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

  private normalizedKey(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  private findValueByAliases(row: CsvRow, aliases: string[]): string | undefined {
    const normalizedAliases = aliases.map((alias) => this.normalizedKey(alias));
    for (const key of Object.keys(row)) {
      if (normalizedAliases.includes(this.normalizedKey(key))) {
        return row[key];
      }
    }

    return undefined;
  }

  private requiredValueFromAliases(row: CsvRow, aliases: string[], index: number): string {
    const displayName = aliases[0];
    const value = this.findValueByAliases(row, aliases);
    if (!value || value.trim().length === 0) {
      throw new BadRequestException(`Fila ${index + 2}: ${displayName} es requerido`);
    }

    return value.trim();
  }

  private optionalValueFromAliases(row: CsvRow, aliases: string[], index: number): string | undefined {
    const value = this.findValueByAliases(row, aliases);
    if (!value || value.trim().length === 0) {
      return undefined;
    }

    return value.trim();
  }

  private requiredIntFromAliases(row: CsvRow, aliases: string[], field: string, index: number): number {
    const value = this.requiredValueFromAliases(row, aliases, index);
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new BadRequestException(`Fila ${index + 2}: ${field} debe ser numerico`);
    }

    return parsed;
  }

  private optionalIntByAliases(row: CsvRow, aliases: string[], field: string, index: number): number | undefined {
    const value = this.findValueByAliases(row, aliases);
    if (!value || value.trim().length === 0) {
      return undefined;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new BadRequestException(`Fila ${index + 2}: ${field} debe ser numerico`);
    }

    return parsed;
  }

  private optionalDecimalByAliases(row: CsvRow, aliases: string[], field: string, index: number): number | undefined {
    const value = this.findValueByAliases(row, aliases);
    if (!value || value.trim().length === 0) {
      return undefined;
    }

    const normalized = value.trim().replace(',', '.');
    const parsed = Number.parseFloat(normalized);
    if (Number.isNaN(parsed)) {
      throw new BadRequestException(`Fila ${index + 2}: ${field} debe ser numerico`);
    }

    return parsed;
  }

  private optionalBooleanByAliases(
    row: CsvRow,
    aliases: string[],
    defaultValue: boolean,
    index: number,
  ): boolean {
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

    throw new BadRequestException(`Fila ${index + 2}: valor booleano invalido (${value})`);
  }

  private optionalBooleanMaybeByAliases(
    row: CsvRow,
    aliases: string[],
    index: number,
  ): boolean | undefined {
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

    throw new BadRequestException(`Fila ${index + 2}: valor booleano invalido (${value})`);
  }

  private async resolveCarrera(row: CsvRow, index: number, manager: EntityManager): Promise<number | undefined> {
    const idCarrera = this.optionalIntByAliases(row, ['id_carrera'], 'id_carrera', index);
    if (idCarrera != null) {
      await this.assertForeignKey(index, idCarrera, 'id_carrera', Carrera, manager);
      return idCarrera;
    }

    const nombreCarrera = this.findValueByAliases(row, ['carrera', 'nombre_carrera'])?.trim();
    if (!nombreCarrera) {
      return undefined;
    }

    const repository = manager.getRepository(Carrera);
    const current = await repository.findOne({ where: { nombre: nombreCarrera } });
    if (current) {
      return current.id;
    }

    const created = await repository.save(repository.create({ nombre: nombreCarrera }));
    return created.id;
  }

  private async resolveSemestre(row: CsvRow, index: number, manager: EntityManager): Promise<number | undefined> {
    const idSemestre = this.optionalIntByAliases(row, ['id_semestre'], 'id_semestre', index);
    if (idSemestre != null) {
      await this.assertForeignKey(index, idSemestre, 'id_semestre', Semestre, manager);
      return idSemestre;
    }

    const semestreRaw = this.findValueByAliases(row, ['semestre'])?.trim();
    if (!semestreRaw) {
      return undefined;
    }

    const repository = manager.getRepository(Semestre);
    const current = await repository.findOne({ where: { semestre: semestreRaw } });
    if (current) {
      return current.id;
    }

    const created = await repository.save(repository.create({ semestre: semestreRaw }));
    return created.id;
  }

  private async resolveCurso(
    row: CsvRow,
    index: number,
    manager: EntityManager,
    options: { required?: boolean; idAliases?: string[]; lookupAliases?: string[] } = {},
  ): Promise<number | undefined> {
    const idAliases = options.idAliases ?? ['id_curso'];
    const lookupAliases = options.lookupAliases ?? ['codigo', 'codigo_curso', 'cod', 'curso', 'nombre_curso', 'nombre'];
    const idCurso = this.optionalIntByAliases(row, idAliases, idAliases[0], index);
    if (idCurso != null) {
      await this.assertForeignKey(index, idCurso, idAliases[0], Curso, manager);
      return idCurso;
    }

    const codigo = this.findValueByAliases(row, lookupAliases.filter((alias) => ['codigo', 'codigo_curso', 'cod'].includes(alias)))?.trim();
    const nombre = this.findValueByAliases(row, lookupAliases.filter((alias) => ['curso', 'nombre_curso', 'nombre'].includes(alias)))?.trim();

    if (!codigo && !nombre) {
      if (options.required) {
        throw new BadRequestException(`Fila ${index + 2}: debe enviar ${idAliases[0]}, codigo o nombre del curso`);
      }

      return undefined;
    }

    const repository = manager.getRepository(Curso);
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

  private async resolveEstudiante(row: CsvRow, index: number, manager: EntityManager): Promise<number> {
    const idEstudiante = this.optionalIntByAliases(row, ['id_estudiante'], 'id_estudiante', index);
    if (idEstudiante != null) {
      await this.assertForeignKey(index, idEstudiante, 'id_estudiante', Estudiante, manager);
      return idEstudiante;
    }

    const carnet = this.findValueByAliases(row, ['carnet'])?.trim();
    if (!carnet) {
      throw new BadRequestException(`Fila ${index + 2}: debe enviar id_estudiante o carnet`);
    }

    const repository = manager.getRepository(Estudiante);
    const current = await repository.findOne({ where: { carnet } });
    if (current) {
      return current.id;
    }

    const created = await repository.save(repository.create({ carnet }));
    return created.id;
  }

  private async resolveCiclo(row: CsvRow, index: number, manager: EntityManager): Promise<number | undefined> {
    const idCiclo = this.optionalIntByAliases(row, ['id_ciclo'], 'id_ciclo', index);
    if (idCiclo != null) {
      await this.assertForeignKey(index, idCiclo, 'id_ciclo', Ciclo, manager);
      return idCiclo;
    }

    const cicloValue = this.findValueByAliases(row, ['ciclo'])?.trim();
    if (!cicloValue) {
      return undefined;
    }

    const repository = manager.getRepository(Ciclo);
    const current = await repository.findOne({ where: { ciclo: cicloValue } });
    if (current) {
      return current.id;
    }

    const created = await repository.save(repository.create({ ciclo: cicloValue }));
    return created.id;
  }

  private async resolvePensumReference(row: CsvRow, index: number, manager: EntityManager): Promise<number> {
    const idPensum = this.optionalIntByAliases(row, ['id_pensum'], 'id_pensum', index);
    if (idPensum != null) {
      await this.assertForeignKey(index, idPensum, 'id_pensum', Pensum, manager);
      return idPensum;
    }

    const idSemestre = await this.resolveSemestre(row, index, manager);
    const idCarrera = await this.resolveCarrera(row, index, manager);
    const idCurso = await this.resolveCurso(row, index, manager, { required: true });

    if (idSemestre == null && idCarrera == null && idCurso == null) {
      throw new BadRequestException(`Fila ${index + 2}: debe enviar id_pensum o suficientes datos para identificar el pensum`);
    }

    const repository = manager.getRepository(Pensum);
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
      throw new BadRequestException(`Fila ${index + 2}: pensum no encontrado`);
    }

    return current.id;
  }

  private async findPensumByRelations(
    repository: ReturnType<EntityManager['getRepository']>,
    idSemestre: number | undefined,
    idCarrera: number | undefined,
    idCurso: number | undefined,
  ): Promise<Pensum | null> {
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

    return (await qb.getOne()) as Pensum | null;
  }

  private async findHistorialAcademico(
    repository: ReturnType<EntityManager['getRepository']>,
    idEstudiante: number,
    idCurso: number,
    idCiclo: number | undefined,
    anio: number | undefined,
  ): Promise<HistorialAcademico | null> {
    const qb = repository.createQueryBuilder('ha');
    qb.where('ha.id_estudiante = :idEstudiante', { idEstudiante }).andWhere('ha.id_curso = :idCurso', { idCurso });

    if (idCiclo != null) {
      qb.andWhere('ha.id_ciclo = :idCiclo', { idCiclo });
    }

    if (anio != null) {
      qb.andWhere('ha.anio = :anio', { anio });
    }

    return (await qb.getOne()) as HistorialAcademico | null;
  }

  private async assertForeignKey<T extends { id: number }>(
    rowIndex: number,
    value: number | undefined,
    fieldName: string,
    entity: new () => T,
    manager: EntityManager,
  ) {
    if (value == null) {
      return;
    }

    const exists = await manager.getRepository(entity).exist({ where: { id: value } as never });
    if (!exists) {
      throw new BadRequestException(`Fila ${rowIndex + 2}: ${fieldName} no existe (${value})`);
    }
  }
}