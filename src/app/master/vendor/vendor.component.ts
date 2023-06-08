import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl,} from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  vendorForm: FormGroup;
  vendorForm1: FormGroup;
  isUpdate: boolean = false;
  submitted: boolean = false;
  isGST: boolean = false;


  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

    private _commonService: CommonService
    constructor( private _formBuilder: FormBuilder, ) { }

  ngOnInit(): void {

    this.vendorForm1 = this._formBuilder.group({
      VENDOR_ID: [0],
      VENDOR_NAME: ['', Validators.required],
      VENDOR_EMAIL: ['', [Validators.email]],
      VENDOR_ADDRESS: ['', Validators.required],
      VENDOR_TYPE: [''],
      VENDOR_TYPE_CODE: new FormControl( Validators.required),
      GSTIN: [
        '',
        [
          Validators.required,
        ],
      ],
      STATUS: ['', Validators.required],
      VENDOR_CONTACT: [''],
      VAT_NO: ['', Validators.required],
    });

    this.vendorForm = this._formBuilder.group({
      VENDOR_NAME: [''],
      VENDOR_TYPE: [''],
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });
  }

  get f() {
    return this.vendorForm1.controls;
  }

  InsertVendor(){
    this.submitted = true;
    if (this.vendorForm1.invalid) {
      return;
    }

  }

  openModal(){
    this.submitted = false;
    this.isUpdate = false;
    this.openModalPopup.nativeElement.click();

  }
  Search(){

  }
  Clear(){

  }
}
