import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-receipt',
  templateUrl: './new-receipt.component.html',
  styleUrls: ['./new-receipt.component.scss'],
})
export class NewReceiptComponent implements OnInit {
  receiptForm: FormGroup;
  receiptDetails: any;
  invoiceNo: any;
  invoiceDetails: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _blService: BlService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.receiptForm = this._formBuilder.group({
      BL_NO: [''],
      INVOICE_NO: [''],
      BANK_LIST: new FormArray([]),
      CHARGE_LIST: new FormArray([]),
    });

    this.invoiceNo = localStorage.getItem('InvoiceNo');
    this.getInvoiceDetails(this.invoiceNo);
  }

  getInvoiceDetails(invoiceNo: string) {
    this._blService
      .getInvoiceDetailsForReceipt(
        invoiceNo,
        this._commonService.getUserPort(),
        this._commonService.getUserOrgCode()
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.invoiceDetails = res.Data;
          const add = this.receiptForm.get('BANK_LIST') as FormArray;
          add.clear();
          res.Data.BANK_LIST.forEach((element: any) => {
            add.push(
              this._formBuilder.group({
                INS_TYPE: [''],
                BANK_NAME: [element.BANK_NAME],
                INS_NO: [''],
                INS_DATE: [''],
                DEPOSIT_DATE: [''],
                INS_AMOUNT: [''],
                BANK_LOCATION: [''],
                ISNEW: [0],
              })
            );
          });

          const add1 = this.receiptForm.get('CHARGE_LIST') as FormArray;
          res.Data.CHARGE_LIST.forEach((elem: any) => {
            add1.push(this._formBuilder.group(elem));
          });
        }
      });
  }

  addBank() {
    const add = this.receiptForm.get('BANK_LIST') as FormArray;

    add.push(
      this._formBuilder.group({
        INS_TYPE: [''],
        BANK_NAME: [''],
        INS_NO: [''],
        INS_DATE: [''],
        DEPOSIT_DATE: [''],
        INS_AMOUNT: [''],
        BANK_LOCATION: [''],
        ISNEW: [1],
      })
    );
  }

  get f1() {
    const add = this.receiptForm.get('BANK_LIST') as FormArray;
    return add.controls;
  }

  get f2() {
    const add = this.receiptForm.get('CHARGE_LIST') as FormArray;
    return add.controls;
  }
}
