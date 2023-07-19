import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-vendor-bill',
  templateUrl: './new-vendor-bill.component.html',
  styleUrls: ['./new-vendor-bill.component.scss'],
})
export class NewVendorBillComponent implements OnInit {
  vendorForm: FormGroup;
  dropdownSettings = {};
  submitted: boolean = false;
  containerDropdownList: any[] = [];
  selectedItems: any[] = [];
  isUploaded: boolean = false;
  tabs: string = '1';
  vendorChargeList: any[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'CONTAINER_NO',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 170,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Select Container',
      noDataAvailablePlaceholderText: 'No Container Present',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.vendorForm = this._formBuilder.group({
      VESSEL_NAME: [''],
      VOYAGE_NO: [''],
      CONTAINER_LIST: [''],
      CONTAINER_LIST1: [''],
    });
  }

  get f() {
    return this.vendorForm.controls;
  }

  onchangeTab(index: any) {
    debugger;
    this.tabs = index;

    if (index == '2') {
      this._commonService.destroyDT();
      this._commonService.getDT();
    }
  }

  nextGeneralDetails() {
    this.tabs = '2';
    this._commonService.destroyDT();
    this._commonService.getDT();
  }
}
