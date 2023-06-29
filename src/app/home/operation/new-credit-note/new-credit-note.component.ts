import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-credit-note',
  templateUrl: './new-credit-note.component.html',
  styleUrls: ['./new-credit-note.component.scss'],
})
export class NewCreditNoteComponent implements OnInit {
  blList: any[] = [];
  creditForm: FormGroup;
  invoiceList: any[] = [];
  invoiceDetails: any;

  constructor(
    private _commonService: CommonService,
    private _blService: BlService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getBLList();

    this.creditForm = this._formBuilder.group({
      BL_NO: [''],
      INVOICE_NO: [''],
    });

    this._commonService.getDT();
  }

  getBLList() {
    var bl: Bl = new Bl();
    bl.ORG_CODE = this._commonService.getUserOrgCode();
    bl.PORT = this._commonService.getUserPort();

    this._blService.getBLHistory(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.blList = res.Data;
      }
    });
  }

  getInvoiceList(blNo: string) {
    this.invoiceList = [];
    this.creditForm.get('INVOICE_NO').setValue('');
    this.invoiceDetails = null;
    this._commonService.destroyDT();
    this._commonService.getDT();
    var bl: Bl = new Bl();
    bl.ORG_CODE = this._commonService.getUserOrgCode();
    bl.PORT = this._commonService.getUserPort();
    bl.BL_NO = blNo;

    this._blService.getInvoiceListNew(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.invoiceList = res.Data;
      }
    });
  }

  getInvoiceDetails(invoiceNo: string) {
    this.invoiceDetails = null;
    this._commonService.destroyDT();
    this._blService
      .getInvoiceDetailsNew(
        invoiceNo,
        this._commonService.getUserPort(),
        this._commonService.getUserOrgCode()
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.invoiceDetails = res.Data;
        }
        this._commonService.getDT();
      });
  }
}
