import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CONTAINER } from 'src/app/models/container';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pm-container-list',
  templateUrl: './pm-container-list.component.html',
  styleUrls: ['./pm-container-list.component.scss'],
})
export class PmContainerListComponent implements OnInit {
  fileName= 'Inventory report.xlsx';
  filterForm: FormGroup;
  inventoryList: any[] = [];
  container: CONTAINER = new CONTAINER();
  isLoading: boolean = false;
  isLoading1: boolean = false;
  locationList: any[] = [];

  constructor(
    private _cmService: CmService,
    private _cm: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      LOCATION: [''],
    });

    this.getInventoryList();
    this.getDropdown();
  }

  getDropdown() {
    this._cm.getDropdownData('CM_LOCATION').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.locationList = res.Data;
      }
    });
  }

  Search() {
    var LOCATION = this.filterForm.value.LOCATION;

    if (LOCATION == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.container.LOCATION = LOCATION;
    this.isLoading = true;
    this.getInventoryList();
  }

  Clear() {
    this.filterForm.get('LOCATION')?.setValue('');
    this.container.LOCATION = '';
    this.isLoading1 = true;
    this.getInventoryList();
  }

  getInventoryList() {
    this._cm.destroyDT();
    this._cmService
      .getAllCMAvailableAdmin(this.container)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.inventoryList = res.Data;
        }
        this._cm.getDT();
      });
  }

  exportexcel(){
    let element = document.getElementById('data-table-config');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }
}
