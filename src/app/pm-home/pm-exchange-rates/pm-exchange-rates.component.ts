import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-pm-exchange-rates',
  templateUrl: './pm-exchange-rates.component.html',
  styleUrls: ['./pm-exchange-rates.component.scss'],
})
export class PmExchangeRatesComponent implements OnInit {
  exclist: any[] = [];

  constructor(
    private _commonService: CommonService,
    private _quotationService: QuotationService
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this._commonService.destroyDT();
    this._quotationService.getPMExcRateList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.exclist = res.Data;
      }
      this._commonService.getDT();
    });
  }
}
