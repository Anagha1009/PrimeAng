import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { BlService } from 'src/app/services/bl.service';
import { Bl } from 'src/app/models/bl';
import { PARTY } from 'src/app/models/party';
import { MASTER } from 'src/app/models/master';


import { CommonService } from 'src/app/services/common.service';
import { PartyService } from 'src/app/services/party.service';
import { MasterService } from 'src/app/services/master.service';


import { Router } from '@angular/router';



@Component({
  selector: 'app-new-invoice2',
  templateUrl: './new-invoice2.component.html',
  styleUrls: ['./new-invoice2.component.scss']
})
export class NewInvoice2Component implements OnInit {
  invoiceForm1:FormGroup;
  invoiceForm:FormGroup;
  invoiceForm2:FormGroup;
  // blList : FormGroup;
  blNo: any;
  BLNO: string = ''
  submitted:boolean=false


  swicthBlNo: string;

  customer: PARTY = new PARTY();
  // SrrList:any[]=[];
  // array:any[]=[]
  add:any[]=[];
  // CurrencyList:any[]=[];
  // ChargeMasterList:any[]=[];
  BLLIST:any[]=[]
  myItems: any[] = [{ index: 0 }];

  master: MASTER = new MASTER();




  // @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;


  @ViewChild('TABLE',{ static : false }) TABLE: ElementRef;



  constructor(private _formBuilder : FormBuilder, private _blService: BlService,
    private _commonService: CommonService,private _partyService : PartyService,
    private _masterService: MasterService, private router : Router

    ) {

  }

  ngOnInit(): void {


    this.invoiceForm = this._formBuilder.group({
      ID: [0],
      INVOICE_NO:[''],
      INVOICE_TYPE: [''],
      BILL_TO: [''],
      BILL_FROM: [''],
      SHIPPER_NAME: [''],
      PAYMENT_TERM:[''],
      BL_NO:[''],
      radio:[''],
      BL_LIST: new FormArray([]),

    });

    this.invoiceForm1 = this._formBuilder.group({
      FROM_DATE: [''],
      TO_DATE: [''],
    });
    // this.getDropdown();
    // this.GetBLList();

  }
  get f() {
    return this.invoiceForm.controls;
  }
  get f1() {
    const add = this.invoiceForm.get('BL_LIST') as FormArray;
    return add.controls;
  }


Submit(BLNO:any){
    console.log(BLNO)
    var BL = new Bl();
    BL.AGENT_CODE = this._commonService.getUserCode();
    BL.BL_NO = BLNO;
    // this._blService.getBLDetails(BL).subscribe((res:any)=>{
      // console.log("res", res.Data);

      this.router.navigateByUrl('/home/operations/invoice-list/' + BLNO);
      this.closeBtn.nativeElement.click();




// });


}

  // download pdf
  downloadpdf(){

      // let PDF = new jsPDF('p', 'pt', 'a2');
      // PDF.html(this.TABLE.nativeElement,{
      //   callback:(pdf)=>{
      //     PDF.save('BL_LIST.pdf');
      //   }
      // })

  }

  openModal(){
    this.openModalPopup.nativeElement.click();
  }


  // chargeModal
  // openModal2(){
  //   this.openModalPopup1.nativeElement.click()

  // }


  CheckBox(event:any){
     console.log("hi",event.target.value)

      localStorage.setItem('value',event.target.value)


}


  Search(){

  }

  Clear(){
    this.invoiceForm2.reset();
  }

  DeleteInvoice(){

  }


  // BL NO
  // Submit(BLNO:any) {
  //   console.log(BLNO)
  //   var BL = new Bl();
  //   BL.AGENT_CODE = this._commonService.getUserCode();
  //   BL.BL_NO = BLNO;
  //   this._blService.getBLDetails(BL).subscribe((res:any)=>{
  //     console.log("res", res.Data);


  //     this.invoiceForm.get('BL_NO')?.setValue(BLNO)
  //   this.invoiceForm.get('SHIPPER_NAME')?.setValue(res.Data.SHIPPER)


  //   this._blService.getSRRDetails(BL).subscribe((res:any)=>{
  //     console.log("srr details",res.Data)
  //     const add = this.invoiceForm.get("BL_LIST") as FormArray
  //     add.clear();
  //     res.Data.SRR_RATES.forEach((element:any) => {
  //       console.log("element", element)
  //       add.push(this._formBuilder.group({
  //       ID:[0],
  //       CHARGE_NAME: [element.CHARGE_CODE],
  //       EXCHANE_RATE: [element.EXCHANE_RATE],
  //       QUANTITY: [0],
  //       AMOUNT: [0],
  //       HSN_CODE:[element.HSN_CODE],
  //       REQUESTED_AMOUNT: [0],
  //       CURRENCY: [element.CURRENCY],
  //       EXEMPT_FLAG: [element.EXEMPT_FLAG],
  //       IS_SRRCHARGE:[true],

  //     })
  //     )

  //     });
  //   });
  //   });

  // }


    // getDropdown(){
  //   // get party list
  //   // this.customer.AGENT_CODE = '';
  //   // this._commonService.destroyDT();
  //   // this._partyService.getPartyList(this.customer).subscribe((res: any) => {

  //   // });

  //   // get currency
  //   // this.master.KEY_NAME = 'CURRENCY';
  //   // this._masterService.GetMasterList(this.master).subscribe((res: any) => {
  //   //   console.log("CURRENCY", res)
  //   //   if(res.ResponseCode == 200){
  //   //     this.CurrencyList = res.Data
  //   //   }
  //   // });

  //   // charge name
  //   // this._masterService.GetChargeMasterList().subscribe((res:any)=>{
  //   //   console.log("res", res)
  //   //   if(res.ResponseCode == 200){
  //   //     this.ChargeMasterList = res.Data
  //   //   }
  //   // })


  // }


    // get BLLIST
  // GetBLList(){
  //   this._masterService.GetBLLISt().subscribe((res:any)=>{
  //     console.log("res===>", res.Data)
  //     this.BLLIST = res.Data
  //   })
  // }


    // add new data
  // SubmitList(){
  //   this.submitted = true;
  //   if (this.invoiceForm.invalid) {
  //     return;
  //   }
  //   this.invoiceForm.get('INVOICE_NO').setValue(this._commonService.getRandomNumber('INV'))

  //     console.log("res =>", JSON.stringify(this.invoiceForm.value));
  //     this._masterService.InsertInvoice(JSON.stringify(this.invoiceForm.value)).subscribe((res:any)=>{
  //       console.log("response is here =>", res)
  //     });
  // }


   // add new row
  // addRow(){

  //   this.submitted = true;
  //   if (this.invoiceForm.invalid) {
  //     return;
  //   }
  //   const add = this.invoiceForm.get('BL_LIST') as FormArray;

  //   add.push(
  //     this._formBuilder.group({
  //       ID: [0],
  //       CHARGE_NAME: ['', Validators.required],
  //       EXCHANE_RATE: ['', Validators.required],
  //       QUANTITY: [0, Validators.required],
  //       AMOUNT: [0, Validators.required],
  //       HSN_CODE: ['', Validators.required],
  //       REQUESTED_AMOUNT: [0, Validators.required],
  //       CURRENCY: ['', Validators.required],
  //       EXEMPT_FLAG: ['', Validators.required],
  //       IS_SRRCHARGE:[false],
  //       IS_GST:[''],
  //       IS_GST1:['']

  //     })
  //   );
  // }

  // delete row
  // deleteBranch(i: number) {
  //   const add = this.invoiceForm.get('BL_LIST') as FormArray;
  //   add.removeAt(i);
  // }
}



// PMIXYJEA202305646
