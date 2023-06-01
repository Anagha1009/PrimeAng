import { Component, OnInit } from '@angular/core';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { locale as english } from 'src/app/@core/translate/er/en';
import { locale as hindi } from 'src/app/@core/translate/er/hi';
import { locale as arabic } from 'src/app/@core/translate/er/ar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErService } from 'src/app/services/er.service';
import { CommonService } from 'src/app/services/common.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-er-list2',
  templateUrl: './er-list2.component.html',
  styleUrls: ['./er-list2.component.scss'],
})
export class ErList2Component implements OnInit {
  filterForm: FormGroup;
  erList: any[] = [];
  erDetails: any;
  erContDetails: any[] = [];
  isScroll: boolean = false;

  constructor(
    private _erService: ErService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      REPO_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getERList();
  }

  Search() {
    var REPO_NO = this.filterForm.value.REPO_NO;
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (REPO_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.getERList();
  }

  Clear() {
    this.filterForm.get('REPO_NO')?.setValue('');
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.getERList();
  }

  getERList() {
    this._erService
      .getERList(this._commonService.getUserCode(), '')
      .subscribe((res: any) => {
        this.erList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.erList = res.Data;
            if (this.erList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
        }
      });
  }

  getERCRODetails(ERNO: any) {
    this._erService.getERDetails(ERNO, '', '').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.erDetails = res.Data;
        this._erService
          .getERContainerDetails(ERNO, '', '')
          .subscribe((res1: any) => {
            if (res.ResponseCode == 200) {
              this.erContDetails = res1.Data;
              this.generatePDF();
            }
          });
      }
    });
  }

  async generatePDF() {
    let docDefinition = {
      content: [
        {
          layout: 'noBorders',
          table: {
            widths: [70, 350, 60],
            headerRows: 1,
            body: [
              [
                { text: ' ', fontSize: 8, bold: true },
                {
                  text: this.erDetails?.ORG_NAME,
                  bold: true,
                  fontSize: 14,
                  alignment: 'center',
                },
                {
                  image: await this._commonService.getBase64ImageFromURL(
                    'assets/img/logo_p.png'
                  ),
                  height: 40,
                  width: 100,
                  margin: [0, 0, 0, 0],
                },
              ],

              [
                {},
                {
                  text: this.erDetails?.ORG_ADDRESS1,
                  bold: false,
                  fontSize: 10,
                  alignment: 'center',
                },
                {},
              ],
            ],
          },
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          columns: [
            [],
            [
              {
                text: 'Container Release Order',
                bold: false,
                fontSize: 12,
                alignment: 'center',
              },
            ],
            [
              {
                text: `Date: ${this._commonService.getIndianDate(
                  new Date(this.erDetails?.CREATED_DATE)
                )}`,
                bold: true,
                alignment: 'right',
              },
              {
                text: `${this.erDetails?.CRO_NO}`,
                alignment: 'right',
                color: '#17a2b8',
              },
            ],
          ],
        },
        {
          text: 'Pickup Location:',
          bold: true,
          fontSize: 11,
          margin: [0, 10, 0, 0],
        },
        {
          text: this.erDetails?.EMPTY_CONT_PCKP,
          fontSize: 10,
        },
        {
          text: 'Booking Details',
          style: 'sectionHeader',
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: [100, 200, 100, 200],
            body: [
              [
                {
                  text: 'Booking No:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.BOOKING_NO == null
                      ? '-'
                      : this.erDetails?.BOOKING_NO == ''
                      ? '-'
                      : this.erDetails?.BOOKING_NO,
                  fontSize: 10,
                },
                {
                  text: 'Booking Date:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: this._commonService.getIndianDate(
                    new Date(this.erDetails?.BookingDetails?.CREATED_DATE)
                  ),
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Location:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.LADEN_ACPT_LOCATION == null
                      ? '-'
                      : this.erDetails?.LADEN_ACPT_LOCATION == ''
                      ? '-'
                      : this.erDetails?.LADEN_ACPT_LOCATION,
                  fontSize: 10,
                },
                {
                  text: 'Vessel/ Voyage:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.BookingDetails?.VESSEL_NAME +
                    '/ ' +
                    this.erDetails?.BookingDetails?.VOYAGE_NO,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Booking Party:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.CUSTOMER_NAME == null
                      ? '-'
                      : this.erDetails?.CUSTOMER_NAME == ''
                      ? '-'
                      : this.erDetails?.CUSTOMER_NAME,
                  fontSize: 10,
                },
                {
                  text: 'ETA:',
                  bold: true,
                  fontSize: 10,
                },

                {
                  text: this._commonService.getIndianDate(
                    new Date(this.erDetails?.ETA)
                  ),
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Email Id:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.EMAIL == null
                      ? '-'
                      : this.erDetails?.EMAIL == ''
                      ? '-'
                      : this.erDetails?.EMAIL,
                  fontsize: 10,
                },
                {
                  text: 'ETD:',
                  bold: true,
                  fontSize: 10,
                },

                {
                  text: this._commonService.getIndianDate(
                    new Date(this.erDetails?.ETD)
                  ),
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Contact No:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.CONTACT == null
                      ? '-'
                      : this.erDetails?.CONTACT == ''
                      ? '-'
                      : this.erDetails?.CONTACT,
                  fontSize: 10,
                },
                {
                  text: 'Service:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.SERVICE_NAME == null
                      ? '-'
                      : this.erDetails?.SERVICE_NAME == ''
                      ? '-'
                      : this.erDetails?.SERVICE_NAME,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Valid Upto:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: this._commonService.getIndianDate(
                    new Date(this.erDetails?.CRO_VALIDITY_DATE)
                  ),
                  fontSize: 10,
                },
                {
                  text: 'POL:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.POL == null
                      ? '-'
                      : this.erDetails?.POL == ''
                      ? '-'
                      : this.erDetails?.POL,
                  fontSize: 10,
                },
              ],
              [
                {},
                {},
                {
                  text: 'POD:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.POD == null
                      ? '-'
                      : this.erDetails?.POD == ''
                      ? '-'
                      : this.erDetails?.POD,
                  fontSize: 10,
                },
              ],
              [
                {},
                {},
                {
                  text: 'FPOD:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.FINAL_DESTINATION == null
                      ? '-'
                      : this.erDetails?.FINAL_DESTINATION == ''
                      ? '-'
                      : this.erDetails?.FINAL_DESTINATION,
                  fontSize: 10,
                },
              ],
            ],
          },
        },
        {
          text: 'Container Details',
          style: 'sectionHeader',
        },
        {
          text: this.erDetails?.COMMODITY,
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },
        {
          // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [
              ['Container Type', 'Quantity', 'Service Mode'],
              ...this.erContDetails.map((p: any) => [
                {
                  text: p.CONTAINER_TYPE,
                  fontSize: 10,
                },
                { text: this.erDetails?.REQ_QUANTITY, fontSize: 10 },
                { text: p.SERVICE_MODE, fontSize: 10 },
              ]),
            ],
          },
        },
        {
          margin: [0, 10, 0, 0],
          fontSize: 9,
          text:
            'Remarks:\n\n1) PLEASE DO NOT PICK UP DAMAGE CONTAINER, ANY CLAIM FROM DESTINATION WILL BE COLLECTED FROM CONSIGNEE' +
            '\n2) All containers mis-declared for weight will be charged in line with the scale of rates for misdeclaration.' +
            'This charge will be applied with immediate effect. In order to avoid this charge, please advise all concerned to ensure declaration of correct weight at the time of booking.' +
            '\n3) LINE WILL NOT BE RESPONSIBLE FOR EARLY CLOSURE OF GATE / NOT OPENING OF GATE FOR A PARTICULAR TERMINAL / VESSEL' +
            '\n4) Containers will not be loaded without duplicate shipping bill in our custody' +
            "\n5) Please gate-in the containers at most 3 days before vessel ETA. Containers gated-in earlier shall incur ground rent which will be On shipper's account" +
            '\n\nGeneral Instructions' +
            '\n\nTHIS D.O IS VALID FOR FOUR (4) DAYS FROM TODAY I.E. ( ' +
            this._commonService.getIndianDate(
              new Date(this.erDetails?.CREATED_DATE)
            ) +
            ' ) NO DELIVERIES WILL BE ALLOWED FROM THE ' +
            'STORAGE YARD : ' +
            this.erDetails?.EMPTY_CONT_PCKP +
            '\nPLEASE NOTE THAT YOU ARE NOT PERMITTED TO HONOUR THIS D.O. AFTER - ' +
            this._commonService.getIndianDate(
              new Date(this.erDetails?.CRO_VALIDITY_DATE)
            ) +
            '\n\n1. Export Detention on containers will be applicable as per lines prevailing tariff.' +
            '\n2. Please do not exceed the permitted maximum gross weight shown on the container.' +
            '\n3. Containers that are picked up from empty yard at origin by the Exporter or their Agents per the Booking release order shall be' +
            'resumed to have been inspected and accepted in good and sound condition for the purpose of cargo stuffing. Consignee (Buyers)' +
            'shall be responsible to return the containers to our custody in good and sound condition at destination after cargo is unstuffed.' +
            '\n4.  Containers are moved by Export/C & F agents at their own risk/cost. Any damage to the container shall be borne by Exporter/C & F agent.' +
            "\n5. C & F agent/Exporters are requested to prepare container load plan and put Co.'s Stamp / Sign." +
            '\n6. In case of hazardous cargo, please apply hazardous cargo sticker & put all details.',
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
