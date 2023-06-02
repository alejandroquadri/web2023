import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { DateFnsService } from 'src/app/shared/services';
import { Base64Imgs } from '../constants/base64Imgs';

@Injectable({
  providedIn: 'root',
})
export class QuotePdfService {
  logoBase64 = Base64Imgs.quadri;

  constructor(private fns: DateFnsService, private numberPipe: DecimalPipe) {}

  genPspPdfObject(data: any) {
    // console.log(data);

    const articles = this.buildPspArtArray(data.items);

    const dd = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 150, 40, 120],
      styles: {
        header: {
          fontSize: 9,
        },
        tableArt: {
          margin: [0, 5, 0, 5],
          fontSize: 10,
        },
        tableArtHeading: {
          fillColor: '#eeeeee',
          alignment: 'center',
          margin: [0, 5, 0, 5],
        },
        footerCae: {
          margin: [5, 20, 0, 0],
          fontSize: 9,
        },
      },
      header: [
        {
          margin: [40, 20, 40, 0],
          table: {
            widths: ['*', 50, '*'],
            body: [
              [
                {
                  image: this.logoBase64,
                  width: 150,
                  border: [false, false, false, true],
                },
                {
                  border: [false, false, false, true],
                  table: {
                    body: [
                      [
                        {
                          text: ``,
                          border: [false, false, false, false],
                          margin: [5, 5, 5, 5],
                          alignment: 'center',
                          // fillColor: '#eeeeee',
                          fontSize: 20,
                        },
                      ],
                    ],
                  },
                  margin: [8, 10, 5, 5],
                },
                {
                  margin: [40, 0, 0, 10],
                  border: [false, false, false, true],
                  style: 'header',
                  text: [
                    { text: `Presupuesto `, fontSize: 15 },
                    { text: `${data.number}\n`, fontSize: 15 },
                    {
                      text: '\nEugenio P. Quadri y CIA SACIFIA\nGascon 483, CABA',
                      fontSize: 12,
                    },
                    { text: '\nwwww.quadri.com.ar', fontSize: 12 },
                    { text: '\ninfo@quadri.com.ar', fontSize: 12 },
                    { text: '\n@quadribsas', fontSize: 12 },
                  ],
                },
              ],
            ],
          },
        },
      ],
      content: [
        {
          text: `Cliente:  ${data.name}`,
          margin: [0, 10, 0, 4],
          fontSize: 12,
        },
        {
          text: `Condicion de venta:  ${data.payment}`,
          margin: [0, 0, 0, 4],
          fontSize: 12,
        },
        {
          // text: `Fecha emision:  ${moment(data.date).format('DD/MM/YYYY')}`,
          text: `Fecha emision:  ${this.fns.getFormatedDate(
            new Date(data.date),
            'dd/MM/yyyy'
          )}`,
          margin: [0, 0, 0, 4],
          fontSize: 12,
        },
        {
          // text: `Valido hasta:  ${moment(data.date).add(7, 'd').format('DD/MM/YYYY')}`,
          text: `Valido hasta:  ${this.fns.getFormatedDate(
            new Date(data.date),
            'dd/MM/yyyy'
          )}`,
          margin: [0, 0, 0, 20],
          fontSize: 12,
        },
        {
          style: 'tableArt',
          table: {
            widths: ['*', 45, 35, 37, 45, 30, 50, 50],
            body: articles,
          },
        },
      ],
      footer: [
        {
          margin: [40, 0, 40, 5],
          table: {
            widths: ['*', 150, 80],
            body: [
              [
                { text: '', border: [false, true, false, false] },
                {
                  table: {
                    widths: ['*'],
                    border: [false, false, false, false],
                    body: [
                      [
                        {
                          text: 'Neto',
                          border: [false, false, false, false],
                        },
                      ],
                      [
                        {
                          text: 'IVA',
                          border: [false, false, false, false],
                        },
                      ],
                      [
                        {
                          text: 'P. IIBB',
                          border: [false, false, false, false],
                        },
                      ],
                      [
                        {
                          text: 'Total',
                          border: [false, false, false, false],
                        },
                      ],
                    ],
                  },
                  alignment: 'right',
                  border: [false, true, false, false],
                  margin: [0, 5, 0, 5],
                },
                {
                  table: {
                    widths: ['*'],
                    border: [false, false, false, false],
                    body: [
                      [
                        {
                          text: `${this.numberPipe.transform(
                            data.subtotal,
                            '1.0-1'
                          )}`,
                          border: [false, false, false, false],
                        },
                      ],
                      [
                        {
                          text: `${this.numberPipe.transform(
                            data.iva,
                            '1.0-1'
                          )}`,
                          border: [false, false, false, false],
                        },
                      ],
                      [
                        {
                          text: `${this.numberPipe.transform(
                            data.iibb,
                            '1.0-1'
                          )}`,
                          border: [false, false, false, false],
                        },
                      ],
                      [
                        {
                          text: `${this.numberPipe.transform(
                            data.total,
                            '1.0-1'
                          )}`,
                          border: [false, false, false, false],
                        },
                      ],
                    ],
                  },
                  alignment: 'right',
                  border: [false, true, false, false],
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
      ],
    };

    return dd;
  }

  buildPspArtArray(data: Array<any>) {
    const arrayArt = [
      [
        {
          text: 'Descripcion',
          style: 'tableArtHeading',
          border: [false, false, false, false],
        },
        {
          text: 'Cantidad',
          style: 'tableArtHeading',
          border: [false, false, false, false],
        },
        {
          text: 'Unidad',
          style: 'tableArtHeading',
          border: [false, false, false, false],
        },
        {
          text: 'Moneda',
          style: 'tableArtHeading',
          border: [false, false, false, false],
        },
        {
          text: 'Precio',
          style: 'tableArtHeading',
          border: [false, false, false, false],
        },
        {
          text: 'Dto %',
          style: 'tableArtHeading',
          border: [false, false, false, false],
        },
        {
          text: 'Precio F',
          style: 'tableArtHeading',
          border: [false, false, false, false],
        },
        {
          text: 'Total',
          style: 'tableArtHeading',
          border: [false, false, false, false],
        },
      ],
    ];

    data.forEach(art => {
      let item = [
        {
          text: art.description,
          style: 'tableArt',
          border: [false, false, false, false],
        },
        {
          text: this.numberPipe.transform(art.quantity, '1.0-2'),
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'center',
        },
        {
          text: art.unit,
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'center',
        },
        {
          text: art.currency || 'Pesos',
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'center',
        },
        {
          text: this.numberPipe.transform(art.price, '1.1-1'),
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'center',
        },
        {
          text: art.discount,
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'center',
        },
        {
          text: this.numberPipe.transform(art.finalPrice, '1.1-1'),
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'center',
        },
        {
          text: this.numberPipe.transform(art.total, '1.1-1'),
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'right',
        },
      ];
      arrayArt.push(item);
    });

    return arrayArt;
  }
}
