import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { createHash } from 'crypto';
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
  creditNote: FormGroup;

  constructor(
    private _commonService: CommonService,
    private _blService: BlService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getBLList();

    this.creditForm = this._formBuilder.group({
      BL_NO: [''],
      INVOICE_NO: [''],
    });

    this.creditNote = this._formBuilder.group({
      CREDIT_NOTES: new FormArray([]),
      CREDIT_NOTES1: new FormArray([]),
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

  getInvoiceDetails(invoiceID: number) {
    this.invoiceDetails = null;
    this._commonService.destroyDT();
    this._blService
      .getInvoiceDetailsNew(
        invoiceID,
        '',
        this._commonService.getUserPort(),
        this._commonService.getUserOrgCode()
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.invoiceDetails = res.Data;

          const add = this.creditNote.get('CREDIT_NOTES') as FormArray;
          const add1 = this.creditNote.get('CREDIT_NOTES1') as FormArray;

          res.Data.BL_LIST.forEach((element: any) => {
            add.push(this._formBuilder.group(element));
            add1.push(this._formBuilder.group(element));
          });
        }
        this._commonService.getDT();
      });
  }

  checkAll(event: any) {
    const add = this.creditNote.get('CREDIT_NOTES') as FormArray;
    const add1 = this.creditNote.get('CREDIT_NOTES1') as FormArray;
    if (event.target.checked) {
      add.clear();
      add1.controls.forEach((control) => {
        add.push(control);
      });
    } else {
      add.clear();
    }

    for (var i: number = 0; i < this.f1?.length; i++) {
      (document.getElementById('chck' + i) as HTMLInputElement).checked =
        event.target.checked;
    }
  }

  checkItem(item: any, event: any) {
    const add = this.creditNote.get('CREDIT_NOTES') as FormArray;
    if (event.target.checked) {
      add.push(item);
    } else {
      add.removeAt(
        add.value.findIndex(
          (m: { CHARGE_NAME: any }) => m.CHARGE_NAME === item.value.CHARGE_NAME
        )
      );
    }

    (document.getElementById('chckAll') as HTMLInputElement).checked =
      this.f.length == this.f1.length ? true : false;
  }

  get f() {
    const add = this.creditNote.get('CREDIT_NOTES') as FormArray;
    return add.controls;
  }

  get f1() {
    const add = this.creditNote.get('CREDIT_NOTES1') as FormArray;
    return add.controls;
  }

  getRemainingCredit(amount: any, i: number) {
    const add = this.creditNote.get('CREDIT_NOTES1') as FormArray;

    var creditamount = amount.target.value == '' ? 0 : +amount.target.value;
    var remainingamount = +add.at(i).get('REMAINING_AMOUNT').value;

    if (creditamount > remainingamount) {
      add.at(i).get('CREDIT_AMOUNT').setValue('');
    } else if (creditamount == 0) {
      add
        .at(i)
        .get('REMAINING_AMOUNT')
        .setValue(add.at(i).get('REMAINING').value);
    }
  }

  setRemainingCredit(amount: any, i: number) {
    const add = this.creditNote.get('CREDIT_NOTES1') as FormArray;

    var creditamount = amount.target.value == '' ? 0 : +amount.target.value;
    var remainingamount = +add.at(i).get('REMAINING_AMOUNT').value;

    if (creditamount > remainingamount) {
      add.at(i).get('CREDIT_AMOUNT').setValue('');
    } else {
      add
        .at(i)
        .get('REMAINING_AMOUNT')
        .setValue(remainingamount - creditamount);
    }
  }

  createCreditNote() {
    var creditNoteList = this.creditNote.get('CREDIT_NOTES') as FormArray;
    var creditNo = this._commonService.getRandomNumber('CN');

    if (creditNoteList.length == 0) {
      this._commonService.warnMsg('Please select atleast 1 Charge !');
      return;
    }

    creditNoteList.controls.forEach((element) => {
      element.get('CREDIT_NO').setValue(creditNo);
      element.get('AGENT_CODE').setValue(this._commonService.getUserCode());
      element.get('AGENT_NAME').setValue(this._commonService.getUserName());
    });

    this._blService
      .createCreditNote(creditNoteList.value)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Credit Note is created successfully !<br> Credit No is ' + creditNo
          );
          this._router.navigateByUrl('/home/operations/credit-note');
        }
      });
  }
}
