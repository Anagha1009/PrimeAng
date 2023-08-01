import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  countryForm: FormGroup;
  currencymasterForm: FormGroup;
  countryList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  submitted: boolean = false;
  master: MASTER = new MASTER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.countryForm = this._formBuilder.group({
      ID: [0],
      CODE: ['', Validators.required],
      NAME: ['', Validators.required],
      SHORT_NAME: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.GetCountryMasterList();
  }

  get f() {
    return this.countryForm.controls;
  }

  InsertCountryMaster() {
    this.submitted = true;
    if (this.countryForm.invalid) {
      return;
    }

    this.countryForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    this._masterService
      .InsertCountryMaster(JSON.stringify(this.countryForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetCountryMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetCountryMasterList() {
    this._commonService.destroyDT();
    this._masterService.GetCountryMasterList().subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.countryList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetCountryMasterDetails(ID: number) {
    this._masterService.GetCountryMastersDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.countryForm.patchValue(res.Data);
      }
    });
  }

  UpdateCountryMaster() {
    this.submitted = true;
    if (this.countryForm.invalid) {
      return;
    }

    this._masterService
      .UpdateCountryMaster(JSON.stringify(this.countryForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetCountryMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteCountryMaster(ID: number) {
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
        this._masterService.DeleteCountryMaster(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetCountryMasterList();
          }
        });
      }
    });
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetCountryMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  ClearForm() {
    this.countryForm.reset();
    this.countryForm.get('ID')?.setValue(0);
  }
}
