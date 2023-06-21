import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup ,FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import { PartyService } from 'src/app/services/party.service';

import { PARTY } from 'src/app/models/party';
import { MASTER } from 'src/app/models/master';
import { Bl } from 'src/app/models/bl';

@Component({
  selector: 'app-invoice-list2',
  templateUrl: './invoice-list2.component.html',
  styleUrls: ['./invoice-list2.component.scss']
})
export class InvoiceList2Component implements OnInit {
  listForm:FormGroup;
  submitted:boolean=false
  CurrencyList:any[]=[];
  ChargeMasterList:any[]=[];
  BLNO: string = ''
  blno:any
  data:any
  master: MASTER = new MASTER();
  customer: PARTY = new PARTY();


  constructor( private route: ActivatedRoute,
    private _formBuilder : FormBuilder,private _blService: BlService,
    private _commonService: CommonService,private _partyService : PartyService,
    private _masterService: MasterService,) { }

  ngOnInit(): void {
    this.listForm = this._formBuilder.group({
      ID: [0],
      INVOICE_NO:[''],
      INVOICE_TYPE: ['',Validators.required],
      BILL_TO: [''],
      BILL_FROM: ['', Validators.required],
      SHIPPER_NAME: [''],
      PAYMENT_TERM:['', Validators.required],
      BL_NO:[''],
      BL_LIST: new FormArray([]),

    });
    var BLNO = this.route.snapshot.paramMap.get('BL_NO')
    console.log("BLNO",BLNO)
    this.blno = this.listForm.get('BL_NO')?.setValue(BLNO)

    this.getDropdown();
    this.Submit(BLNO)

    this.data =  this.listForm.get('INVOICE_TYPE')?.setValue(localStorage.getItem('value'))
  }
  get f() {
    return this.listForm.controls;
  }
  get f1() {
    const add = this.listForm.get('BL_LIST') as FormArray;
    return add.controls;
  }

  getDropdown(){
    // get party list
    this.customer.AGENT_CODE = '';
    this._commonService.destroyDT();
    this._partyService.getPartyList(this.customer).subscribe((res: any) => {
        // console.log("party master list =>", res)
    });

    // get currency
    this.master.KEY_NAME = 'CURRENCY';
    this._masterService.GetMasterList(this.master).subscribe((res: any) => {
      console.log("CURRENCY", res)
      if(res.ResponseCode == 200){
        this.CurrencyList = res.Data
      }
    });

    // charge name
    this._masterService.GetChargeMasterList().subscribe((res:any)=>{
      console.log("charge list", res)
      if(res.ResponseCode == 200){
        this.ChargeMasterList = res.Data
      }
    });

  }


// add new row
  addRow(){
    this.submitted = true;
    if (this.listForm.invalid) {
      return;
    }
    const add = this.listForm.get('BL_LIST') as FormArray;

    add.push(
      this._formBuilder.group({
        ID: [0],
        CHARGE_NAME: ['', Validators.required],
        EXCHANE_RATE: ['', Validators.required],
        QUANTITY: [0, Validators.required],
        AMOUNT: [0, Validators.required],
        HSN_CODE: ['', Validators.required],
        REQUESTED_AMOUNT: [0, Validators.required],
        CURRENCY: ['', Validators.required],
        EXEMPT_FLAG: ['', Validators.required],
        IS_SRRCHARGE:[false],

      })
    );
  }

// submit form final
  SubmitList(){
    this.submitted = true;
    if (this.listForm.invalid) {
      return;
    }
    this.listForm.get('INVOICE_NO').setValue(this._commonService.getRandomNumber('INV'))

      console.log("res =>", JSON.stringify(this.listForm.value));
      this._masterService.InsertInvoice(JSON.stringify(this.listForm.value)).subscribe((res:any)=>{
        console.log("response is here =>", res)
        if (res.responseCode == 200) {
          this._commonService.successMsg('Invoice saved Successfully !');
        }
      });
  }


  // bind BL no to list table
  Submit(BLNO:any) {
    console.log(BLNO)
    var BL = new Bl();
    BL.AGENT_CODE = this._commonService.getUserCode();
    BL.BL_NO = BLNO;
    this._blService.getBLDetails(BL).subscribe((res:any)=>{
      console.log("res", res.Data);
      this.listForm.get('BL_NO')?.setValue(BLNO)
    this.listForm.get('SHIPPER_NAME')?.setValue(res.Data.SHIPPER)

//  get SRR Details
    this._blService.getSRRDetails(BL).subscribe((res:any)=>{
      console.log("srr details",res.Data)
      const add = this.listForm.get("BL_LIST") as FormArray
      add.clear();
      res.Data.SRR_RATES.forEach((element:any) => {
        console.log("element", element)
        add.push(this._formBuilder.group({
        ID:[0],
        CHARGE_NAME: [element.CHARGE_CODE],
        EXCHANE_RATE: [element.EXCHANE_RATE],
        QUANTITY: [0],
        AMOUNT: [0],
        HSN_CODE:[element.HSN_CODE],
        REQUESTED_AMOUNT: [0],
        CURRENCY: [element.CURRENCY],
        EXEMPT_FLAG: [element.EXEMPT_FLAG],
        IS_SRRCHARGE:[true],

      })
      )
      });
    });
    });
  }


}
