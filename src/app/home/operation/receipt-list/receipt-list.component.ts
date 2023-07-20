import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss'],
})
export class ReceiptListComponent implements OnInit {
  invoiceList: any[] = [];
  creditDetails: any;
  bl = new Bl();
  filterForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  receiptType: any;
  invoiceNoList: any[] = [];
  invoiceNo: any;

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _router: Router,
    private blService: BlService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      BL_NO: [''],
      INVOICE_NO: [''],
      CREDIT_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this._commonService.getDT();
  }

  Search() {
    var BL_NO = this.filterForm.value.BL_NO;
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (BL_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.bl.BL_NO = BL_NO;
    this.bl.FROM_DATE = FROM_DATE;
    this.bl.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.getInvoiceList();
  }

  Clear() {
    this.filterForm.get('CREDIT_NO')?.setValue('');
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.bl.CREDIT_NO = '';
    this.bl.FROM_DATE = '';
    this.bl.TO_DATE = '';

    this.isLoading1 = true;
    this.getInvoiceList();
  }

  getInvoiceList() {
    this.bl.AGENT_CODE = this._commonService.getUserCode();
    this.bl.ORG_CODE = this._commonService.getUserOrgCode();
    this.bl.PORT = this._commonService.getUserPort();
    this._commonService.destroyDT();
    this.blService.getInvoiceListNew(this.bl).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.invoiceList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  openModal(invoiceNo: any = '') {
    this.invoiceNo = invoiceNo;
    this.openBtn.nativeElement.click();
  }

  goToNewReceipt() {
    localStorage.removeItem('receiptType');
    localStorage.removeItem('InvoiceNo');
    localStorage.removeItem('InvoiceNoList');
    localStorage.setItem('receiptType', this.receiptType);
    localStorage.setItem('InvoiceNo', this.invoiceNo);
    localStorage.setItem('InvoiceNoList', JSON.stringify(this.invoiceNoList));
    this._router.navigateByUrl('/home/operations/new-receipt');
    this.closeBtn.nativeElement.click();
  }

  checkAll(event: any) {
    if (event.target.checked) {
      this.invoiceNoList = [];
      this.invoiceList.forEach((element) => {
        this.invoiceNoList.push(element.INVOICE_NO);
      });
    } else {
      this.invoiceNoList = [];
    }

    for (var i: number = 0; i < this.invoiceList?.length; i++) {
      (document.getElementById('chck' + i) as HTMLInputElement).checked =
        event.target.checked;
    }
  }

  getChecked(i: any) {
    return (document.getElementById('chck' + i) as HTMLInputElement).checked;
  }

  checkItem(item: any, event: any) {
    if (event.target.checked) {
      this.invoiceNoList.push(item);
    } else {
      var index = this.invoiceNoList.findIndex(
        (m: { INVOICE_NO: any }) => m.INVOICE_NO === item.INVOICE_NO
      );
      this.invoiceNoList.splice(index, 1);
    }

    (document.getElementById('chckAll') as HTMLInputElement).checked =
      this.invoiceNoList.length == this.invoiceList.length ? true : false;
  }
}
