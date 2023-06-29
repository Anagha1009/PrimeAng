import { formatDate } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import { MASTER } from 'src/app/models/master';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-hsn-code',
  templateUrl: './hsn-code.component.html',
  styleUrls: ['./hsn-code.component.scss'],
})
export class HsnCodeComponent implements OnInit {
  hsnForm1: FormGroup;
  hsnForm: FormGroup;
  submitted: boolean = false;
  date: any;
  HsnList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  master: MASTER = new MASTER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  constructor(
    private _formBuilder: FormBuilder,
    private _masterService: MasterService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.hsnForm1 = this._formBuilder.group({
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.hsnForm = this._formBuilder.group({
      HSN_CODE: ['', Validators.required],
      HSN_DESC: [''],
      RATE: ['', Validators.required],
      EFFECTIVE_FROM: ['', Validators.required],
      EFFECTIVE_TO: [''],
      IGST: ['', Validators.required],
      SGST: ['', Validators.required],
      CGST: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.GetList();
  }
  get f() {
    return this.hsnForm.controls;
  }

  DeleteHSnMaster(ID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._masterService.DeleteHsnMaster(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');

            this.GetList();
          }
        });
      }
    });
  }

  openModal() {
    this.openModalPopup.nativeElement.click();
  }

  // search table data with date
  Search() {
    var FROM_DATE =
      this.hsnForm1.value.FROM_DATE == null
        ? ''
        : this.hsnForm1.value.FROM_DATE;
    var TO_DATE =
      this.hsnForm1.value.TO_DATE == null ? '' : this.hsnForm1.value.TO_DATE;

    if (FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
    }
    this.master.FROM_DATE = FROM_DATE;
    this.master.TO_DATE = TO_DATE;

    this.isLoading = true;
  }

  SubmitHSN() {
    this.submitted = true;
    if (this.hsnForm.invalid) {
      return;
    } else {
      this.hsnForm
        .get('CREATED_BY')
        .setValue(this._commonService.getUserName());

      this._masterService
        .InsertHsnCode(JSON.stringify(this.hsnForm.value))
        .subscribe((res: any) => {
          console.log('form value of hsn code', this.hsnForm.value);
          if (res.responseCode == 200) {
            this._commonService.successMsg(
              'Your record has been inserted successfully !'
            );
            this.closeBtn.nativeElement.click();
            this.GetList();
          }
        });
    }
  }

  // bind list to table
  GetList() {
    this._commonService.destroyDT();
    this._masterService.getHsnList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.HsnList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  ClearForm() {
    this.hsnForm.reset();
    this.hsnForm.get('ID')?.setValue(0);
  }

  Clear() {
    this.hsnForm1.reset();
    this.isLoading1 = true;
  }
}
