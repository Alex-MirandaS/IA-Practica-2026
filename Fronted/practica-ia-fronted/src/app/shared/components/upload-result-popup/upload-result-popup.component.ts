import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-upload-result-popup',
  templateUrl: './upload-result-popup.component.html',
  styleUrls: ['./upload-result-popup.component.css'],
})
export class UploadResultPopupComponent {
  @Input() visible = false;
  @Input() success = false;
  @Input() title = '';
  @Input() message = '';
  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
