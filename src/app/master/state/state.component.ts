import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent implements OnInit {
  stateForm: FormGroup;
  currencymasterForm: FormGroup;
  stateList: any[] = [];
  isUpdate: boolean = false;
  submitted: boolean = false;
  master: MASTER = new MASTER();
  countryList: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.stateForm = this._formBuilder.group({
      ID: [0],
      CODE: ['', Validators.required],
      NAME: ['', Validators.required],
      SHORT_NAME: ['', Validators.required],
      STATUS: ['', Validators.required],
      COUNTRY_ID: ['', Validators.required],
      IS_UT: [''],
      CREATED_BY: [''],
    });

    this.GetStateMasterList();
    this.getDropdown();
  }

  getDropdown() {
    this._commonService.getDropdownData('COUNTRY').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.countryList = res.Data;
      }
    });
  }

  get f() {
    return this.stateForm.controls;
  }

  InsertStateMaster() {
    this.submitted = true;
    if (this.stateForm.invalid) {
      return;
    }

    this.stateForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    this.stateForm
      .get('IS_UT')
      .setValue(this.stateForm.get('IS_UT').value == '' ? false : true);

    this._masterService
      .InsertStateMaster(JSON.stringify(this.stateForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetStateMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetStateMasterList() {
    this._commonService.destroyDT();
    this._masterService.GetStateMasterList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.stateList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetStateMasterDetails(ID: number) {
    this._masterService.GetStateMastersDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.stateForm.patchValue(res.Data);
        this.stateForm
          .get('COUNTRY_ID')
          .setValue(res.Data.COUNTRY_ID.toString());
      }
    });
  }

  UpdateStateMaster() {
    this.submitted = true;
    if (this.stateForm.invalid) {
      return;
    }

    this._masterService
      .UpdateStateMaster(JSON.stringify(this.stateForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetStateMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteStateMaster(ID: number) {
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
        this._masterService.DeleteStateMaster(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetStateMasterList();
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
      this.GetStateMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  ClearForm() {
    this.stateForm.reset();
    this.stateForm.get('ID')?.setValue(0);
  }
}
