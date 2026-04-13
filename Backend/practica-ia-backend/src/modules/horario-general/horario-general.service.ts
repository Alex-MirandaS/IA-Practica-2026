import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { HorarioGeneral } from './entities/horario-general.entity';
import { CreateHorarioGeneralDto } from './dto/create-horario-general.dto';
import { UpdateHorarioGeneralDto } from './dto/update-horario-general.dto';
import { Seccion } from '../seccion/entities/seccion.entity';

type ExternalHorario = {
  id?: number;
  nombre?: string;
  fecha?: string;
};

type ExternalCursoHorario = Record<string, unknown>;

type SyncHorarioGeneralResult = {
  horarioId: number;
  horarioNombre?: string;
  fetchedRows: number;
  inserted: number;
  updated: number;
  deactivated: number;
  warnings: string[];
};

@Injectable()
export class HorarioGeneralService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(HorarioGeneral)
    private readonly repository: Repository<HorarioGeneral>,
  ) {}

  create(dto: CreateHorarioGeneralDto) {
    const entity = this.repository.create({
      id_curso_horario: dto.id_curso_horario,
      cupo_maximo: dto.cupo_maximo,
      activo: dto.activo ?? true,
      seccion: dto.id_seccion ? ({ id: dto.id_seccion } as Seccion) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['seccion'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['seccion'] });
  }

  async update(id: number, dto: UpdateHorarioGeneralDto) {
    const entity = await this.repository.preload({
      id,
      id_curso_horario: dto.id_curso_horario,
      cupo_maximo: dto.cupo_maximo,
      activo: dto.activo,
      seccion: dto.id_seccion !== undefined ? (dto.id_seccion ? ({ id: dto.id_seccion } as Seccion) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }

  async syncLatestFromScheduler(): Promise<SyncHorarioGeneralResult> {
    const baseUrl = process.env.SCHEDULER_API_BASE_URL ?? 'http://localhost:3000';
    const horarios = await this.fetchCollectionWithFallback<ExternalHorario>(baseUrl, ['horario', 'horarios']);
    if (horarios.length === 0) {
      throw new BadRequestException('No se encontraron horarios en el servidor externo');
    }

    const latestHorario = [...horarios].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))[0];
    const latestHorarioId = Number(latestHorario.id);
    if (!latestHorarioId) {
      throw new BadRequestException('No se pudo resolver el ultimo id_horario del servidor externo');
    }

    return this.syncFromSchedulerByHorarioId(baseUrl, latestHorarioId, latestHorario.nombre);
  }

  async syncByHorarioId(horarioId: number): Promise<SyncHorarioGeneralResult> {
    if (!Number.isInteger(horarioId) || horarioId <= 0) {
      throw new BadRequestException('horarioId debe ser un entero positivo');
    }

    const baseUrl = process.env.SCHEDULER_API_BASE_URL ?? 'http://localhost:3000';
    const horarios = await this.fetchCollectionWithFallback<ExternalHorario>(baseUrl, ['horario', 'horarios']);
    const targetHorario = horarios.find((horario) => Number(horario.id) === horarioId);
    if (!targetHorario) {
      throw new BadRequestException(`No existe el horario ${horarioId} en el servidor externo`);
    }

    return this.syncFromSchedulerByHorarioId(baseUrl, horarioId, targetHorario.nombre);
  }

  private async syncFromSchedulerByHorarioId(
    baseUrl: string,
    horarioId: number,
    horarioNombre?: string,
  ): Promise<SyncHorarioGeneralResult> {

    const cursoHorarioRows = await this.fetchCollectionWithFallback<ExternalCursoHorario>(baseUrl, [
      'curso-horario',
      'curso_horario',
      'cursohorario',
    ]);

    const rowsForLatest = cursoHorarioRows.filter(
      (row) =>
        this.readNumber(row, ['id_horario', 'idHorario', 'horario_id']) === horarioId ||
        this.readNumber(this.readObject(row, ['horario']), ['id']) === horarioId,
    );

    const warnings: string[] = [];

    const created = await this.dataSource.transaction(async (manager) => {
      const horarioGeneralRepository = manager.getRepository(HorarioGeneral);
      const deactivateResult = await horarioGeneralRepository
        .createQueryBuilder()
        .update(HorarioGeneral)
        .set({ activo: false })
        .execute();

      let inserted = 0;
      let updated = 0;

      for (let i = 0; i < rowsForLatest.length; i++) {
        const row = rowsForLatest[i];
        const idCursoHorario = this.readNumber(row, ['id']);
        if (!idCursoHorario) {
          warnings.push(`Fila ${i + 1}: id de curso_horario invalido`);
          continue;
        }

        const idSeccion =
          this.readNumber(row, ['id_seccion', 'idSeccion', 'seccion_id']) ||
          this.readNumber(this.readObject(row, ['seccion']), ['id']);
        const seccionValue = this.readString(this.readObject(row, ['seccion']), ['seccion', 'nombre', 'codigo']);

        const seccion = await this.resolveSeccionForSync(idSeccion, seccionValue, warnings, i, manager.getRepository(Seccion));

        const existing = await horarioGeneralRepository.findOne({ where: { id_curso_horario: idCursoHorario } });
        if (existing) {
          existing.activo = true;
          existing.seccion = seccion;
          await horarioGeneralRepository.save(existing);
          updated += 1;
          continue;
        }

        const entity = horarioGeneralRepository.create({
          id_curso_horario: idCursoHorario,
          seccion,
          activo: true,
        });

        await horarioGeneralRepository.save(entity);
        inserted += 1;
      }

      return {
        inserted,
        updated,
        deactivated: deactivateResult.affected ?? 0,
      };
    });

    return {
      horarioId,
      horarioNombre,
      fetchedRows: rowsForLatest.length,
      inserted: created.inserted,
      updated: created.updated,
      deactivated: created.deactivated,
      warnings,
    };
  }

  private async resolveSeccionForSync(
    idSeccion: number,
    seccionValue: string,
    warnings: string[],
    index: number,
    repository: Repository<Seccion>,
  ): Promise<Seccion | undefined> {
    if (idSeccion) {
      const byId = await repository.findOne({ where: { id: idSeccion } });
      if (byId) {
        return byId;
      }

      if (seccionValue) {
        const byValue = await repository.findOne({ where: { seccion: seccionValue } });
        if (byValue) {
          return byValue;
        }

        return repository.save(repository.create({ seccion: seccionValue }));
      }

      warnings.push(`Fila ${index + 1}: id_seccion ${idSeccion} no existe y no se pudo inferir valor de seccion`);
      return undefined;
    }

    if (!seccionValue) {
      return undefined;
    }

    const existing = await repository.findOne({ where: { seccion: seccionValue } });
    if (existing) {
      return existing;
    }

    return repository.save(repository.create({ seccion: seccionValue }));
  }

  private async fetchCollectionWithFallback<T>(baseUrl: string, endpoints: string[]): Promise<T[]> {
    for (const endpoint of endpoints) {
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/${endpoint}`);
      if (!response.ok) {
        continue;
      }

      const data = (await response.json()) as unknown;
      const list = this.normalizeCollection<T>(data);
      if (list.length > 0) {
        return list;
      }
    }

    return [];
  }

  private normalizeCollection<T>(data: unknown): T[] {
    if (Array.isArray(data)) {
      return data as T[];
    }

    if (!data || typeof data !== 'object') {
      return [];
    }

    const obj = data as Record<string, unknown>;
    const candidates = [obj.data, obj.horarios, obj.curso_horario, obj.items];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate as T[];
      }
    }

    return [];
  }

  private readNumber(source: unknown, keys: string[]): number {
    if (!source || typeof source !== 'object') {
      return 0;
    }

    const obj = source as Record<string, unknown>;
    for (const key of keys) {
      const value = Number(obj[key]);
      if (Number.isFinite(value) && value > 0) {
        return value;
      }
    }

    return 0;
  }

  private readString(source: unknown, keys: string[]): string {
    if (!source || typeof source !== 'object') {
      return '';
    }

    const obj = source as Record<string, unknown>;
    for (const key of keys) {
      const value = obj[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }

    return '';
  }

  private readObject(source: unknown, keys: string[]): Record<string, unknown> {
    if (!source || typeof source !== 'object') {
      return {};
    }

    const obj = source as Record<string, unknown>;
    for (const key of keys) {
      const value = obj[key];
      if (value && typeof value === 'object') {
        return value as Record<string, unknown>;
      }
    }

    return {};
  }
}
