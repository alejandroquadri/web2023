import { Injectable } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfService {
  pdfMake: any;

  constructor() {}

  async genPdf(obj: any) {
    return pdfMake.createPdf(obj).open();
  }

  async downloadPdf(obj: any, fileName?: string) {
    fileName = fileName || 'file';
    return pdfMake.createPdf(obj).download(fileName);
  }

  async getPdfMakeObj(obj: any): Promise<any> {
    return pdfMake.createPdf(obj);
  }
}
