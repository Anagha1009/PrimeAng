import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-credit-note',
  templateUrl: './new-credit-note.component.html',
  styleUrls: ['./new-credit-note.component.scss'],
})
export class NewCreditNoteComponent implements OnInit {
  chargeList: any[] = [];
  constructor(private _commonService: CommonService) {}

  ngOnInit(): void {
    this.getChargeList();
  }

  getChargeList() {
    this._commonService.destroyDT();
    this.chargeList = [];

    this._commonService.getDT();
  }
}
