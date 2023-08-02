import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  Form,
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
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss'],
})
export class PartyComponent implements OnInit {
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
  submitted1: boolean = false;
  submitted2: boolean;
  fileList: any[] = [];
  branchForm: FormGroup;
  isBranchUpdate: boolean = false;
  countryList: any[] = [];
  stateList: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('openBtn') openBtn: ElementRef;

  constructor(
    private _partyService: PartyService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.onLoad();
    this.GetPartyMasterList();
    this.getDropdown();
    this.getDropdownData();
  }

  onLoad() {
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
      BRANCH_LIST: new FormArray([]),
      BANK_LIST: new FormArray([]), // For Insert
      BANK_LIST2: new FormArray([]),
      BANK_LIST3: new FormArray([]), // For Update,
    });

    this.custForm = this._formBuilder.group({
      CUST_NAME: [''],
      CUST_TYPE: [''],
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.branchForm = this._formBuilder.group({
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
      IS_SEZ: [false],
      IS_TAX_APPLICABLE: [false],
      BRANCH_CODE: ['', Validators.required],
    });

    this.fileList = [];
    this.fileList.push({
      FILE_NAME: [''],
      FILE_SIZE: [''],
      FILE: [''],
    });
  }

  getDropdownData() {
    this._commonService.getDropdownData('COUNTRY').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.countryList = res.Data;
      }
    });

    this._commonService.getDropdownData('STATE').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.stateList = res.Data;
      }
    });
  }

  onchangeKYC(event: any) {
    this.isKYC = event.target.checked;
  }

  addNewBranch() {
    this.branchForm.reset();
    this.branchForm.get('IS_SEZ').setValue(false);
    this.branchForm.get('IS_TAX_APPLICABLE').setValue(false);
    this.branchForm.get('ID').setValue(0);
    this.branchForm.get('CUST_ID').setValue(0);

    this.submitted1 = false;
    this.submitted2 = false;
    const add = this.partyForm.get('BANK_LIST2') as FormArray;
    add.clear();

    this.isBranchUpdate = false;
    this.openBtn.nativeElement.click();
  }

  addNewBank() {
    this.submitted1 = true;

    if (this.branchForm.invalid) {
      return;
    }

    const add1 = this.partyForm.get('BANK_LIST2') as FormArray;
    add1.push(
      this._formBuilder.group({
        ID: [0],
        BANK_NAME: ['', Validators.required],
        BANK_ACC_NO: ['', Validators.required],
        BANK_IFSC: ['', Validators.required],
        BANK_SWIFT: [''],
        BANK_REMARKS: [''],
        BRANCH_CODE: [
          this.branchForm.get('BRANCH_CODE').value,
          Validators.required,
        ],
      })
    );
  }

  saveBranch() {
    this.submitted2 = true;

    const add1 = this.partyForm.get('BANK_LIST2') as FormArray;
    if (add1.invalid) {
      return;
    }

    const add = this.partyForm.get('BRANCH_LIST') as FormArray;
    add.push(this._formBuilder.group(this.branchForm.value));

    var add2 = this.partyForm.get('BANK_LIST') as FormArray;

    add1.controls.forEach((element) => {
      add2.push(element);
    });

    this.closeBtn1.nativeElement.click();
    this.openModalPopup.nativeElement.click();
  }

  updateBranch() {
    this.submitted2 = true;

    const add1 = this.partyForm.get('BANK_LIST2') as FormArray;
    if (add1.invalid) {
      return;
    }

    var add = this.partyForm.get('BRANCH_LIST') as FormArray;
    var branch = add.controls.findIndex(
      (x) => x.value.BRANCH_CODE === this.branchForm.get('BRANCH_CODE').value
    );
    add.removeAt(branch);
    add.push(this._formBuilder.group(this.branchForm.value));

    var add2 = this.partyForm.get('BANK_LIST') as FormArray;

    add1.controls.forEach((element) => {
      add2.push(element);
    });

    this.closeBtn1.nativeElement.click();
    this.openModalPopup.nativeElement.click();
  }

  get f() {
    return this.partyForm.controls;
  }

  get f1() {
    const add = this.partyForm.get('BRANCH_LIST') as FormArray;
    return add.controls;
  }

  get f2() {
    const add = this.partyForm.get('BANK_LIST2') as FormArray;
    return add.controls;
  }

  get f3() {
    return this.branchForm.controls;
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
    const add = this.partyForm.get('BANK_LIST2') as FormArray;
    add.removeAt(i);
  }

  editBranch(branchCode: string) {
    var add = this.partyForm.get('BRANCH_LIST') as FormArray;
    var branch = add.controls.find((x) => x.value.BRANCH_CODE === branchCode);
    this.branchForm.reset();
    this.branchForm.patchValue(branch.value);

    debugger;
    var add1 = this.partyForm.get('BANK_LIST3') as FormArray;
    var add2 = this.partyForm.get('BANK_LIST2') as FormArray;
    if (add1.length > 0) {
      var bankList = add1.controls.filter(
        (x) => x.value.BRANCH_CODE === branchCode
      );
      add2.clear();
      bankList.forEach((element) => {
        add2.push(element);
      });
    }

    this.isBranchUpdate = true;
    this.openBtn.nativeElement.click();
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
    this.customer.IS_VENDOR = false;
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
    if (this.isKYC) {
      if (this.fileList[0].FILE_NAME == '') {
        this._commonService.warnMsg('Please Upload atleast 1 file !');
        return;
      }
    }

    if (this.partyForm.invalid) {
      return;
    }

    const branchList = this.partyForm.get('BRANCH_LIST') as FormArray;
    if (branchList.length == 0) {
      this._commonService.errorMsg('Please add atleast 1 Branch !');
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
      alert('Please Select PDF or Excel or Word Format only');
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
              add.at(i).get(element).setValidators(null);
              add.at(i).get(element).updateValueAndValidity();
            });
          });
        });

        const add1 = this.partyForm.get('BANK_LIST3') as FormArray;
        add1.clear();

        res.Data.BANK_LIST.forEach((element: any) => {
          add1.push(this._formBuilder.group(element));
        });

        add1.controls.forEach(function (element: any, i) {
          Object.keys(element.controls).forEach(function (control: any) {
            add1.at(i).get(control).setValidators(Validators.required);
            add1.at(i).get(control).updateValueAndValidity();
            var x = ['BANK_REMARKS', 'BANK_SWIFT'];
            x.forEach((element) => {
              add1.at(i).get(element).setValidators(null);
              add1.at(i).get(element).updateValueAndValidity();
            });
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
    const add = this.partyForm.get('BRANCH_LIST') as FormArray;
    const add1 = this.partyForm.get('BANK_LIST') as FormArray;
    const add2 = this.partyForm.get('BANK_LIST2') as FormArray;
    add.clear();
    add1.clear();
    add2.clear();
  }

  openModal(custID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (custID > 0) {
      this.isUpdate = true;
      this.GetPartyMasterDetails(custID);
    }

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

  closeBranchModal() {
    this.closeBtn1.nativeElement.click();
    this.openModalPopup.nativeElement.click();
  }
}
