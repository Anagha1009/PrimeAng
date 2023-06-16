import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-invoice2',
  templateUrl: './new-invoice2.component.html',
  styleUrls: ['./new-invoice2.component.scss']
})
export class NewInvoice2Component implements OnInit {
  invoiceForm1:FormGroup;
  invoiceForm:FormGroup;
  invoiceForm2:FormGroup;
  invoiceForm3:FormGroup


  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('openModalPopup1') openModalPopup1: ElementRef

  constructor(private _formBuilder : FormBuilder) { }

  ngOnInit(): void {


    this.invoiceForm = this._formBuilder.group({
      ID: [0],
      INVOICE_TYPE: ['',Validators.required],
      BILL_TO: ['', Validators.required],
      BILL_FROM: ['', Validators.required],
      SHIPPER_NAME: [''],
      BL_NO: ['',Validators.required],
      PAYMENT_TAKEN:['', Validators.required]
    });

    this.invoiceForm1 = this._formBuilder.group({
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.invoiceForm2 = this._formBuilder.group({
      BL_NO:['']
    })
    this.invoiceForm3 = this._formBuilder.group({
      BL_NO:['']
    })
  }

  openModal(){
    this.openModalPopup.nativeElement.click();

  }
  Search(){

  }

  Clear(){

  }

  DeleteInvoice(){

  }
  openModal2(){
    this.openModalPopup.nativeElement.click();

  }
}
