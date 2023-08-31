import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss'],
})
export class ReceiptsComponent implements OnInit {
  receiptList: any[] = [];
  bl = new Bl();
  filterForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;

  constructor(
    private _router: Router,
    private blService: BlService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getReceiptList();
  }

  Search() {
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.bl.FROM_DATE = FROM_DATE;
    this.bl.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.getReceiptList();
  }

  Clear() {
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.bl.FROM_DATE = '';
    this.bl.TO_DATE = '';

    this.isLoading1 = true;
    this.getReceiptList();
  }

  getReceiptList() {
    this.bl.AGENT_CODE = this._commonService.getUserCode();
    this.bl.ORG_CODE = this._commonService.getUserOrgCode();
    this.bl.PORT = this._commonService.getUserPort();
    this._commonService.destroyDT();
    this.blService.getreceiptList(this.bl).subscribe((res: any) => {
      debugger;
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.receiptList = res.Data;
      }
      this._commonService.getDT();
    });
  }
}
