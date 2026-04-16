import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AcademicApiService } from '../../core/services/academic-api.service';
import { ApiMessage, FileUploadRequest } from '../../core/models/academic.models';

@Component({
  selector: 'app-bulk-data',
  templateUrl: './bulk-data.component.html',
  styleUrls: ['./bulk-data.component.css'],
})
export class BulkDataComponent {
  selectedFileName = 'Ningún archivo seleccionado';
  isLoading = false;
  response: ApiMessage | null = null;
  private payloadBase64 = '';
  private payloadType = '';

  readonly form = this.fb.group({
    datasetName: ['horario-estudiante', Validators.required],
    notes: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: AcademicApiService,
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.selectedFileName = 'Ningún archivo seleccionado';
      this.payloadBase64 = '';
      this.payloadType = '';
      return;
    }

    this.selectedFileName = file.name;
    this.payloadType = file.type || 'application/octet-stream';

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      this.payloadBase64 = typeof result === 'string' ? result.split(',')[1] ?? '' : '';
    };
    reader.readAsDataURL(file);
  }

  upload(): void {
    if (!this.form.valid || !this.payloadBase64) {
      this.response = {
        success: false,
        message: 'Selecciona un archivo válido antes de enviar.',
      };
      return;
    }

    const request: FileUploadRequest = {
      fileName: this.selectedFileName,
      payloadBase64: this.payloadBase64,
      type: this.payloadType,
    };

    this.isLoading = true;
    this.response = null;

    const target = (this.form.value.datasetName ?? 'pensum').trim();

    this.api.uploadBulkData(target, request).subscribe({
      next: (result) => {
        this.response = result;
        this.isLoading = false;
      },
      error: () => {
        this.response = {
          success: false,
          message: 'No fue posible conectar con el backend en http://localhost:4001.',
        };
        this.isLoading = false;
      },
    });
  }
}
