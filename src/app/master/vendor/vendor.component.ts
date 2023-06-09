import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PARTY } from 'src/app/models/party';
import { CommonService } from 'src/app/services/common.service';
import { PartyService } from 'src/app/services/party.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
})
export class VendorComponent implements OnInit {
  submitted: boolean = false;
  partyForm: FormGroup;
  partyList: any[] = [];
  isUpdate: boolean = false;
  custForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  customer: PARTY = new PARTY();
  isGST: boolean = false;
  custTypeList: any[] = [];
  dropdownSettings = {};
  selectedItems: any[] = [];
  isKYC: boolean = false;
  fileList: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _partyService: PartyService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'CODE',
      textField: 'CODE_DESC',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 170,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Select Type',
      noDataAvailablePlaceholderText: 'No Records',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.partyForm = this._formBuilder.group({
      CUST_ID: [0],
      CUST_NAME: ['', Validators.required],
      CUST_EMAIL: ['', [Validators.email]],
      CUST_ADDRESS: [''],
      CUST_TYPE: [''],
      CUST_TYPE_CODE: new FormControl(this.custTypeList, Validators.required),
      GSTIN: [
        '',
        [
          Validators.pattern(
            '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
          ),
        ],
      ],
      STATUS: ['', Validators.required],
      CUST_CONTACT: [''],
      VAT_NO: [''],
      COUNTRY: ['', Validators.required],
      STATE: [''],
      CITY: [''],
      PINCODE: [''],
      PAN: [
        '',
        [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')],
      ],
      CONTACT_PERSON_NAME: [''],
      CONTACT_PERSON_NO: [''],
      IS_GROUP_COMPANIES: [false],
      SALES_NAME: [''],
      SALES_CODE: [''],
      SALES_LOC: [''],
      SALES_EFFECTIVE_DATE: [''],
      IS_VENDOR: [true],
      BRANCH_LIST: new FormArray([]),
      BANK_LIST: new FormArray([]),
    });

    this.custForm = this._formBuilder.group({
      CUST_NAME: [''],
      CUST_TYPE: [''],
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetPartyMasterList();
    this.getDropdown();

    this.fileList = [];
    this.fileList.push({
      FILE_NAME: [''],
      FILE_SIZE: [''],
      FILE: [''],
    });
  }

  onchangeKYC(event: any) {
    this.isKYC = event.target.checked;
  }

  addNewBranch() {
    const add = this.partyForm.get('BRANCH_LIST') as FormArray;

    add.push(
      this._formBuilder.group({
        ID: [0],
        CUST_ID: [0],
        BRANCH_NAME: ['', Validators.required],
        COUNTRY: ['', Validators.required],
        STATE: [''],
        CITY: [''],
        TAN: [''],
        TAX_NO: ['', Validators.required],
        TAX_TYPE: ['', Validators.required],
        PIC_NAME: [''],
        PIC_CONTACT: [''],
        PIC_EMAIL: [''],
        ADDRESS: ['', Validators.required],
      })
    );
  }

  addNewBank() {
    const add = this.partyForm.get('BANK_LIST') as FormArray;

    add.push(
      this._formBuilder.group({
        ID: [0],
        BANK_NAME: ['', Validators.required],
        BANK_ACC_NO: ['', Validators.required],
        BANK_IFSC: ['', Validators.required],
        BANK_REMARKS: [''],
      })
    );
  }

  get f() {
    return this.partyForm.controls;
  }

  get f1() {
    const add = this.partyForm.get('BRANCH_LIST') as FormArray;
    return add.controls;
  }

  get f2() {
    const add = this.partyForm.get('BANK_LIST') as FormArray;
    return add.controls;
  }

  addNewFile() {
    this.fileList.push({
      FILE_NAME: [''],
      FILE_SIZE: [''],
      FILE: [''],
    });
  }

  removeFile(i: number) {
    this.fileList.splice(i, 1);
    if (this.fileList.length == 0) {
      this.fileList.push({
        FILE_NAME: [''],
        FILE_SIZE: [''],
        FILE: [''],
      });
    }
  }

  uploadFilestoDB(CUSTID: string) {
    const payload = new FormData();

    var x = this.fileList;
    this.fileList.forEach((element: any) => {
      payload.append('formFile', element.FILE);
    });

    this._partyService.uploadFiles(payload, CUSTID).subscribe();
  }

  deleteBranch(i: number) {
    const add = this.partyForm.get('BRANCH_LIST') as FormArray;
    add.removeAt(i);
  }

  deleteBank(i: number) {
    const add = this.partyForm.get('BANK_LIST') as FormArray;
    add.removeAt(i);
  }

  Search() {
    var CUST_NAME =
      this.custForm.value.CUST_NAME == null
        ? ''
        : this.custForm.value.CUST_NAME;
    var CUST_TYPE =
      this.custForm.value.CUST_TYPE == null
        ? ''
        : this.custForm.value.CUST_TYPE;
    var STATUS =
      this.custForm.value.STATUS == null ? '' : this.custForm.value.STATUS;
    var FROM_DATE =
      this.custForm.value.FROM_DATE == null
        ? ''
        : this.custForm.value.FROM_DATE;
    var TO_DATE =
      this.custForm.value.TO_DATE == null ? '' : this.custForm.value.TO_DATE;

    if (
      CUST_NAME == '' &&
      CUST_TYPE == '' &&
      STATUS == '' &&
      FROM_DATE == '' &&
      TO_DATE == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.customer.CUST_NAME = CUST_NAME;
    this.customer.CUST_TYPE = CUST_TYPE;
    this.customer.STATUS = STATUS;
    this.customer.FROM_DATE = FROM_DATE;
    this.customer.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.GetPartyMasterList();
  }

  Clear() {
    this.custForm.reset();
    this.custForm.get('STATUS')?.setValue('');
    this.customer = new PARTY();
    this.isLoading1 = true;
    this.GetPartyMasterList();
  }

  GetPartyMasterList() {
    this.customer.AGENT_CODE = '';
    this.customer.IS_VENDOR = true;
    this._commonService.destroyDT();
    this._partyService.getPartyList(this.customer).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.partyList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  InsertPartyMaster() {
    this.submitted = true;

    debugger;
    if (this.isKYC) {
      if (this.fileList[0].FILE_NAME == '') {
        this._commonService.warnMsg('Please Upload atleast 1 file !');
        return;
      }
    }

    if (this.partyForm.invalid) {
      return;
    }

    this.partyForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    const add = this.partyForm.get('CUST_TYPE_CODE') as FormArray;
    var custType = '';
    add.value.forEach((element: any) => {
      custType += element.CODE + ',';
    });

    this.partyForm.get('CUST_TYPE').setValue(custType);
    this.partyForm.get('IS_VENDOR').setValue(true);

    this._partyService
      .postParty(JSON.stringify(this.partyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.uploadFilestoDB(res.responseMessage);
          this.GetPartyMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  fileUpload(event: any, index: number) {
    if (event.target.files[0].type == 'application/pdf') {
    } else {
      alert('Please Select PDF Format only');
      return;
    }

    if (+event.target.files[0].size > 5000000) {
      alert('Please upload file less than 5 mb..!');
      return;
    }

    this.fileList[index].FILE_NAME = event.target.files[0].name;
    this.fileList[index].FILE_SIZE = event.target.files[0].size;
    this.fileList[index].FILE = event.target.files[0];
  }

  DeletePartyMaster(partyID: number) {
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
        this._partyService.deleteParty(partyID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetPartyMasterList();
          }
        });
      }
    });
  }

  GetPartyMasterDetails(partyID: number) {
    var partyModel = new PARTY();
    partyModel.AGENT_CODE = '';
    partyModel.CUST_ID = partyID;

    this._partyService.getPartyDetails(partyModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.partyForm.patchValue(res.Data);
        this.getDropdown('1');
        const add = this.partyForm.get('BRANCH_LIST') as FormArray;
        add.clear();

        res.Data.BRANCH_LIST.forEach((element: any) => {
          add.push(this._formBuilder.group(element));
        });

        add.controls.forEach(function (element: any, i) {
          Object.keys(element.controls).forEach(function (control: any) {
            add.at(i).get(control).setValidators(Validators.required);
            add.at(i).get(control).updateValueAndValidity();
            var x = [
              'STATE',
              'CITY',
              'TAN',
              'PIC_NAME',
              'PIC_CONTACT',
              'PIC_EMAIL',
            ];
            x.forEach((element) => {
              if (control == element) {
                add.at(i).get(element).setValidators(null);
                add.at(i).get(element).updateValueAndValidity();
              }
            });
          });
        });

        const add1 = this.partyForm.get('BANK_LIST') as FormArray;
        add1.clear();

        res.Data.BANK_LIST.forEach((element: any) => {
          add1.push(this._formBuilder.group(element));
        });

        add1.controls.forEach(function (element: any, i) {
          Object.keys(element.controls).forEach(function (control: any) {
            add1.at(i).get(control).setValidators(Validators.required);
            add1.at(i).get(control).updateValueAndValidity();
            if (control == 'BANK_REMARKS') {
              add1.at(i).get('BANK_REMARKS').setValidators(null);
              add1.at(i).get('BANK_REMARKS').updateValueAndValidity();
            }
          });
        });
      }
    });
  }

  UpdatePartyMaster() {
    this.submitted = true;
    if (this.partyForm.invalid) {
      return;
    }

    const add = this.partyForm.get('CUST_TYPE_CODE') as FormArray;
    var custType = '';
    add.value.forEach((element: any) => {
      custType += element.CODE + ',';
    });
    this.partyForm.get('CUST_TYPE').setValue(custType);

    this._partyService
      .updateParty(JSON.stringify(this.partyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetPartyMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.partyForm.reset();
    this.partyForm.get('CUST_TYPE')?.setValue('');
    this.partyForm.get('CUST_ID')?.setValue(0);
    this.partyForm.get('IS_GROUP_COMPANIES')?.setValue(false);
  }

  openModal(custID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (custID > 0) {
      this.isUpdate = true;
      this.GetPartyMasterDetails(custID);
    }

    const add = this.partyForm.get('BRANCH_LIST') as FormArray;
    add.clear();
    add.push(
      this._formBuilder.group({
        ID: [0],
        CUST_ID: [0],
        BRANCH_NAME: ['', Validators.required],
        COUNTRY: ['', Validators.required],
        STATE: [''],
        CITY: [''],
        TAN: [''],
        TAX_NO: ['', Validators.required],
        TAX_TYPE: ['', Validators.required],
        PIC_NAME: [''],
        PIC_CONTACT: [''],
        PIC_EMAIL: [''],
        ADDRESS: ['', Validators.required],
      })
    );

    const add1 = this.partyForm.get('BANK_LIST') as FormArray;
    add1.clear();
    add1.push(
      this._formBuilder.group({
        ID: [0],
        BANK_NAME: ['', Validators.required],
        BANK_ACC_NO: ['', Validators.required],
        BANK_IFSC: ['', Validators.required],
        BANK_REMARKS: [''],
      })
    );

    this.openModalPopup.nativeElement.click();
  }

  onlyNumeric(event: any) {
    this._commonService.numericOnly(event);
  }

  getDropdown(value: any = '') {
    this.custTypeList = [];
    this.partyForm.get('CUST_TYPE_CODE').setValue('');
    this._commonService
      .getDropdownData('CUST_TYPE', '', '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.custTypeList = res.Data;

          if (value != '') {
            var x = this.partyForm.get('CUST_TYPE').value.split(',');
            var ss: any = [];
            x.forEach((element: any) => {
              if (element != '') {
                ss.push(this.custTypeList.filter((x) => x.CODE === element)[0]);
              }
            });
            this.selectedItems = ss;
          }
        }
      });
  }
}
