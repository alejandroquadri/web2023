import { Injectable } from '@angular/core';

// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfService {
  pdfMake: any;

  constructor() {}

  loadPdf() {
    const pdfMakeModule = require('pdfmake/build/pdfmake');
    const pdfFonts = require('pdfmake/build/vfs_fonts');
    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    return pdfMake;
  }

  async genPdf(obj: any) {
    const pdfMake = await this.loadPdf();
    return pdfMake.createPdf(obj).open();
  }

  async downloadPdf(obj: any, fileName?: string) {
    fileName = fileName || 'file';
    const pdfMake = await this.loadPdf();
    return pdfMake.createPdf(obj).download(fileName);
  }

  async getPdfMakeObj(obj: any): Promise<any> {
    const pdfMake = await this.loadPdf();
    return pdfMake.createPdf(obj);
  }
}
