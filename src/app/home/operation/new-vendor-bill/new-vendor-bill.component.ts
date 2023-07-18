import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private _formBuilder: FormBuilder) {}

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
}
