import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AcademicApiService } from '../../core/services/academic-api.service';
import { CareerOption, PensumCourse } from '../../core/models/academic.models';

interface SemesterGroup {
  semester: number;
  courses: PensumCourse[];
}

@Component({
  selector: 'app-pensum',
  templateUrl: './pensum.component.html',
  styleUrls: ['./pensum.component.css'],
})
export class PensumComponent implements OnInit {
  careers: CareerOption[] = [];
  selectedCareerId: number | null = null;
  semesterGroups: SemesterGroup[] = [];
  courses: PensumCourse[] = [];
  isLoading = true;
  isLoadingCareers = true;
  errorMessage = '';

  constructor(private readonly api: AcademicApiService) {}

  ngOnInit(): void {
    this.loadCareers();
  }

  onCareerChange(careerId: number | null): void {
    this.selectedCareerId = careerId;
    if (careerId === null) {
      this.courses = [];
      this.semesterGroups = [];
      return;
    }

    this.loadPensum(careerId);
  }

  get selectedCareerName(): string {
    return this.careers.find((career) => career.id === this.selectedCareerId)?.nombre ?? 'Carrera seleccionada';
  }

  private loadCareers(): void {
    this.isLoadingCareers = true;
    this.api.getCareers().subscribe({
      next: (careers) => {
        this.careers = careers;
        this.isLoadingCareers = false;
        this.errorMessage = '';

        if (careers.length > 0) {
          this.onCareerChange(careers[0].id);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.careers = [];
        this.selectedCareerId = null;
        this.errorMessage = 'No fue posible cargar las carreras desde http://localhost:4001/carrera.';
        this.isLoadingCareers = false;
        this.isLoading = false;
      },
    });
  }

  private loadPensum(careerId: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.api.getPensum(careerId).subscribe({
      next: (courses) => {
        const filteredCourses = this.filterCoursesByCareer(Array.isArray(courses) ? courses : [], careerId);

        this.loadPrerequisitesForCourses(filteredCourses).subscribe({
          next: (coursesWithPrerequisites) => {
            this.courses = coursesWithPrerequisites;
            this.semesterGroups = this.buildSemesterGroups(this.courses);
            this.isLoading = false;
          },
          error: () => {
            this.courses = filteredCourses;
            this.semesterGroups = this.buildSemesterGroups(this.courses);
            this.isLoading = false;
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.courses = [];
        this.semesterGroups = [];
        if (error.status !== 404) {
          this.errorMessage = 'No fue posible consultar el pensum en http://localhost:4001.';
        }
        this.isLoading = false;
      },
    });
  }

  private loadPrerequisitesForCourses(courses: PensumCourse[]): Observable<PensumCourse[]> {
    if (!courses.length) {
      return of([]);
    }

    const requests = courses.map((course) => {
      const pensumId = Number(course.id);

      if (!Number.isFinite(pensumId) || pensumId <= 0) {
        return of({
          ...course,
          prerequisitos: course.prerequisitos ?? [],
        });
      }

      return this.api.getPensumPrerequisites(pensumId).pipe(
        map((rows) => {
          const prerequisitos = (Array.isArray(rows) ? rows : [])
            .map((row) => {
              const codigo = String(row.prerrequisito?.codigo ?? '').trim();
              const nombre = String(row.prerrequisito?.nombre ?? '').trim();

              if (codigo && nombre) {
                return `${codigo} - ${nombre}`;
              }

              if (codigo) {
                return codigo;
              }

              return nombre;
            })
            .filter((item) => Boolean(item));

          return {
            ...course,
            prerequisitos,
          };
        }),
        catchError(() =>
          of({
            ...course,
            prerequisitos: course.prerequisitos ?? [],
          }),
        ),
      );
    });

    return forkJoin(requests);
  }

  private filterCoursesByCareer(courses: PensumCourse[], careerId: number): PensumCourse[] {
    const hasCareerField = courses.some(
      (course) =>
        course.idCarrera !== undefined ||
        course.id_carrera !== undefined ||
        course.carreraId !== undefined,
    );

    if (!hasCareerField) {
      return courses;
    }

    return courses.filter((course) => {
      const courseCareerId = course.idCarrera ?? course.id_carrera ?? course.carreraId;
      return Number(courseCareerId) === careerId;
    });
  }

  private buildSemesterGroups(courses: PensumCourse[]): SemesterGroup[] {
    const grouped = new Map<number, PensumCourse[]>();

    for (const course of courses) {
      const semester = Number(course.semestre) || 0;
      if (!grouped.has(semester)) {
        grouped.set(semester, []);
      }
      grouped.get(semester)?.push(course);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([semester, semesterCourses]) => ({
        semester,
        courses: semesterCourses.sort((a, b) => {
          const codeA = String(a.codigo ?? '').trim();
          const codeB = String(b.codigo ?? '').trim();

          if (codeA && codeB) {
            return codeA.localeCompare(codeB);
          }

          if (codeA) {
            return -1;
          }

          if (codeB) {
            return 1;
          }

          return String(a.nombre ?? '').localeCompare(String(b.nombre ?? ''));
        }),
      }));
  }
}
