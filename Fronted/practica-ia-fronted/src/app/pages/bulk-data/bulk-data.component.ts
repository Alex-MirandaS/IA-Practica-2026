import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { AcademicApiService } from '../../core/services/academic-api.service';

@Component({
  selector: 'app-bulk-data',
  templateUrl: './bulk-data.component.html',
  styleUrls: ['./bulk-data.component.css'],
})
export class BulkDataComponent {
  selectedFileName = 'Ningún archivo seleccionado';
  isLoading = false;
  isPopupVisible = false;
  popupSuccess = false;
  popupTitle = '';
  popupMessage = '';
  @ViewChild('datasetFileInput') datasetFileInput?: ElementRef<HTMLInputElement>;
  private selectedFile: File | null = null;

  readonly form = this.fb.group({
    datasetName: ['pensum', Validators.required],
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
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  upload(): void {
    if (!this.form.valid || !this.selectedFile) {
      this.openPopup(false, 'Carga fallida', 'Selecciona un archivo valido antes de enviar.');
      return;
    }

    this.isLoading = true;

    const target = this.form.value.datasetName ?? 'pensum';

    console.info('[BulkData] Intentando conectar con backend...', {
      endpoint: `http://localhost:4001/api/import-csv/${target}`,
      fileName: this.selectedFileName,
      fileType: this.selectedFile.type || 'application/octet-stream',
    });

    this.api.uploadBulkData(target, this.selectedFile).subscribe({
      next: (result) => {
        console.info('[BulkData] Conexion exitosa con backend. Respuesta recibida.', result);
        const isSuccess = result.success ?? true;
        const message = result.message?.trim() || 'La carga de archivo fue exitosa.';

        if (isSuccess) {
          this.openPopup(true, 'Carga exitosa', message);
          this.resetSelectedFile();
        } else {
          this.openPopup(false, 'Carga fallida', message);
        }

        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('[BulkData] Error al conectar con backend.', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          backendPayload: error.error,
        });

        this.openPopup(false, 'Carga fallida', this.getHttpErrorMessage(error));
        this.isLoading = false;
      },
    });
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  private openPopup(success: boolean, title: string, message: string): void {
    this.popupSuccess = success;
    this.popupTitle = title;
    this.popupMessage = message;
    this.isPopupVisible = true;
  }

  private resetSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFileName = 'Ningún archivo seleccionado';

    if (this.datasetFileInput?.nativeElement) {
      this.datasetFileInput.nativeElement.value = '';
    }
  }

  private getHttpErrorMessage(error: HttpErrorResponse): string {
    const backendPayload = error.error as { message?: string | string[] } | string | null;

    if (backendPayload && typeof backendPayload === 'object' && 'message' in backendPayload) {
      const message = backendPayload.message;
      if (Array.isArray(message) && message.length > 0) {
        return message.join(' ');
      }
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }

    if (typeof backendPayload === 'string' && backendPayload.trim()) {
      return backendPayload;
    }

    return 'No fue posible conectar con el backend en http://localhost:4001.';
  }
}
