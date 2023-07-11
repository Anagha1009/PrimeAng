import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-receipt',
  templateUrl: './new-receipt.component.html',
  styleUrls: ['./new-receipt.component.scss'],
})
export class NewReceiptComponent implements OnInit {
  receiptForm: FormGroup;
  receiptDetails: any;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.receiptForm = this._formBuilder.group({
      BL_NO: [''],
      INVOICE_NO: [''],
    });
  }
}
