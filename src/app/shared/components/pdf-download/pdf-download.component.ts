import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-download',
  templateUrl: './pdf-download.component.html',
  styleUrls: ['./pdf-download.component.scss'],
})
export class PdfDownloadComponent {
  @Input() files: {
    fileName: { es: string; en: string };
    url: { es: string; en: string };
  }[] = [];
  @Input() lang: string;
}
