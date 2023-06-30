import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlService } from 'src/app/services/bl.service';
import { Bl } from 'src/app/models/bl';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import pdfFonts from 'pdfmake/build/vfs_fonts';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-new-invoice2',
  templateUrl: './new-invoice2.component.html',
  styleUrls: ['./new-invoice2.component.scss'],
})
export class NewInvoice2Component implements OnInit {
  blNo: any;
  BLNO: string = '';
  //------------------------------------------//
  invoiceList: any[] = [];
  invoiceDetails: any;
  invoice: Bl = new Bl();
  isLoading: boolean = false;
  isLoading1: boolean = false;
  invoiceForm1: FormGroup;
  invoiceForm: FormGroup;
  chargeList: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _blService: BlService,
    private _commonService: CommonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invoiceForm = this._formBuilder.group({
      radio: [''],
    });

    this.invoiceForm1 = this._formBuilder.group({
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getInvoiceList();
  }

  getInvoiceList() {
    this._commonService.destroyDT();
    this.invoiceList = [];
    this.invoice.ORG_CODE = this._commonService.getUserOrgCode();
    this.invoice.PORT = this._commonService.getUserPort();
    this._blService.getInvoiceListNew(this.invoice).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.invoiceList = res.Data;
      }

      this._commonService.getDT();
    });
  }

  Submit(BLNO: any) {
    var BL = new Bl();
    BL.AGENT_CODE = this._commonService.getUserCode();
    BL.BL_NO = BLNO;
    this._blService.getBLDetails(BL).subscribe((res: any) => {
      this.invoiceForm.get('SHIPPER_NAME')?.setValue(res.Data.SHIPPER);
      this.router.navigateByUrl('/home/operations/invoice-list/' + BLNO);
    });
  }

  getInvoiceDetails(invoiceNo: string) {
    this._blService
      .getInvoiceDetailsNew(
        invoiceNo,
        this._commonService.getUserPort(),
        this._commonService.getUserOrgCode()
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.invoiceDetails = res.Data;
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
                  text: this.invoiceDetails?.ORG_NAME,
                  bold: true,
                  fontSize: 14,
                  alignment: 'center',
                  colSpan: 2,
                },
                {},
              ],
              [
                {
                  text: this.invoiceDetails?.ORG_ADDRESS1,
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
                  text: 'TAX INVOICE',
                  bold: true,
                  fontSize: 12,
                  alignment: 'center',
                  colSpan: 2,
                },
                {},
              ],
              [
                {
                  text: 'RD SHIPPING & LOGISTICS',
                  bold: true,
                  fontSize: 8,
                },
                {
                  columns: [
                    {
                      text: 'Invoice No',
                      bold: true,
                      fontSize: 8,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 8,
                    },
                    {
                      text: '48578577',
                      bold: true,
                      fontSize: 8,
                    },
                  ],
                },
              ],
              [
                {
                  text: '509, 5TH FLOOR, NIRMAL PLAZA, MAKWANA ROAD, MAROL \nNAKA, ANDHERI EAST, MUMBAI, 400059',
                  bold: false,
                  fontSize: 7,
                },
                {
                  columns: [
                    {
                      text: 'Invoice Date',
                      bold: true,
                      fontSize: 8,
                    },
                    {
                      text: ':',
                      bold: true,
                      fontSize: 8,
                    },
                    {
                      text: '48578577',
                      bold: true,
                      fontSize: 8,
                    },
                  ],
                },
              ],
              [
                {
                  text: 'GSTN NO : ' + '767676876876786786',
                  bold: true,
                  fontSize: 7,
                },
                {},
              ],
              [
                {
                  text: 'PAN NO : ' + 'AWYYU7837J',
                  bold: true,
                  fontSize: 7,
                },
                {},
              ],
              [
                {
                  columns: [
                    {
                      text: 'Booking Party',
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
                      text: 'RD Shipping & Logistics Services',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
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
                      text: 'INIXY',
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
                      text: 'Shipper Name',
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
                      text: 'Ankitraj expo Pvt Ltd',
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
                      text: 'INIXY',
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
                      text: 'Vessel/Voyage',
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
                      text: 'Cerus/500',
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
                      text: 'AEJEA',
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
                      text: 'Freight Status',
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
                      text: 'Port of Delivery',
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
                      text: 'AEJEA',
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
                      text: 'BL8687874545458',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: 'Shipper Ref No',
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
                      text: '02 May 2023',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: 'Doc. Ref No',
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
                      text: '45465461',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
              ],
              [
                {},
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
                      text: '27/ Maharashtra',
                      bold: false,
                      fontSize: 8,
                      width: 200,
                    },
                  ],
                },
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
                      text: '50 X 20GP',
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
                      text: 'TGYR7563231, UHYT7654897, UJNH67674567',
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
            widths: [70, 15, 20, 35, 35, 35, 20, 35, 20, 35, 40],
            headerRows: 1,
            body: [
              [
                {
                  text: 'Charges',
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
                  text: 'Chrg Amount',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Amount',
                  fontSize: 9,
                  bold: true,
                },

                {
                  text: 'Tax Amount',
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
              [
                {
                  text: 'CMC',
                  fontSize: 8,
                },

                { text: 56, fontSize: 8 },

                { text: 'INR', fontSize: 8 },
                { text: 56, fontSize: 8 },
                { text: 565 * 5654, fontSize: 8 },

                {
                  text: 45 ? 56 * 56 : 0,
                  fontSize: 8,
                },
                {
                  text: 45 ? 9 : 0,
                  fontSize: 8,
                },
                {
                  text: 565,
                  fontSize: 8,
                },
                {
                  text: 454 ? 9 : 0,
                  fontSize: 8,
                },
                {
                  text: 56,
                  fontSize: 8,
                },
                {
                  text: 56 * 5 + 566 * 2,
                  fontSize: 8,
                },
              ],
              [
                {
                  colSpan: 5,
                  text: 'Total : Seven Thousand and Eight Only',
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
                  text: 4 ? 656 : 0,
                  fontSize: 9,
                },
                {
                  text: '',
                },
                {
                  text: 56,
                  fontSize: 9,
                },
                {
                  text: '',
                },
                {
                  text: 546,
                  fontSize: 9,
                },
                {
                  text: 454 + 5656 * 2,
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
                  text: 'PAN No : SFTDT55687',
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
                  text: 'For ' + this.invoiceDetails.ORG_NAME,
                  fontSize: 8,
                  bold: true,
                },
                {
                  text:
                    'Please make NEFT/RTGS transfer in favour of ' +
                    this.invoiceDetails.ORG_NAME,
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

  CheckBox(event: any) {
    if (event.target.value) {
      localStorage.setItem('value', event.target.value);
    }
  }

  Search() {
    var FROM_DATE = this.invoiceForm1.value.FROM_DATE;
    var TO_DATE = this.invoiceForm1.value.TO_DATE;

    if (FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.invoice.FROM_DATE = FROM_DATE;
    this.invoice.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.getInvoiceList();
  }

  Clear() {
    this.invoiceForm1.get('FROM_DATE')?.setValue('');
    this.invoiceForm1.get('TO_DATE')?.setValue('');

    this.invoice.FROM_DATE = '';
    this.invoice.TO_DATE = '';

    this.isLoading1 = true;
    this.getInvoiceList();
  }
}
