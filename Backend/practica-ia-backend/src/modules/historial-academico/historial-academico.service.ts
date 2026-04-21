import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { HistorialAcademico } from './entities/historial-academico.entity';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Ciclo } from '../ciclo/entities/ciclo.entity';
import { Pensum } from '../pensum/entities/pensum.entity';

type HistorialAcademicoConRelaciones = {
  id: number;
  nota?: number | null;
  aprobado?: boolean | null;
  anio?: number | null;
  intentos?: number;
  estudiante?: {
    id: number;
    carnet: string;
    nombre?: string | null;
    apellido?: string | null;
    correo?: string | null;
  } | null;
  curso?: {
    id: number;
    codigo: string;
    nombre: string;
  } | null;
  ciclo?: {
    id: number;
    ciclo: string;
  } | null;
};

type CursoRepitenciaAlerta = {
  id_curso: number;
  codigo: string;
  nombre: string;
  reprobados: number;
  alerta: boolean;
};

type HistorialAcademicoResumen = {
  cursos_aprobados: number;
  cursos_reprobados: number;
  porcentaje_aprobacion: number;
  creditos_acumulados: number;
  promedio_general: number | null;
  promedio_limpio: number | null;
  riesgo_repitencia: boolean;
  nivel_riesgo_repitencia: 'bajo' | 'medio' | 'alto';
  porcentaje_riesgo_repitencia: number;
};

type HistorialAcademicoPorCarnetResponse = {
  estudiante: HistorialAcademicoConRelaciones['estudiante'];
  resumen: HistorialAcademicoResumen;
  alertas_repitencia: CursoRepitenciaAlerta[];
  historial: HistorialAcademicoConRelaciones[];
};

@Injectable()
export class HistorialAcademicoService {
  constructor(
    @InjectRepository(HistorialAcademico)
    private readonly repository: Repository<HistorialAcademico>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Pensum)
    private readonly pensumRepository: Repository<Pensum>,
  ) {}

  create(dto: CreateHistorialAcademicoDto) {
    const entity = this.repository.create({
      nota: dto.nota,
      aprobado: dto.aprobado,
      anio: dto.anio,
      intentos: dto.intentos ?? 1,
      estudiante: dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined,
      curso: dto.id_curso ? ({ id: dto.id_curso } as Curso) : undefined,
      ciclo: dto.id_ciclo ? ({ id: dto.id_ciclo } as Ciclo) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['estudiante', 'curso', 'ciclo'] });
  }

  async findByCarnet(carnet: string): Promise<HistorialAcademicoPorCarnetResponse> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { carnet },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante no encontrado para carnet ${carnet}`);
    }

    const historial = (await this.repository.find({
      where: { estudiante: { carnet } },
      relations: ['estudiante', 'curso', 'ciclo'],
      order: { anio: 'DESC', id: 'DESC' },
    })) as HistorialAcademicoConRelaciones[];

    return {
      estudiante: this.mapEstudiante(estudiante),
      resumen: await this.buildResumen(historial),
      alertas_repitencia: this.buildAlertasRepitencia(historial),
      historial,
    };
  }

  async findResumenByCarnet(carnet: string) {
    const data = await this.findByCarnet(carnet);

    return {
      carnet: data.estudiante?.carnet ?? carnet,
      estudiante: data.estudiante,
      promedio_general: data.resumen.promedio_general,
      creditos_aprobados: data.resumen.creditos_acumulados,
      riesgo_repitencia_porcentaje: data.resumen.porcentaje_riesgo_repitencia,
      riesgo_repitencia: data.resumen.riesgo_repitencia,
    };
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['estudiante', 'curso', 'ciclo'] });
  }

  async update(id: number, dto: UpdateHistorialAcademicoDto) {
    const entity = await this.repository.preload({
      id,
      nota: dto.nota,
      aprobado: dto.aprobado,
      anio: dto.anio,
      intentos: dto.intentos,
      estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined) : undefined,
      curso: dto.id_curso !== undefined ? (dto.id_curso ? ({ id: dto.id_curso } as Curso) : undefined) : undefined,
      ciclo: dto.id_ciclo !== undefined ? (dto.id_ciclo ? ({ id: dto.id_ciclo } as Ciclo) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }

  private async buildResumen(historial: HistorialAcademicoConRelaciones[]): Promise<HistorialAcademicoResumen> {
    const total = historial.length;
    const aprobados = historial.filter((row) => row.aprobado === true);
    const reprobados = historial.filter((row) => row.aprobado === false);

    const notasValidas = historial
      .map((row) => (typeof row.nota === 'number' ? Number(row.nota) : null))
      .filter((nota): nota is number => nota !== null);

    const sumaNotas = notasValidas.reduce((acc, value) => acc + value, 0);
    const cantidadCursosConNota = notasValidas.length;

    const notasAprobadas = aprobados
      .map((row) => (typeof row.nota === 'number' ? Number(row.nota) : null))
      .filter((nota): nota is number => nota !== null);

    const aprobadosIds = new Set(aprobados.map((row) => row.curso?.id).filter((id): id is number => typeof id === 'number'));
    const pensum = aprobadosIds.size
      ? await this.pensumRepository.find({
          where: { curso: { id: In([...aprobadosIds]) } },
          relations: ['curso'],
        })
      : [];

    const creditosAcumulados = new Map<number, number>();
    for (const row of pensum) {
      const cursoId = row.curso?.id;
      if (!cursoId) {
        continue;
      }

      if (!creditosAcumulados.has(cursoId)) {
        creditosAcumulados.set(cursoId, row.creditos ?? 0);
      }
    }

    const totalCreditosAprobados = [...creditosAcumulados.values()].reduce((acc, value) => acc + value, 0);
    const porcentajeAprobacion = total > 0 ? this.round2((aprobados.length / total) * 100) : 0;
    const promedioGeneral = cantidadCursosConNota > 0 ? this.round2(sumaNotas / cantidadCursosConNota) : null;
    const promedioLimpio = notasAprobadas.length > 0 ? this.round2(notasAprobadas.reduce((acc, value) => acc + value, 0) / notasAprobadas.length) : null;
    const alertas = this.buildAlertasRepitencia(historial);
    const porcentajeRiesgo = total > 0 ? this.round2((reprobados.length / total) * 100) : 0;

    return {
      cursos_aprobados: aprobados.length,
      cursos_reprobados: reprobados.length,
      porcentaje_aprobacion: porcentajeAprobacion,
      creditos_acumulados: totalCreditosAprobados,
      promedio_general: promedioGeneral,
      promedio_limpio: promedioLimpio,
      riesgo_repitencia: alertas.length > 0,
      nivel_riesgo_repitencia: alertas.length > 0 || porcentajeRiesgo >= 50 ? 'alto' : porcentajeRiesgo > 0 ? 'medio' : 'bajo',
      porcentaje_riesgo_repitencia: porcentajeRiesgo,
    };
  }

  private buildAlertasRepitencia(historial: HistorialAcademicoConRelaciones[]): CursoRepitenciaAlerta[] {
    const reprobadosPorCurso = new Map<number, { codigo: string; nombre: string; reprobados: number }>();

    for (const row of historial) {
      if (row.aprobado !== false || !row.curso?.id) {
        continue;
      }

      const current = reprobadosPorCurso.get(row.curso.id) ?? {
        codigo: row.curso.codigo,
        nombre: row.curso.nombre,
        reprobados: 0,
      };

      current.reprobados += 1;
      reprobadosPorCurso.set(row.curso.id, current);
    }

    return [...reprobadosPorCurso.entries()]
      .filter(([, value]) => value.reprobados >= 2)
      .map(([id_curso, value]) => ({
        id_curso,
        codigo: value.codigo,
        nombre: value.nombre,
        reprobados: value.reprobados,
        alerta: true,
      }));
  }

  private mapEstudiante(estudiante: Estudiante): HistorialAcademicoConRelaciones['estudiante'] {
    return {
      id: estudiante.id,
      carnet: estudiante.carnet,
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      correo: estudiante.correo,
    };
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
