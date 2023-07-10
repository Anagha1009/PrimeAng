import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
})
export class CreditNoteComponent implements OnInit {
  creditList: any[] = [];
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
      INVOICE_NO: [''],
      CREDIT_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getCreditList();
  }

  Search() {
    var CREDIT_NO = this.filterForm.value.CRO_NO;
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (CREDIT_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.bl.CREDIT_NO = CREDIT_NO;
    this.bl.FROM_DATE = FROM_DATE;
    this.bl.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.getCreditList();
  }

  Clear() {
    this.filterForm.get('CREDIT_NO')?.setValue('');
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.bl.CREDIT_NO = '';
    this.bl.FROM_DATE = '';
    this.bl.TO_DATE = '';

    this.isLoading1 = true;
    this.getCreditList();
  }

  getCreditList() {
    this.bl.AGENT_CODE = this._commonService.getUserCode();
    this.bl.ORG_CODE = this._commonService.getUserOrgCode();
    this.bl.PORT = this._commonService.getUserPort();
    this._commonService.destroyDT();
    this.blService.getCreditNoteList(this.bl).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.creditList = res.Data;
      }
      this._commonService.getDT();
    });
  }
}
