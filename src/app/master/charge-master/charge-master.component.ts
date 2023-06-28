import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-charge-master',
  templateUrl: './charge-master.component.html',
  styleUrls: ['./charge-master.component.scss'],
})
export class ChargeMasterComponent implements OnInit {
  chargeForm: FormGroup;
  chargeForm1: FormGroup;
  ChargeMasterList: any[] = [];
  ArrayList: any[] = [];
  HsnCodeList: any[] = [];
  isUpdate: boolean = false;
  submitted: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  master: MASTER = new MASTER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.chargeForm = this._formBuilder.group({
      ID: [0],
      CHARGE_NAME: ['', Validators.required],
      CHARGE_HEADER: ['', Validators.required],
      APPLICABLE_FOR: ['', Validators.required],
      HSN_CODE: [''],
      CHARGE_TYPE: ['', Validators.required],
    });

    this.chargeForm1 = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.dropdown();
    this.GetChargeMasterList();
  }

  get f() {
    return this.chargeForm.controls;
  }

  ChargeMastersDetails(ID: number) {
    this._masterService.GetChargeMastersDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        res.Data.forEach((element: any) => {
          this.ArrayList = element;
        });
        this.chargeForm.patchValue(this.ArrayList);
      }
    });
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();
    if (ID > 0) {
      this.isUpdate = true;
      this.ChargeMastersDetails(ID);
    }
    this.openModalPopup.nativeElement.click();
  }

  InsertChargeMaster() {
    this.submitted = true;
    if (this.chargeForm.invalid) {
      return;
    } else {
      console.log(JSON.stringify(this.chargeForm.value));
      this._masterService
        .InsertChargeMaster(JSON.stringify(this.chargeForm.value))
        .subscribe((res: any) => {
          if (res.responseCode == 200) {
            this._commonService.successMsg(
              'Your record has been inserted successfully !'
            );
            // this.dropdown()
            this.GetChargeMasterList();
            this.closeBtn.nativeElement.click();
          }
        });
    }
  }

  updateMaster() {
    this.submitted = true;
    if (this.chargeForm.invalid) {
      return;
    }
    this._masterService
      .UpdateChargeMaster(JSON.stringify(this.chargeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          // this.dropdown();
          this.GetChargeMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteChargeMaster(ID: number) {
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
        this._masterService.DeleteChargeMaster(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            // this.dropdown();
            this.GetChargeMasterList();
          }
        });
      }
    });
  }

  dropdown() {
    // GET hsn code from hsn master
    this._masterService.getHsnList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.HsnCodeList = res.Data;
      }
    });
  }

  GetChargeMasterList() {
    this._commonService.destroyDT();
    this._masterService.GetChargeMasterList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.ChargeMasterList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  ClearForm() {
    this.chargeForm.reset();
    this.chargeForm.get('ID')?.setValue(0);
    this.chargeForm.get('CHARGE_NAME')?.setValue('');
    this.chargeForm.get('CHARGE_HEADER')?.setValue('');
    this.chargeForm.get('APPLICABLE_FOR')?.setValue('');
    this.chargeForm.get('HSN_CODE')?.setValue('');
    this.chargeForm.get('CHARGE_AMOUNT')?.setValue('');
  }

  Search() {
    var FROM_DATE =
      this.chargeForm1.value.FROM_DATE == null
        ? ''
        : this.chargeForm1.value.FROM_DATE;
    var TO_DATE =
      this.chargeForm1.value.TO_DATE == null
        ? ''
        : this.chargeForm1.value.TO_DATE;

    if (FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      this.isLoading = false;
    } else {
      this.master.FROM_DATE = FROM_DATE;
      this.master.TO_DATE = TO_DATE;

      this.isLoading = true;
      // this.dropdown();
      this.GetChargeMasterList();
    }
  }

  Clear() {
    this.chargeForm1.reset();
    this.master = new MASTER();
    this.isLoading1 = true;
    // this.dropdown();
    this.GetChargeMasterList();
  }
}
