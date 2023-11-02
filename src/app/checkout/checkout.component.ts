import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { CartItem, MPitem, Query, Quote } from 'src/app/shared/interfaces';

import {
  CkApiService,
  EcomService,
  GtmService,
  LanguageService,
  PdfService,
  QuotePdfService,
  QuoterService,
} from 'src/app/shared/services';
import { firstValueFrom } from 'rxjs';
import { CheckoutCopy } from 'src/app/shared/copy';
import { MpService } from '../shared/services/mp.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  contactForm: FormGroup;
  lang: string;
  spinner = false;

  copy = CheckoutCopy;

  constructor(
    private fb: FormBuilder,
    private langSc: LanguageService,
    public ecomSc: EcomService,
    private router: Router,
    private quoterSc: QuoterService,
    private quotePdf: QuotePdfService,
    private pdfSc: PdfService,
    private ckSc: CkApiService,
    private mpSc: MpService,
    public dialog: MatDialog,
    public gtmSc: GtmService
  ) {}

  ngOnInit(): void {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.buildContactForm();
  }

  get cart() {
    return this.ecomSc.cart as CartItem[];
  }

  buildContactForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
    // this.contactForm.patchValue({
    //   name: 'Ale Q',
    //   email: 'ale@quadri.com.ar',
    //   phone: '1151612850',
    // });
  }

  submit() {
    if (this.ecomSc.carrySamples) {
      if (!this.ecomSc.isEcom) {
        this.mpCheckout();
      } else {
        this.strippedCheckout();
      }
    } else {
      this.sendQuote();
      this.gtmSc.gtmClick('quote');
    }
  }

  mpCheckout() {
    const items: Array<MPitem> = [];
    this.cart.forEach(item => {
      const mpItem: MPitem = {
        title: item.product.descripcion,
        quantity: item.quantity,
        unit_price: item.product.precioActual,
        id: item.product.codigo,
        picture_url: item.imageUrl,
      };
      items.push(mpItem);
    });
    firstValueFrom(this.mpSc.buyItem(items, true)).then((res: any) => {
      console.log(res);
      window.open(res.all.init_point, '_blank');
      // window.open(res.sandbox_init_point, '_blank');
    });
  }

  strippedCheckout() {
    // todo
  }

  async sendQuote() {
    this.spinner = true;
    const quote = await this.saveQuote().catch(err => {
      console.log(err);
    });

    this.spinner = false;
    this.openDialog(quote);
    this.ecomSc.emptyCart();
  }

  async saveQuote(): Promise<Quote> {
    // await this.mockTimeout();
    // const num = 1111;

    this.suscribeToCloseSeq();
    const num = await this.quoterSc.getQuoteNum();
    const quoteObj: Quote = this.quoterSc.buildQuoteForm(
      this.cart,
      this.contactForm.value,
      num
    );
    const blob: any = await this.getPdfBlob(quoteObj);
    const att = await this.pspToBase64(blob, quoteObj.number).catch(err =>
      console.log(err)
    );
    quoteObj.base64Pdf = att;
    const queryObj: Query = this.quoterSc.buildQueryObj(
      this.contactForm.value,
      quoteObj.number
    );
    await this.quoterSc.save(quoteObj, queryObj);
    return quoteObj;
  }

  suscribeToCloseSeq() {
    const email = this.contactForm.value.email;
    const name = this.contactForm.value.name.split(' ')[0];
    firstValueFrom(this.ckSc.addToQuoteForm(email, name)).then(_ =>
      console.log('suscripto')
    );
  }

  mockTimeout(): Promise<any> {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(true);
      }, 1000);
    });
  }

  getName(fullName) {
    return fullName?.replace(/ .*/, '');
  }

  openDialog(quote) {
    const dialogRef = this.dialog.open(SentNoticeComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/']);
      this.printPdf(quote);
    });
  }

  printPdf(quote) {
    const pdfObj = this.quotePdf.genPspPdfObject(quote);
    this.pdfSc.genPdf(pdfObj);
  }

  getPdfBlob(quote) {
    const pdfObj = this.quotePdf.genPspPdfObject(quote);
    return this.pdfSc.getPdfMakeObj(pdfObj);
  }

  pspToBase64(psp, num) {
    return new Promise((resolve, reject) => {
      try {
        psp.getBase64(data => {
          const att = {
            // encoded string as an attachment
            filename: `Quadri_PSP_${num}.pdf`,
            content: data,
            encoding: 'base64',
          };
          resolve(att);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

@Component({
  selector: 'app-sent-notice',
  templateUrl: 'sent-notice.html',
  styleUrls: ['./checkout.component.scss'],
})
export class SentNoticeComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CheckoutComponent) {}
}
