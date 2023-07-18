import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { ToWords } from 'to-words';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-vendor-bills',
  templateUrl: './vendor-bills.component.html',
  styleUrls: ['./vendor-bills.component.scss'],
})
export class VendorBillsComponent implements OnInit {
  creditList: any[] = [];
  creditDetails: any;
  bl = new Bl();
  filterForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  toWords = new ToWords();

  constructor(
    private _router: Router,
    private blService: BlService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      INVOICE_NO: [''],
      VENDOR_BILL_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getCreditList();
  }

  Search() {
    var CREDIT_NO = this.filterForm.value.CRO_NO;
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (CREDIT_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.bl.CREDIT_NO = CREDIT_NO;
    this.bl.FROM_DATE = FROM_DATE;
    this.bl.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.getCreditList();
  }

  Clear() {
    this.filterForm.get('CREDIT_NO')?.setValue('');
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.bl.CREDIT_NO = '';
    this.bl.FROM_DATE = '';
    this.bl.TO_DATE = '';

    this.isLoading1 = true;
    this.getCreditList();
  }

  getCreditList() {
    this.bl.AGENT_CODE = this._commonService.getUserCode();
    this.bl.ORG_CODE = this._commonService.getUserOrgCode();
    this.bl.PORT = this._commonService.getUserPort();
    this._commonService.destroyDT();
    this.blService.getCreditNoteList(this.bl).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.creditList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  getCreditDetails(CREDIT_NO: string) {
    this.blService
      .getCreditNoteDetails(
        CREDIT_NO,
        this._commonService.getUserPort(),
        this._commonService.getUserOrgCode()
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.creditDetails = res.Data;
          this.generatePDF();
        }
      });
  }

  async generatePDF() {
    let docDefinition = {
      content: [
        {
          layout: {
            hLineWidth: function (i: any, node: any) {
              if (
                i === 0 ||
                i === node.table.body.length ||
                i === 2 ||
                i === 3 ||
                i === 7 ||
                i === 14
              ) {
                return 1;
              }
              return 0;
            },
            vLineWidth: function (i: any) {
              return i === 1;
            },
            hLineColor: function (i: any) {
              return 'black';
            },
            paddingTop: function (i: any) {
              return 2;
            },
            paddingBottom: function (i: any, node: any) {
              return 2;
            },
            paddingLeft: function (i: any) {
              return 7;
            },
            paddingRight: function (i: any, node: any) {
              return 7;
            },
          },
          table: {
            headerRows: 1,
            widths: [250, 250],
            body: [
              [
                {
                  text: this.creditDetails?.ORG_NAME,
                  bold: true,
                  fontSize: 14,
                  alignment: 'center',
                  colSpan: 2,
                },
                {},
              ],
              [
                {
                  text: this.creditDetails?.ORG_ADDRESS1,
                  bold: false,
                  fontSize: 10,
                  alignment: 'center',
                  colSpan: 2,
                  margin: [0, 0, 0, 70],
                },
                {},
              ],
              [
                {
                  text: 'CREDIT NOTE',
                  bold: true,
                  fontSize: 12,
                  alignment: 'center',
                  colSpan: 2,
                },
                {},
              ],
              [
                {
                  text: this.creditDetails?.BILL_TO?.toUpperCase(),
                  bold: true,
                  fontSize: 8,
                },
                {
                  columns: [
                    {
                      text: 'Credit No',
                      bold: true,
                      fontSize: 8,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 8,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.CREDIT_NO?.toUpperCase(),
                      bold: true,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {
                  text: this.creditDetails?.ADDRESS?.toUpperCase(),
                  bold: false,
                  fontSize: 7,
                },
                {
                  columns: [
                    {
                      text: 'Credit Date',
                      bold: true,
                      fontSize: 8,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 8,
                      width: 10,
                    },
                    {
                      text: this._commonService.getIndianDate(
                        new Date(this.creditDetails?.CREATED_DATE)
                      ),
                      bold: true,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {
                  text: 'GSTN NO : ' + this.creditDetails?.TAX_NO,
                  bold: true,
                  fontSize: 7,
                },
                {
                  columns: [
                    {
                      text: 'Place of Receipt',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.PLACE_OF_RECEIPT,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [{}, {}],
              [
                {
                  columns: [
                    {
                      text: 'Vessel',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.VESSEL_NAME,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: 'Port of Loading',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.PORT_OF_LOADING,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {
                  columns: [
                    {
                      text: 'Voyage No',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.VOYAGE_NO,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: 'Port of Discharge',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.PORT_OF_DISCHARGE,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {
                  columns: [
                    {
                      text: 'B/L No',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.BL_NO,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: 'Place of Delivery',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.PLACE_OF_DELIVERY,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {
                  columns: [
                    {
                      text: 'Invoice No',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.INVOICE_NO,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: 'Shipper',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.SHIPPER_NAME,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {
                  columns: [
                    {
                      text: 'Date of Supply',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: '',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: 'Doc Ref No',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: '',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {
                  columns: [
                    {
                      text: 'Place of Supply',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: '',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: 'GST Tax ID',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: '',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {
                  columns: [
                    {
                      text: 'Principal',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: 'PRIME MARITIME',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {},
              ],
              [
                {
                  colSpan: 2,
                  columns: [
                    {
                      text: 'Remarks',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: '',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {},
              ],
              [
                {
                  colSpan: 2,
                  columns: [
                    {
                      text: 'No. Of Containers',
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text:
                        '20GP X ' +
                        (+this.creditDetails?.CONTAINERS?.split(',').length -
                          1),
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {},
              ],
              [
                {
                  colSpan: 2,
                  columns: [
                    {
                      text: "Container No's",
                      bold: true,
                      fontSize: 9,
                      width: 80,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 9,
                      width: 10,
                    },
                    {
                      text: this.creditDetails?.CONTAINERS,
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {},
              ],
            ],
          },
        },
        {
          text: '',
          margin: [0, 10, 0, 10],
        },
        {
          layout: {
            hLineWidth: function (i: any, node: any) {
              if (i === 0 || i === node.table.body.length) {
                return 1;
              }
              return i === node.table.headerRows
                ? 1
                : i === node.table.body.length - 1
                ? 1
                : 0;
            },
            vLineWidth: function () {
              return 1;
            },
            paddingTop: function (i: any) {
              return i === 1 ? 50 : 7;
            },
            paddingBottom: function (i: any, node: any) {
              return i === node.table.body.length - 2 ? 50 : 7;
            },
            paddingLeft: function () {
              return 7;
            },
            paddingRight: function () {
              return 7;
            },
          },

          table: {
            widths: [55, 15, 40, 20, 25, 25, 30, 20, 30, 20, 30, 35],
            headerRows: 1,
            body: [
              [
                {
                  text: 'Charges',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'HSN',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Qty',
                  fontSize: 9,
                  bold: true,
                },

                {
                  text: 'Curr',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Ex Rate',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Rate',
                  fontSize: 9,
                  bold: true,
                },

                {
                  text: 'Taxable Amount',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Rate %',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'SGST',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Rate %',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'CGST',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Amount in INR',
                  fontSize: 9,
                  bold: true,
                },
              ],
              ...this.creditDetails.CHARGE_LIST.map((p: any) => [
                {
                  text: p.CHARGE_NAME,
                  fontSize: 8,
                },

                {
                  text: p.HSN_CODE,
                  fontSize: 8,
                },
                {
                  text: p.QUANTITY,
                  fontSize: 8,
                },

                {
                  text: p.CURRENCY,
                  fontSize: 8,
                },
                {
                  text: p.EXCHANGE_RATE,
                  fontSize: 8,
                },
                {
                  text: p.APPROVED_RATE,
                  fontSize: 8,
                },

                {
                  text: p.TAXABLE_AMOUNT,
                  fontSize: 8,
                },
                {
                  text: p.RATE_PER,
                  fontSize: 8,
                },
                {
                  text: p.SGST,
                  fontSize: 8,
                },
                {
                  text: p.RATE_PER,
                  fontSize: 8,
                },
                {
                  text: p.CGST,
                  fontSize: 8,
                },
                {
                  text: p.TOTAL_AMOUNT,
                  fontSize: 8,
                },
              ]),
              [
                {
                  colSpan: 8,
                  text:
                    'Total : ' +
                    'INR ' +
                    this.creditDetails.CHARGE_LIST.map(
                      (item: any) => item.TOTAL_AMOUNT
                    ).reduce((a: any, b: any) => a + b) +
                    ' (' +
                    this.toWords.convert(
                      this.creditDetails.CHARGE_LIST.map(
                        (item: any) => item.TOTAL_AMOUNT
                      ).reduce((a: any, b: any) => a + b)
                    ) +
                    ')',
                  fontSize: 8,
                },

                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text: '',
                  fontSize: 9,
                },
                {
                  text: '',
                },
                {
                  text: '',
                  fontSize: 9,
                },
                {
                  text: '',
                },
                {
                  text: '',
                  fontSize: 9,
                },
                {
                  text: '',
                  fontSize: 9,
                },
              ],
            ],
          },
        },
        {
          layout: {
            hLineWidth: function (i: any, node: any) {
              return i === node.table.body.length ? 1 : 0;
            },
            vLineWidth: function (i: any) {
              return i === 1 ? 0 : 1;
            },
          },
          table: {
            headerRows: 1,
            widths: [150, 358],
            body: [
              [
                {
                  text: 'PAN No : ',
                  fontSize: 7,
                  margin: [0, 5, 0, 0],
                },
                {
                  text:
                    'In case of any discrepancy on above invoice amount, please notify ' +
                    'within 5 \ndays. If not this invoice will be presumed to be in order.',
                  fontSize: 7,
                },
              ],
              [
                {
                  text: 'For ' + this.creditDetails.ORG_NAME,
                  fontSize: 8,
                  bold: true,
                },
                {
                  text:
                    'Please make NEFT/RTGS transfer in favour of ' +
                    this.creditDetails.ORG_NAME,
                  fontSize: 7,
                  bold: true,
                  italics: true,
                },
              ],
              [
                {},
                {
                  text:
                    'Account Holder Name: PRIME MARITIME\n' +
                    'Payment in Favour: \n' +
                    'Bank Name: \n' +
                    'Account Number:\n' +
                    'IFSC Code:\n' +
                    'Bank Address:',
                  fontSize: 8,
                },
              ],
              [
                {
                  text: 'As Agents, \n Prime Maritime DWC LLC',
                  bold: true,
                  fontSize: 8,
                },
                {},
              ],
            ],
          },
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
