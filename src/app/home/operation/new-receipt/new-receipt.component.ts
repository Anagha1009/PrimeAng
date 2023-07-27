import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-new-receipt',
  templateUrl: './new-receipt.component.html',
  styleUrls: ['./new-receipt.component.scss'],
})
export class NewReceiptComponent implements OnInit {
  receiptForm: FormGroup;
  receiptDetails: any;
  invoiceNo: string = '';
  invoiceNoList: string = '';
  invoiceReceiptList: any;
  bankList: any[] = [];
  invListDDL: any[] = [];
  hideme: [];
  subtableIndex: any = -1;

  constructor(
    private _formBuilder: FormBuilder,
    private _blService: BlService,
    private _commonService: CommonService,
    private _receiptService: ReceiptService
  ) {}

  ngOnInit(): void {
    this.receiptForm = this._formBuilder.group({
      INVOICE_PARTY: [''],
      RECEIVED_FROM: [''],
      DEPOSIT_CASH_BANK: [''],
      RECEIPT_REMARKS: [''],
      INVOICE_LIST: new FormArray([]),
      BANK_LIST: new FormArray([]),
      CHARGE_LIST: new FormArray([]),
    });

    this.invoiceNo = localStorage.getItem('InvoiceNo');
    this.invListDDL = JSON.parse(localStorage.getItem('InvoiceNoList'));

    this.invListDDL.forEach((element: any) => {
      this.invoiceNoList += element + ',';
    });

    this.getInvoiceDetails(
      this.invoiceNo == '' ? this.invoiceNoList : this.invoiceNo
    );
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
          const invList = this.receiptForm.get('INVOICE_LIST') as FormArray;
          invList.clear();
          res.Data.INVOICE_LIST.forEach((element: any) => {
            invList.push(this._formBuilder.group(element));
          });

          this.receiptForm
            .get('INVOICE_PARTY')
            .setValue(
              res.Data.INVOICE_LIST[0].SHIPPER == ''
                ? res.Data.INVOICE_LIST[0].CONSIGNEE
                : res.Data.INVOICE_LIST[0].SHIPPER
            );

          this.receiptForm
            .get('RECEIVED_FROM')
            .setValue(res.Data.INVOICE_LIST[0].BILL_FROM.split('|')[0]);

          const add = this.receiptForm.get('BANK_LIST') as FormArray;
          add.clear();
          add.push(
            this._formBuilder.group({
              INS_TYPE: [''],
              BANK_NAME: [''],
              INS_NO: [''],
              INS_DATE: [''],
              DEPOSIT_DATE: [''],
              INS_AMOUNT: [''],
              BANK_LOCATION: [''],
              ISNEW: [0],
            })
          );

          this.bankList = res.Data.BANK_LIST;

          const add1 = this.receiptForm.get('CHARGE_LIST') as FormArray;
          add1.clear();
          res.Data.CHARGE_LIST.forEach((elem: any) => {
            add1.push(this._formBuilder.group(elem));
          });
        }
      });
  }

  getChargeList(index: any) {
    this.subtableIndex = this.subtableIndex == -1 ? index : -1;
  }

  insertReceipt() {
    const add = this.receiptForm.get('INVOICE_LIST') as FormArray;

    var receiptNo = this._commonService.getRandomNumber('RC');
    var agentCode = this._commonService.getUserCode();
    var agentName = this._commonService.getUserName();

    add.controls.forEach((element) => {
      element
        .get('RECEIVED_FROM')
        .setValue(this.receiptForm.get('RECEIVED_FROM').value);

      element
        .get('DEPOSIT_CASH_BANK')
        .setValue(this.receiptForm.get('DEPOSIT_CASH_BANK').value);

      element
        .get('RECEIPT_REMARKS')
        .setValue(this.receiptForm.get('RECEIPT_REMARKS').value);

      element.get('RECEIPT_NO').setValue(receiptNo);

      element.get('AGENT_NAME').setValue(agentName);
      element.get('AGENT_CODE').setValue(agentCode);
    });

    console.log(JSON.stringify(this.receiptForm.value));

    this._receiptService
      .InsertReceipt(this.receiptForm.value)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Receipt created successfully !<br> Receipt No is : ' + receiptNo
          );
        }
      });
  }

  get f() {
    const add = this.receiptForm.get('INVOICE_LIST') as FormArray;
    return add.controls;
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
