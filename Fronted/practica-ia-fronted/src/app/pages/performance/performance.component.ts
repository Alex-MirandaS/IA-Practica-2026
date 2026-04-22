import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AcademicApiService } from '../../core/services/academic-api.service';
import {
  AcademicHistoryAlertApiItem,
  AcademicHistoryItem,
  AcademicHistoryResponse,
  AcademicPerformanceSummary,
} from '../../core/models/academic.models';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css'],
})
export class PerformanceComponent implements OnInit {
  readonly displayedColumns = ['curso', 'codigo', 'nota', 'aprobado', 'anio', 'ciclo', 'intentos'];
  summary: AcademicPerformanceSummary | null = null;
  studentInfo: AcademicHistoryResponse['estudiante'] | null = null;
  historyItems: AcademicHistoryItem[] = [];
  isLoading = false;
  searchAttempted = false;
  errorMessage = '';
  studentCarnetForm = this.fb.group({
    carnet: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private readonly api: AcademicApiService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    // Ready for manual carnet search.
  }

  onSearchByCarnet(): void {
    this.searchAttempted = true;
    this.errorMessage = '';

    if (!this.studentCarnetForm.valid) {
      this.errorMessage = 'Por favor, ingresa un carnet valido.';
      return;
    }

    const carnet = this.studentCarnetForm.get('carnet')?.value?.trim() || '';
    this.isLoading = true;
    this.historyItems = [];
    this.summary = null;

    this.api.getAcademicHistory(carnet).subscribe({
      next: (response) => {
        this.applyHistoryResponse(response);
        this.isLoading = false;
      },
      error: () => {
        this.historyItems = [];
        this.summary = null;
        this.errorMessage = `No se encontro historial para el carnet: ${carnet}`;
        this.isLoading = false;
      },
    });
  }

  private applyHistoryResponse(response: AcademicHistoryResponse): void {
    const historial = Array.isArray(response.historial) ? response.historial : [];
    const resumen = response.resumen;

    this.studentInfo = {
      ...response.estudiante,
      carrera: response.estudiante.carrera || 'No especificada',
    };
    this.historyItems = historial;
    this.summary = {
      promedioGeneral: this.calculateAverage(historial),
      creditosAprobados: resumen.creditos_acumulados,
      creditosEnCurso: 0,
      riesgoRepitencia: resumen.porcentaje_riesgo_repitencia,
      alertas: this.mapAlerts(response.alertas_repitencia),
      detalle: historial.map((item) => ({
        curso: item.curso?.nombre || 'Curso',
        semestre: item.ciclo?.id || 0,
        nota: this.parseGrade(item.nota) || 0,
        estado: item.aprobado ? 'Aprobado' : 'Reprobado',
        creditos: 0,
      })),
    };
  }

  private mapAlerts(alertas: AcademicHistoryAlertApiItem[] | undefined): string[] {
    return (Array.isArray(alertas) ? alertas : [])
      .filter((alert) => alert.alerta)
      .map((alert) => `${alert.nombre} (${alert.codigo}) tiene ${alert.reprobados} reprobaciones.`);
  }

  downloadHistoryCsv(): void {
    if (!this.historyItems.length) {
      return;
    }

    const headers = ['Curso', 'Codigo', 'Nota', 'Estado', 'Anio', 'Ciclo', 'Intentos'];
    const rows = this.historyItems.map((item) => [
      item.curso?.nombre || '',
      item.curso?.codigo || '-',
      item.nota || '',
      item.aprobado ? 'Aprobado' : 'Reprobado',
      String(item.anio ?? ''),
      item.ciclo?.ciclo || '',
      String(item.intentos ?? ''),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_${this.studentInfo?.carnet || 'estudiante'}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  downloadHistoryPdf(): void {
    if (!this.historyItems.length) {
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const studentName = `${this.studentInfo?.nombre || ''} ${this.studentInfo?.apellido || ''}`.trim();
    doc.setFontSize(14);
    doc.text('Historial academico del estudiante', 14, 14);
    doc.setFontSize(10);
    doc.text(`Carnet: ${this.studentInfo?.carnet || '-'}`, 14, 20);
    doc.text(`Nombre: ${studentName || '-'}`, 14, 25);

    autoTable(doc, {
      startY: 30,
      head: [['Curso', 'Codigo', 'Nota', 'Estado', 'Anio', 'Ciclo', 'Intentos']],
      body: this.historyItems.map((item) => [
        item.curso?.nombre || '',
        item.curso?.codigo || '-',
        item.nota || '',
        item.aprobado ? 'Aprobado' : 'Reprobado',
        String(item.anio ?? ''),
        item.ciclo?.ciclo || '',
        String(item.intentos ?? ''),
      ]),
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [25, 118, 210] },
    });

    doc.save(`historial_${this.studentInfo?.carnet || 'estudiante'}.pdf`);
  }

  private calculateAverage(items: AcademicHistoryItem[]): number {
    if (!items.length) {
      return 0;
    }

    const total = items.reduce((acc, item) => acc + (this.parseGrade(item.nota) ?? 0), 0);
    return total / items.length;
  }

  private parseGrade(raw: string): number | null {
    const note = Number(raw);
    return Number.isFinite(note) ? note : null;
  }
}
