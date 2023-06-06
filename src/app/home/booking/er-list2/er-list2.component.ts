import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { locale as english } from 'src/app/@core/translate/er/en';
import { locale as hindi } from 'src/app/@core/translate/er/hi';
import { locale as arabic } from 'src/app/@core/translate/er/ar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErService } from 'src/app/services/er.service';
import { CommonService } from 'src/app/services/common.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ER } from 'src/app/models/er';
import { CroService } from 'src/app/services/cro.service';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-er-list2',
  templateUrl: './er-list2.component.html',
  styleUrls: ['./er-list2.component.scss'],
})
export class ErList2Component implements OnInit {
  filterForm: FormGroup;
  erCROForm: FormGroup;
  erList: any[] = [];
  erDetails: any;
  erContDetails: any[] = [];
  isScroll: boolean = false;
  submitted1: boolean = false;
  icdList: any;
  cfsList: any;
  depoList: any;

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _erService: ErService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _croService: CroService,
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

    this.erCROForm = this._formBuilder.group({
      CRO_NO: [''],
      REPO_NO: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      CRO_VALIDITY_DATE: ['', Validators.required],
      REQ_QUANTITY: ['', Validators.required],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      CREATED_BY: [''],
    });

    this.getERList();
    this.getDropdown();
  }

  getDropdown() {
    this._commonService.getDropdownData('ICD').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.icdList = res.Data;
      }
    });

    this._commonService.getDropdownData('CFS').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.cfsList = res.Data;
      }
    });

    this._commonService.getDropdownData('DEPO').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.depoList = res.Data;
      }
    });
  }

  openCROModal(erNo: any) {
    this.ClearForm();
    this.erCROForm.get('REPO_NO').setValue(erNo);
    this.openBtn.nativeElement.click();
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
    var er = new ER();
    er.AGENT_CODE = this._commonService.getUserCode();
    er.ORG_CODE = this._commonService.getUserOrgCode();
    er.PORT = this._commonService.getUserPort();
    this._erService.getERList(er).subscribe((res: any) => {
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
    this._erService
      .getERDetails(
        ERNO,
        this._commonService.getUserOrgCode(),
        this._commonService.getUserPort()
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          debugger;
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
                  text: 'Repo No:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.REPO_NO == null
                      ? '-'
                      : this.erDetails?.REPO_NO == ''
                      ? '-'
                      : this.erDetails?.REPO_NO,
                  fontSize: 10,
                },
                {
                  text: 'Repo Date:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: this._commonService.getIndianDate(
                    new Date(this.erDetails?.CREATED_DATE)
                  ),
                  fontSize: 10,
                },
              ],
              [
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
                {
                  text: 'Vessel/ Voyage:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.VESSEL_NAME +
                    '/ ' +
                    this.erDetails?.VOYAGE_NO,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'POL:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.LOAD_PORT == null
                      ? '-'
                      : this.erDetails?.LOAD_PORT == ''
                      ? '-'
                      : this.erDetails?.LOAD_PORT,
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
                  text: 'POD:',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text:
                    this.erDetails?.DISCHARGE_PORT == null
                      ? '-'
                      : this.erDetails?.DISCHARGE_PORT == ''
                      ? '-'
                      : this.erDetails?.DISCHARGE_PORT,
                  fontSize: 10,
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
                {},
                {},
              ],
            ],
          },
        },
        {
          text: 'Container Details',
          style: 'sectionHeader',
        },
        {
          text: 'Empty Containers',
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },
        {
          // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [
              ['Container Type', 'Quantity'],
              [
                {
                  text: '20GP',
                  fontSize: 10,
                },
                { text: this.erDetails?.REQ_QUANTITY, fontSize: 10 },
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

  get f1() {
    return this.erCROForm.controls;
  }

  ClearForm() {
    this.erCROForm.reset();
    this.erCROForm.get('EMPTY_CONT_PCKP').setValue('');
  }

  SaveCRO() {
    this.submitted1 = true;
    if (this.erCROForm.invalid) {
      return;
    }

    var croNo = this._commonService.getRandomNumber('CRO');
    this.erCROForm.get('CRO_NO')?.setValue(croNo);
    this.erCROForm
      .get('AGENT_NAME')
      ?.setValue(this._commonService.getUserName());
    this.erCROForm
      .get('AGENT_CODE')
      ?.setValue(this._commonService.getUserCode());
    this.erCROForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    this._erService
      .getERDetails(this.erCROForm.get('REPO_NO')?.value, '', '')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.erDetails = res.Data;
          if (
            +this.erCROForm.get('REQ_QUANTITY')?.value ==
            this.erDetails.NO_OF_CONTAINER
          ) {
            this._croService
              .insertCRO(JSON.stringify(this.erCROForm.value))
              .subscribe((res: any) => {
                if (res.responseCode == 200) {
                  this._commonService.successMsg(
                    'CRO created successfully! Your CRO No. is ' + croNo
                  );
                }
                this.closeBtn.nativeElement.click();
                this.getERList();
                this.ClearForm();
              });
          } else {
            this._commonService.errorMsg(
              'Required Quantity should be equal to the number of containers since you can create only one CRO for a specific Container Repositioning!'
            );
          }
        }
        if (res.ResponseCode == 500) {
          alert('Invalid Repo No.');
        }
      });
  }
}
