import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import geneticalgorithm from 'geneticalgorithm';
import { In, Repository } from 'typeorm';
import { HorarioEstudiante } from './entities/horario-estudiante.entity';
import { CreateHorarioEstudianteDto } from './dto/create-horario-estudiante.dto';
import { UpdateHorarioEstudianteDto } from './dto/update-horario-estudiante.dto';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { Pensum } from '../pensum/entities/pensum.entity';
import { SeleccionCursos } from '../seleccion-cursos/entities/seleccion-cursos.entity';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { CursoPrerrequisito } from '../curso-prerrequisito/entities/curso-prerrequisito.entity';
import { DetalleHorario } from '../detalle-horario/entities/detalle-horario.entity';
import { GenerateHorarioPersonalizadoDto } from './dto/generate-horario-personalizado.dto';

type ExternalCursoHorario = Record<string, unknown>;

type TimeBlock = {
  day: string;
  start: number;
  end: number;
};

type DetailedTimeBlock = {
  day: string;
  start: number;
  end: number;
  periodo: {
    id: number;
    hora_inicio: string;
    hora_fin: string;
  };
  salon: string;
  tipo_jornada: string;
};

type HorarioVariant = {
  horarioGeneralId: number;
  idCursoHorario: number;
  seccion: string;
  blocks: TimeBlock[];
  detailedBlocks: DetailedTimeBlock[];
  minCreditosRequeridos: number;
  docente?: string;
  semestre?: string;
  salon?: string;
};

type CursoCandidato = {
  idCurso: number;
  codigo: string;
  nombre: string;
  creditos: number;
  obligatorio: boolean;
  prioridadBottleneck: number;
  elegible: boolean;
  motivoNoElegible?: string;
  variantes: HorarioVariant[];
};

type CursoResuelto = {
  curso: CursoCandidato;
  variante: HorarioVariant;
};

@Injectable()
export class HorarioEstudianteService {
  constructor(
    @InjectRepository(HorarioEstudiante)
    private readonly repository: Repository<HorarioEstudiante>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Pensum)
    private readonly pensumRepository: Repository<Pensum>,
    @InjectRepository(SeleccionCursos)
    private readonly seleccionRepository: Repository<SeleccionCursos>,
    @InjectRepository(HistorialAcademico)
    private readonly historialRepository: Repository<HistorialAcademico>,
    @InjectRepository(CursoPrerrequisito)
    private readonly prerrequisitoRepository: Repository<CursoPrerrequisito>,
    @InjectRepository(DetalleHorario)
    private readonly detalleHorarioRepository: Repository<DetalleHorario>,
  ) {}

  create(dto: CreateHorarioEstudianteDto) {
    const entity = this.repository.create({
      estudiante: dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined,
    });
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({ relations: ['estudiante'] });
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['estudiante'] });
  }

  async update(id: number, dto: UpdateHorarioEstudianteDto) {
    const entity = await this.repository.preload({
      id,
      estudiante: dto.id_estudiante !== undefined ? (dto.id_estudiante ? ({ id: dto.id_estudiante } as Estudiante) : undefined) : undefined,
    });
    if (!entity) return null;
    return this.repository.save(entity);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }

  async previewCursosParaSeleccion(idEstudiante: number) {
    const contexto = await this.buildPlanningContext(idEstudiante);
    const seleccionMap = new Map<number, boolean>();
    contexto.selecciones.forEach((row) => {
      if (row.curso?.id) {
        seleccionMap.set(row.curso.id, row.seleccionado);
      }
    });

    return {
      id_estudiante: idEstudiante,
      creditos_aprobados_acumulados: contexto.creditosAprobados,
      cursos: contexto.cursos.map((curso) => {
        const existeSeleccion = seleccionMap.has(curso.idCurso);
        const seleccionadoPorDefecto = existeSeleccion
          ? Boolean(seleccionMap.get(curso.idCurso))
          : curso.obligatorio && curso.elegible && curso.variantes.length > 0;

        return {
          id_curso: curso.idCurso,
          codigo: curso.codigo,
          nombre: curso.nombre,
          creditos: curso.creditos,
          obligatorio: curso.obligatorio,
          prioridad_bottleneck: curso.prioridadBottleneck,
          elegible: curso.elegible,
          motivo_no_elegible: curso.motivoNoElegible,
          abierto_en_horario_general: curso.variantes.length > 0,
          seleccionado_por_defecto: seleccionadoPorDefecto,
          variantes: curso.variantes.map((variant) => ({
            id_horario_general: variant.horarioGeneralId,
            id_curso_horario: variant.idCursoHorario,
            seccion: variant.seccion,
            semestre: variant.semestre,
            docente: variant.docente,
            salon: variant.salon,
            bloques: variant.blocks,
            min_creditos_requeridos: variant.minCreditosRequeridos,
          })),
        };
      }),
    };
  }

  async previewCursosParaSeleccionPorCarnet(carnet: string) {
    const normalizedCarnet = carnet.trim();
    if (!normalizedCarnet) {
      throw new BadRequestException('Debe enviar un carnet valido');
    }

    const estudiante = await this.estudianteRepository.findOne({
      where: { carnet: normalizedCarnet },
      select: ['id'],
    });

    if (!estudiante) {
      throw new BadRequestException(`No existe un estudiante con carnet ${normalizedCarnet}`);
    }

    return this.previewCursosParaSeleccion(estudiante.id);
  }

  async generarHorarioPersonalizado(dto: GenerateHorarioPersonalizadoDto) {
    // Resolver carnet a id_estudiante
    const normalizedCarnet = dto.carnet.trim();
    if (!normalizedCarnet) {
      throw new BadRequestException('Debe enviar un carnet valido');
    }

    const estudiante = await this.estudianteRepository.findOne({
      where: { carnet: normalizedCarnet },
      select: ['id'],
    });

    if (!estudiante) {
      throw new BadRequestException(`No existe un estudiante con carnet ${normalizedCarnet}`);
    }

    const idEstudiante = estudiante.id;
    const contexto = await this.buildPlanningContext(idEstudiante);

    const seleccionMap = new Map<number, boolean>();
    contexto.selecciones.forEach((row) => {
      if (row.curso?.id) {
        seleccionMap.set(row.curso.id, row.seleccionado);
      }
    });

    const selectedFromInput = new Set(dto.selected_course_ids ?? []);
    const usePayloadSelection = selectedFromInput.size > 0;

    const cursosDeseados = contexto.cursos.filter((curso) => {
      if (usePayloadSelection) {
        return selectedFromInput.has(curso.idCurso);
      }

      if (seleccionMap.has(curso.idCurso)) {
        return Boolean(seleccionMap.get(curso.idCurso));
      }

      return curso.obligatorio;
    });

    if (cursosDeseados.length === 0) {
      throw new BadRequestException('No hay cursos seleccionados para generar horario');
    }

    // Separar cursos elegibles de no elegibles
    const cursosElegibles = cursosDeseados.filter((curso) => curso.elegible);
    const cursosNoElegibles = cursosDeseados.filter((curso) => !curso.elegible);

    // Separar cursos abiertos de cerrados (entre los elegibles)
    const cursosCerrados = cursosElegibles.filter((curso) => curso.variantes.length === 0);
    const cursosAbiertos = cursosElegibles.filter((curso) => curso.variantes.length > 0);

    if (cursosAbiertos.length === 0) {
      // Si no hay cursos abiertos y elegibles, reportar por qué
      const reporteOmitidos = [
        ...cursosNoElegibles.map((c) => ({
          id_curso: c.idCurso,
          codigo: c.codigo,
          nombre: c.nombre,
          razon: c.motivoNoElegible ?? 'No elegible',
        })),
        ...cursosCerrados.map((c) => ({
          id_curso: c.idCurso,
          codigo: c.codigo,
          nombre: c.nombre,
          razon: 'No hay variantes abiertas',
        })),
      ];

      throw new BadRequestException({
        message: 'No hay cursos disponibles para generar horario',
        razon: 'Los cursos seleccionados no cumplen prerrequisitos, créditos, o no tienen variantes abiertas',
        cursos_omitidos: reporteOmitidos,
      });
    }

    // Registrar cursos omitidos para transparencia
    const cursosOmitidos = [
      ...cursosNoElegibles.map((c) => ({
        id_curso: c.idCurso,
        codigo: c.codigo,
        nombre: c.nombre,
        razon: c.motivoNoElegible ?? 'No elegible',
      })),
      ...cursosCerrados.map((c) => ({
        id_curso: c.idCurso,
        codigo: c.codigo,
        nombre: c.nombre,
        razon: 'No hay variantes abiertas',
      })),
    ];

    const maxCreditos = dto.max_credits ?? 24;
    const populationSize = dto.population_size ?? 80;
    const generations = dto.generations ?? 120;
    const persist = dto.persist !== false;

    const bestGene = this.runGeneticSelection(cursosAbiertos, populationSize, generations, maxCreditos);
    const seleccion = this.decodeGene(bestGene, cursosAbiertos);
    const conflictos = this.detectConflicts(seleccion);

    const creditosSeleccionados = seleccion.reduce((acc, item) => acc + item.curso.creditos, 0);
    if (conflictos.length > 0) {
      return {
        status: 'requiere_seleccion_manual',
        id_estudiante: idEstudiante,
        creditos_seleccionados: creditosSeleccionados,
        max_creditos: maxCreditos,
        conflictos,
        alternativas: this.buildAlternatives(conflictos, cursosAbiertos, bestGene),
        ...(cursosOmitidos.length > 0 && {
          cursos_omitidos: cursosOmitidos,
        }),
      };
    }

    if (creditosSeleccionados > maxCreditos) {
      return {
        status: 'requiere_ajuste_creditos',
        id_estudiante: idEstudiante,
        creditos_seleccionados: creditosSeleccionados,
        max_creditos: maxCreditos,
        sugerencia: 'Reduce cursos optativos o aumenta max_credits para continuar',
        ...(cursosOmitidos.length > 0 && {
          cursos_omitidos: cursosOmitidos,
        }),
      };
    }

    let horarioGeneradoId: number | undefined;
    if (persist) {
      const header = await this.repository.save(
        this.repository.create({ estudiante: { id: idEstudiante } as Estudiante }),
      );

      const detalles = seleccion.map(() =>
        this.detalleHorarioRepository.create({
          horario: { id: header.id } as HorarioEstudiante,
        }),
      );
      await this.detalleHorarioRepository.save(detalles);
      horarioGeneradoId = header.id;
    }

    return {
      status: 'generado',
      id_estudiante: idEstudiante,
      id_horario_estudiante: horarioGeneradoId,
      creditos_seleccionados: creditosSeleccionados,
      max_creditos: maxCreditos,
      cursos: seleccion.map((item) => ({
        id_curso: item.curso.idCurso,
        codigo: item.curso.codigo,
        nombre: item.curso.nombre,
        obligatorio: item.curso.obligatorio,
        prioridad_bottleneck: item.curso.prioridadBottleneck,
        id_horario_general: item.variante.horarioGeneralId,
        id_curso_horario: item.variante.idCursoHorario,
        seccion: item.variante.seccion,
        semestre: item.variante.semestre,
        docente: item.variante.docente,
        salon: item.variante.salon,
        bloques: item.variante.blocks,
        bloques_detallados: item.variante.detailedBlocks.map((block) => ({
          periodo: {
            id: block.periodo.id,
            hora_inicio: block.periodo.hora_inicio,
            hora_fin: block.periodo.hora_fin,
          },
          salon: block.salon,
          tipo_jornada: block.tipo_jornada,
        })),
      })),
      ...(cursosOmitidos.length > 0 && {
        cursos_omitidos: cursosOmitidos,
      }),
    };
  }

  private runGeneticSelection(
    cursos: CursoCandidato[],
    populationSize: number,
    generations: number,
    maxCreditos: number,
  ): number[] {
    const randomGene = () =>
      cursos.map((curso) => {
        if (curso.variantes.length === 0) return -1;
        return Math.floor(Math.random() * curso.variantes.length);
      });

    const population = Array.from({ length: Math.max(populationSize, 20) }, randomGene);

    const ga = geneticalgorithm({
      population,
      populationSize: Math.max(populationSize, 20),
      mutationFunction: (gene: number[]) => this.mutateGene(gene, cursos),
      crossoverFunction: (a: number[], b: number[]) => this.crossoverGene(a, b),
      fitnessFunction: (gene: number[]) => this.fitness(gene, cursos, maxCreditos),
    });

    for (let i = 0; i < Math.max(generations, 30); i++) {
      ga.evolve();
    }

    return ga.best() as number[];
  }

  private mutateGene(gene: number[], cursos: CursoCandidato[]): number[] {
    const copy = [...gene];
    const idx = Math.floor(Math.random() * copy.length);
    if (cursos[idx].variantes.length === 0) {
      copy[idx] = -1;
      return copy;
    }

    copy[idx] = Math.floor(Math.random() * cursos[idx].variantes.length);
    return copy;
  }

  private crossoverGene(a: number[], b: number[]): [number[], number[]] {
    if (a.length !== b.length || a.length === 0) {
      return [a, b];
    }

    const point = Math.floor(Math.random() * a.length);
    const first = [...a.slice(0, point), ...b.slice(point)];
    const second = [...b.slice(0, point), ...a.slice(point)];
    return [first, second];
  }

  private fitness(gene: number[], cursos: CursoCandidato[], maxCreditos: number): number {
    let score = 0;
    const chosen: CursoResuelto[] = [];

    for (let i = 0; i < cursos.length; i++) {
      const curso = cursos[i];
      const variantIndex = gene[i] ?? -1;
      const variant = curso.variantes[variantIndex];
      if (!variant) {
        score -= curso.obligatorio ? 250 : 120;
        continue;
      }

      chosen.push({ curso, variante: variant });
      score += curso.prioridadBottleneck * 25;
      score += curso.obligatorio ? 20 : 8;
    }

    const totalCreditos = chosen.reduce((acc, row) => acc + row.curso.creditos, 0);
    if (totalCreditos > maxCreditos) {
      score -= (totalCreditos - maxCreditos) * 45;
    }

    const conflictos = this.detectConflicts(chosen);
    score -= conflictos.length * 400;

    score += this.consecutiveBonus(chosen);
    return score;
  }

  private decodeGene(gene: number[], cursos: CursoCandidato[]): CursoResuelto[] {
    return cursos
      .map((curso, idx) => {
        const variante = curso.variantes[gene[idx] ?? -1];
        if (!variante) {
          return null;
        }

        return { curso, variante };
      })
      .filter((value): value is CursoResuelto => Boolean(value));
  }

  private detectConflicts(chosen: CursoResuelto[]) {
    const conflicts: Array<{
      curso_a: { id_curso: number; codigo: string; nombre: string; seccion: string };
      curso_b: { id_curso: number; codigo: string; nombre: string; seccion: string };
      bloque_a: TimeBlock;
      bloque_b: TimeBlock;
    }> = [];

    for (let i = 0; i < chosen.length; i++) {
      for (let j = i + 1; j < chosen.length; j++) {
        const a = chosen[i];
        const b = chosen[j];

        for (const blockA of a.variante.blocks) {
          for (const blockB of b.variante.blocks) {
            if (this.blocksOverlap(blockA, blockB)) {
              conflicts.push({
                curso_a: {
                  id_curso: a.curso.idCurso,
                  codigo: a.curso.codigo,
                  nombre: a.curso.nombre,
                  seccion: a.variante.seccion,
                },
                curso_b: {
                  id_curso: b.curso.idCurso,
                  codigo: b.curso.codigo,
                  nombre: b.curso.nombre,
                  seccion: b.variante.seccion,
                },
                bloque_a: blockA,
                bloque_b: blockB,
              });
              break;
            }
          }
        }
      }
    }

    return conflicts;
  }

  private buildAlternatives(
    conflicts: Array<{
      curso_a: { id_curso: number; codigo: string; nombre: string; seccion: string };
      curso_b: { id_curso: number; codigo: string; nombre: string; seccion: string };
      bloque_a: TimeBlock;
      bloque_b: TimeBlock;
    }>,
    cursos: CursoCandidato[],
    gene: number[],
  ) {
    const result: Array<{ id_curso: number; codigo: string; nombre: string; variantes_sin_traslape: HorarioVariant[] }> = [];
    const seen = new Set<number>();

    const byId = new Map<number, CursoCandidato>(cursos.map((curso) => [curso.idCurso, curso]));

    for (const conflict of conflicts) {
      const pairs: Array<[number, number]> = [
        [conflict.curso_a.id_curso, conflict.curso_b.id_curso],
        [conflict.curso_b.id_curso, conflict.curso_a.id_curso],
      ];

      for (const [targetId, againstId] of pairs) {
        if (seen.has(targetId)) {
          continue;
        }

        const target = byId.get(targetId);
        const against = byId.get(againstId);
        if (!target || !against) {
          continue;
        }

        const againstIndex = cursos.findIndex((curso) => curso.idCurso === againstId);
        const currentAgainst = against.variantes[gene[againstIndex] ?? -1];
        if (!currentAgainst) {
          continue;
        }

        const compatibles = target.variantes.filter((variant) =>
          !variant.blocks.some((blockA) =>
            currentAgainst.blocks.some((blockB) => this.blocksOverlap(blockA, blockB)),
          ),
        );

        result.push({
          id_curso: target.idCurso,
          codigo: target.codigo,
          nombre: target.nombre,
          variantes_sin_traslape: compatibles,
        });
        seen.add(targetId);
      }
    }

    return result;
  }

  private consecutiveBonus(chosen: CursoResuelto[]): number {
    const byDay = new Map<string, Array<{ start: number; end: number; obligatorio: boolean }>>();

    for (const row of chosen) {
      for (const block of row.variante.blocks) {
        const list = byDay.get(block.day) ?? [];
        list.push({ start: block.start, end: block.end, obligatorio: row.curso.obligatorio });
        byDay.set(block.day, list);
      }
    }

    let score = 0;
    for (const blocks of byDay.values()) {
      blocks.sort((a, b) => a.start - b.start);
      for (let i = 0; i < blocks.length - 1; i++) {
        const gap = blocks[i + 1].start - blocks[i].end;
        if (gap >= 0 && gap <= 30) {
          score += blocks[i].obligatorio || blocks[i + 1].obligatorio ? 12 : 6;
        }
      }
    }

    return score;
  }

  private blocksOverlap(a: TimeBlock, b: TimeBlock): boolean {
    // Si ambos tienen día desconocido ('*'), no podemos validar conflicto
    // Permitimos la combinación para que el algoritmo funcione
    const bothUnknownDay = a.day === '*' && b.day === '*';
    if (bothUnknownDay) {
      return false;
    }

    // Si solo uno tiene día desconocido, asumimos que no es conflicto
    if (a.day === '*' || b.day === '*') {
      return false;
    }

    // Ambos tienen días conocidos: validar que sean mismo día y sobrepongan horas
    const sameDay = a.day === b.day;
    return sameDay && a.start < b.end && b.start < a.end;
  }

  private async buildPlanningContext(idEstudiante: number) {
    const estudiante = await this.estudianteRepository.findOne({ where: { id: idEstudiante }, relations: ['carrera'] });
    if (!estudiante) {
      throw new BadRequestException(`No existe el estudiante ${idEstudiante}`);
    }

    if (!estudiante.carrera?.id) {
      throw new BadRequestException('El estudiante no tiene carrera asignada');
    }

    const pensumRows = await this.pensumRepository.find({
      where: { carrera: { id: estudiante.carrera.id } },
      relations: ['curso'],
    });

    const pensumValidos = pensumRows.filter((row) => row.curso?.id);
    if (pensumValidos.length === 0) {
      throw new BadRequestException('No hay pensum configurado para la carrera del estudiante');
    }

    const historial = await this.historialRepository.find({
      where: { estudiante: { id: idEstudiante } },
      relations: ['curso'],
    });

    const aprobados = new Set<number>(
      historial.filter((row) => row.aprobado && row.curso?.id).map((row) => row.curso!.id),
    );

    const pensumByCurso = new Map<number, Pensum>();
    pensumValidos.forEach((row) => {
      if (row.curso?.id) {
        pensumByCurso.set(row.curso.id, row);
      }
    });

    const creditosAprobados = pensumValidos
      .filter((row) => row.curso?.id && aprobados.has(row.curso.id))
      .reduce((acc, row) => acc + row.creditos, 0);

    const prereqRows = await this.prerrequisitoRepository.find({
      where: { pensum: { id: In(pensumValidos.map((row) => row.id)) } },
      relations: ['pensum', 'pensum.curso', 'prerrequisito'],
    });

    const prereqByCurso = new Map<number, number[]>();
    for (const row of prereqRows) {
      const targetCourseId = row.pensum?.curso?.id;
      const prereqId = row.prerrequisito?.id;
      if (!targetCourseId || !prereqId) {
        continue;
      }

      const list = prereqByCurso.get(targetCourseId) ?? [];
      list.push(prereqId);
      prereqByCurso.set(targetCourseId, list);
    }

    const bottleneckByCurso = new Map<number, number>();
    for (const [, prereqs] of prereqByCurso.entries()) {
      for (const prereqCourseId of prereqs) {
        bottleneckByCurso.set(prereqCourseId, (bottleneckByCurso.get(prereqCourseId) ?? 0) + 1);
      }
    }

    const variantesByCurso = await this.buildVariantsFromLatestSchedule(pensumValidos);

    const cursos: CursoCandidato[] = pensumValidos
      .filter((row) => row.curso?.id && !aprobados.has(row.curso.id))
      .map((row) => {
        const idCurso = row.curso!.id;
        const prereqs = prereqByCurso.get(idCurso) ?? [];
        const prereqsPendientes = prereqs.filter((courseId) => !aprobados.has(courseId));
        const variantes = variantesByCurso.get(idCurso) ?? [];

        let motivoNoElegible = '';
        if (prereqsPendientes.length > 0) {
          motivoNoElegible = 'No cumple prerrequisitos';
        } else {
          const creditRule = variantes.reduce((max, item) => Math.max(max, item.minCreditosRequeridos), 0);
          if (creditRule > 0 && creditosAprobados < creditRule) {
            motivoNoElegible = `Requiere ${creditRule} creditos aprobados`;
          }
        }

        return {
          idCurso,
          codigo: row.curso!.codigo,
          nombre: row.curso!.nombre,
          creditos: row.creditos,
          obligatorio: row.obligatorio,
          prioridadBottleneck: bottleneckByCurso.get(idCurso) ?? 0,
          elegible: motivoNoElegible.length === 0,
          motivoNoElegible: motivoNoElegible || undefined,
          variantes,
        };
      });

    const selecciones = await this.seleccionRepository.find({
      where: { estudiante: { id: idEstudiante } },
      relations: ['curso'],
    });

    return {
      estudiante,
      cursos,
      selecciones,
      creditosAprobados,
    };
  }

  private extractBlocksFromSchedulerVariant(
    variantRow: ExternalCursoHorario,
    jornadaRows: ExternalCursoHorario[],
    cursoRow: ExternalCursoHorario,
    periodoMap?: Map<number, string>,
  ): { blocks: TimeBlock[]; detailedBlocks: DetailedTimeBlock[] } {
    const blocks: TimeBlock[] = [];
    const detailedBlocks: DetailedTimeBlock[] = [];

    const pushBlock = (
      dayRaw: string,
      startRaw: string,
      endRaw: string,
      meta?: {
        periodoId: number;
        salon: string;
        tipoJornada: string;
      },
    ) => {
      const day = this.normalizeDay(dayRaw);
      const start = this.parseTimeToMinutes(startRaw);
      const end = this.parseTimeToMinutes(endRaw);
      if (start === null || end === null || start >= end) {
        return;
      }

      blocks.push({ day, start, end });

      const periodoId = meta?.periodoId ?? 0;
      if (periodoId > 0 && startRaw && endRaw) {
        detailedBlocks.push({
          day,
          start,
          end,
          periodo: {
            id: periodoId,
            hora_inicio: startRaw,
            hora_fin: endRaw,
          },
          salon: meta?.salon ?? '',
          tipo_jornada: meta?.tipoJornada ?? '',
        });
      }
    };

    for (const jornada of jornadaRows) {
      const bloques = this.readArray(jornada, ['bloques']);
      const tipoJornada = this.readString(jornada, ['tipo']);
      for (const bloque of bloques) {
        const periodo = this.readObject(bloque, ['periodo']);
        const periodoId = this.readNumber(periodo, ['id']) || this.readNumber(bloque, ['id_periodo_curso']);
        const salon = this.readString(this.readObject(bloque, ['salon']), ['nombre']);
        let dayValue =
          this.readString(bloque, ['dia', 'day', 'dias', 'weekday']) ||
          this.readString(periodo, ['dia', 'day', 'dias', 'weekday']) ||
          this.readString(jornada, ['dia', 'day', 'dias', 'weekday']) ||
          this.readString(variantRow, ['dia', 'day', 'dias', 'weekday']) ||
          this.readString(cursoRow, ['dia', 'day', 'dias', 'weekday']);

        if (!dayValue && periodoMap && periodoId > 0) {
          dayValue = periodoMap.get(periodoId) || '';
        }

        const startValue =
          this.readString(periodo, ['hora_inicio', 'inicio', 'start', 'start_time']) ||
          this.readString(bloque, ['hora_inicio', 'inicio', 'start', 'start_time']);

        const endValue =
          this.readString(periodo, ['hora_fin', 'fin', 'end', 'end_time']) ||
          this.readString(bloque, ['hora_fin', 'fin', 'end', 'end_time']);

        const days = dayValue
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);

        if (days.length === 0) {
          pushBlock('', startValue, endValue, {
            periodoId,
            salon,
            tipoJornada,
          });
          continue;
        }

        days.forEach((day) =>
          pushBlock(day, startValue, endValue, {
            periodoId,
            salon,
            tipoJornada,
          }),
        );
      }
    }

    return { blocks, detailedBlocks };
  }

  private async buildVariantsFromLatestSchedule(pensumRows: Pensum[]): Promise<Map<number, HorarioVariant[]>> {
    const scheduleData = await this.fetchLatestGeneratedSchedule();
    const cursosExterno = this.readArray(scheduleData, ['cursos']);

    const periodoMap = await this.buildPeriodoToDayMapping();

    const byInternalId = new Map<number, HorarioVariant[]>();
    const byExternalCourseId = new Map<number, number>();
    const byCodigo = new Map<string, number>();

    for (const row of pensumRows) {
      const idInterno = row.curso?.id;
      if (!idInterno) {
        continue;
      }

      if (row.curso?.id_externo) {
        byExternalCourseId.set(Number(row.curso.id_externo), idInterno);
      }

      const codigo = this.normalizeCode(row.curso?.codigo ?? '');
      if (codigo) {
        byCodigo.set(codigo, idInterno);
      }
    }

    const horarioGeneralId = this.readNumber(scheduleData, ['id_horario_general']);
    for (const cursoExterno of cursosExterno) {
      const externalCourseId = this.readNumber(cursoExterno, ['id_curso']);
      const externalCodigo = this.normalizeCode(this.readString(cursoExterno, ['codigo']));

      const internalCourseId =
        byExternalCourseId.get(externalCourseId) ??
        (externalCodigo ? byCodigo.get(externalCodigo) : undefined);

      if (!internalCourseId) {
        continue;
      }

      const variantes = this.readArray(cursoExterno, ['variantes']);
      for (const variantRow of variantes) {
        const isActive = this.readBoolean(variantRow, ['activo'], true);
        if (!isActive) {
          continue;
        }

        const jornadaRows = this.readArray(variantRow, ['jornadas']);
        const { blocks, detailedBlocks } = this.extractBlocksFromSchedulerVariant(
          variantRow,
          jornadaRows,
          cursoExterno,
          periodoMap,
        );
        if (blocks.length === 0) {
          continue;
        }

        const docente = this.readString(this.readObject(variantRow, ['docente']), ['nombre']);
        const variant: HorarioVariant = {
          horarioGeneralId,
          idCursoHorario: this.readNumber(variantRow, ['id_curso_horario', 'id']),
          seccion: this.readString(variantRow, ['seccion']) || 'N/A',
          blocks,
          detailedBlocks,
          minCreditosRequeridos: this.readNumber(variantRow, ['min_creditos_requeridos', 'min_creditos']),
          docente: docente || undefined,
          semestre: this.readString(cursoExterno, ['semestre']) || undefined,
          salon: this.extractFirstSalon(variantRow),
        };

        const bucket = byInternalId.get(internalCourseId) ?? [];
        bucket.push(variant);
        byInternalId.set(internalCourseId, bucket);
      }
    }

    return byInternalId;
  }

  private extractFirstSalon(variantRow: ExternalCursoHorario): string | undefined {
    const jornadas = this.readArray(variantRow, ['jornadas']);
    for (const jornada of jornadas) {
      const bloques = this.readArray(jornada, ['bloques']);
      for (const bloque of bloques) {
        const salon = this.readObject(bloque, ['salon']);
        const salonNombre = this.readString(salon, ['nombre']);
        if (salonNombre) {
          return salonNombre;
        }
      }
    }

    return undefined;
  }

  private normalizeDay(raw: string): string {
    const value = raw
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const map: Record<string, string> = {
      lunes: 'LU',
      lu: 'LU',
      monday: 'LU',
      martes: 'MA',
      ma: 'MA',
      tuesday: 'MA',
      miercoles: 'MI',
      mie: 'MI',
      mi: 'MI',
      wednesday: 'MI',
      jueves: 'JU',
      ju: 'JU',
      thursday: 'JU',
      viernes: 'VI',
      vi: 'VI',
      friday: 'VI',
      sabado: 'SA',
      sa: 'SA',
      saturday: 'SA',
      domingo: 'DO',
      do: 'DO',
      sunday: 'DO',
    };

    if (!value) {
      return '*';
    }

    return map[value] ?? '*';
  }

  private parseTimeToMinutes(raw: string): number | null {
    if (!raw || raw.trim().length === 0) {
      return null;
    }

    const match = raw.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!match) {
      return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return null;
    }

    return hours * 60 + minutes;
  }

  private async fetchLatestGeneratedSchedule(): Promise<ExternalCursoHorario> {
    const baseUrl = process.env.SCHEDULER_API_BASE_URL ?? 'http://localhost:3000';
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/generation/ultimo-horario`);

    if (!response.ok) {
      throw new BadRequestException('No fue posible obtener el ultimo horario generado del scheduler');
    }

    const data = (await response.json()) as unknown;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new BadRequestException('La respuesta del scheduler no tiene un formato valido');
    }

    return data as ExternalCursoHorario;
  }

  private readArray(source: unknown, keys: string[]): Record<string, unknown>[] {
    if (!source || typeof source !== 'object') {
      return [];
    }

    const obj = source as Record<string, unknown>;
    for (const key of keys) {
      const value = obj[key];
      if (Array.isArray(value)) {
        return value.filter((item) => item && typeof item === 'object') as Record<string, unknown>[];
      }
    }

    return [];
  }

  private readObject(source: unknown, keys: string[]): Record<string, unknown> {
    if (!source || typeof source !== 'object') {
      return {};
    }

    const obj = source as Record<string, unknown>;
    for (const key of keys) {
      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as Record<string, unknown>;
      }
    }

    return {};
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

  private readBoolean(source: unknown, keys: string[], defaultValue = false): boolean {
    if (!source || typeof source !== 'object') {
      return defaultValue;
    }

    const obj = source as Record<string, unknown>;
    for (const key of keys) {
      const value = obj[key];
      if (typeof value === 'boolean') {
        return value;
      }
    }

    return defaultValue;
  }

  private normalizeCode(value: string): string {
    return value.trim().toUpperCase();
  }

  private normalizeCollection(data: unknown): Record<string, unknown>[] {
    if (!data || typeof data !== 'object') {
      return [];
    }

    if (Array.isArray(data)) {
      return data.filter((item) => item && typeof item === 'object');
    }

    const obj = data as Record<string, unknown>;
    for (const key of ['data', 'items', 'periodos', 'dias', 'detalle_dias', 'detalleDias']) {
      const value = obj[key];
      if (Array.isArray(value)) {
        return value.filter((item) => item && typeof item === 'object');
      }
    }

    return [];
  }

  private async buildPeriodoToDayMapping(): Promise<Map<number, string>> {
    // Por ahora retornamos mapa vacío
    // Los períodos en el scheduler no incluyen información de día
    // El algoritmo funcionará validando solo por horarios
    return new Map<number, string>();
  }

  private async fetchAndMapPeriodosWithDias(baseUrl: string, map: Map<number, string>): Promise<void> {
    const periodosUrl = `${baseUrl.replace(/\/$/, '')}/periodos`;
    const detalleDiasUrl = `${baseUrl.replace(/\/$/, '')}/detalle-dias`;
    const diasUrl = `${baseUrl.replace(/\/$/, '')}/dias`;

    try {
      const [periodosData, detalleDiasData, diasData] = await Promise.all([
        fetch(periodosUrl).then((res) => (res.ok ? res.json() : null)),
        fetch(detalleDiasUrl).then((res) => (res.ok ? res.json() : null)),
        fetch(diasUrl).then((res) => (res.ok ? res.json() : null)),
      ]);

      const periodos = this.normalizeCollection(periodosData);
      const detalleDias = this.normalizeCollection(detalleDiasData);
      const dias = this.normalizeCollection(diasData);

      console.log('Periodos fetched:', periodos.length);
      console.log('Detalle-días fetched:', detalleDias.length);
      console.log('Días fetched:', dias.length);

      const diasById = new Map<number, Record<string, unknown>>()
      dias.forEach((dia) => {
        const id = this.readNumber(dia, ['id']);
        if (id > 0) {
          diasById.set(id, dia);
        }
      });

      const detallesByJornada = new Map<number, number>();
      detalleDias.forEach((detalle) => {
        const jornada = this.readNumber(detalle, ['id_jornada_curso']);
        const diaId = this.readNumber(detalle, ['id_dia']);
        if (jornada > 0 && diaId > 0) {
          detallesByJornada.set(jornada, diaId);
        }
      });

      for (const periodo of periodos) {
        const periodoId = this.readNumber(periodo, ['id']);
        if (!periodoId) {
          continue;
        }

        let dayValue = this.readString(periodo, ['dia', 'day', 'nombre_dia']);
        if (!dayValue) {
          const horaInicioId = this.readNumber(periodo, ['id_hora_inicio']);
          const diaId = detallesByJornada.get(horaInicioId);
          if (diaId && diasById.has(diaId)) {
            const diaObj = diasById.get(diaId)!;
            dayValue = this.readString(diaObj, ['dia', 'nombre', 'nombre_dia']);
          }
        }

        if (dayValue) {
          map.set(periodoId, dayValue);
          console.log(`Mapped periodo ${periodoId} → ${dayValue}`);
        }
      }
    } catch (error) {
      console.warn('Error in fetchAndMapPeriodosWithDias:', error);
    }
  }

  private async fetchAndMapDetalleDias(baseUrl: string, map: Map<number, string>): Promise<void> {
    const detalleDiasUrl = `${baseUrl.replace(/\/$/, '')}/detalle-dias`;
    const diasUrl = `${baseUrl.replace(/\/$/, '')}/dias`;

    try {
      const [detalleDiasData, diasData] = await Promise.all([
        fetch(detalleDiasUrl).then((res) => (res.ok ? res.json() : null)),
        fetch(diasUrl).then((res) => (res.ok ? res.json() : null)),
      ]);

      const detalleDias = this.normalizeCollection(detalleDiasData);
      const dias = this.normalizeCollection(diasData);

      const diasById = new Map<number, string>();
      dias.forEach((dia) => {
        const id = this.readNumber(dia, ['id']);
        const nombre = this.readString(dia, ['dia', 'nombre', 'nombre_dia']);
        if (id > 0 && nombre) {
          diasById.set(id, nombre);
        }
      });

      detalleDias.forEach((detalle) => {
        const jornada = this.readNumber(detalle, ['id_jornada_curso']);
        const diaId = this.readNumber(detalle, ['id_dia']);
        if (jornada > 0 && diaId > 0 && diasById.has(diaId)) {
          const dayName = diasById.get(diaId)!;
          map.set(jornada, dayName);
          console.log(`Mapped jornada ${jornada} → ${dayName}`);
        }
      });
    } catch (error) {
      console.warn('Error in fetchAndMapDetalleDias:', error);
    }
  }
}
