import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import { PartyService } from 'src/app/services/party.service';

import { PARTY } from 'src/app/models/party';
import { MASTER } from 'src/app/models/master';
import { Bl } from 'src/app/models/bl';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-invoice-list2',
  templateUrl: './invoice-list2.component.html',
  styleUrls: ['./invoice-list2.component.scss']
})
export class InvoiceList2Component implements OnInit {
  listForm: FormGroup;
  containerForm: FormGroup;
  submitted: boolean = false
  CurrencyList: any[] = [];
  ChargeMasterList: any[] = [];
  BillFromList: any[] = [];
  containerDropdownList : any[] = [];
  AddressList:any[]=[];
  BLNO: string = ''
  blno: any
  data: any
  ORG_CODE: string = ''
  PORT: string = ''
  value: any
  currentDate:any;
  POL:boolean = false
  dropdownSettings = {};
  master: MASTER = new MASTER();
  customer: PARTY = new PARTY();


  constructor(private route: ActivatedRoute,
    private _formBuilder: FormBuilder, private _blService: BlService,
    private _commonService: CommonService, private _InvoiceService: InvoiceService) { }

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


    this.listForm = this._formBuilder.group({
      ID: [0],
      INVOICE_NO: [''],
      INVOICE_TYPE: [''],
      BILL_TO: [''],
      BILL_FROM: [''],
      SHIPPER_NAME: [''],
      PAYMENT_TERM: [''],
      BL_NO: [''],
      INVOICE_DATE:[''],
      CONTAINER_NO:[],
      AGENT_NAME:[''],
      AGENT_CODE:[],
      ADDRESS:[''],
      BL_LIST: new FormArray([]),
      });



    this.containerForm = this._formBuilder.group({
      CONTAINER_LIST1: new FormControl(
        this.containerDropdownList,
        Validators.required
      ),
      CONTAINER_LIST: new FormArray([]),
    });



    var BLNO = this.route.snapshot.paramMap.get('BL_NO')
    console.log("BLNO", BLNO)
    this.listForm.get('BL_NO')?.setValue(BLNO)

    this.getDropdown();
    this.Submit(BLNO)

    this.listForm.get('INVOICE_TYPE')?.setValue(localStorage.getItem('value'))
    this.value = localStorage.getItem('value')
    if(this.value == 'POL'){
        this.POL = true
    }else{
        this.POL = false
    }

    // To set Inovice type
    if(this.value =='FREIGHT'){
      this.listForm.get('INVOICE_TYPE')?.setValue(localStorage.getItem('value'))
    }
    else{
      this.listForm.get('INVOICE_TYPE')?.setValue('LOCAL')
    }

    // get current Date
    this.currentDate = this._commonService.getcurrentDate(new Date())
    this.listForm.get("INVOICE_DATE")?.setValue( this.currentDate);


  }
  get f() {
    return this.listForm.controls;
  }
  get f1() {
    const add = this.listForm.get('BL_LIST') as FormArray;
    return add.controls;
  }
  get f2() {
    const add = this.containerForm.get('CONTAINER_LIST') as FormArray;
    return add.controls;
  }


  getDropdown() {

    // Get Currency
    this._commonService.getDropdownData('CURRENCY').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.CurrencyList = res.Data
      }
    });

    // Get Invoice Charge
    this._commonService.getDropdownData('INVOICE_CHARGE').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.ChargeMasterList = res.Data
      }
    });

    // Get Cutomer Name Bill_To
    this._commonService.getDropdownData('CUSTOMER_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.BillFromList = res.Data
      }
    });

    this._commonService.getDropdownData('ADDRESS').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.AddressList = res.Data
      }
    });
  }


  // add new row
  addRow() {
    // this.submitted = true;
    // if (this.listForm.invalid) {
    //   return;
    // }
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
        IS_SRRCHARGE: [false],
        TAX:[''],
        IGST:[''],
        SGST:[''],
        CGST:[''],
        TAX_AMOUNT:[''],
        TOTAL_AMOUNT:['']


      })
    );
  }

  // submit form final
  SubmitList() {
    // this.submitted = true;
    // if (this.listForm.invalid) {
    //   return;
    // }
    this.listForm.get('INVOICE_NO').setValue(this._commonService.getRandomNumber('INV'))
    this.listForm.get('AGENT_NAME').setValue(this._commonService.getUserName());
    this.listForm.get('AGENT_CODE').setValue(this._commonService.getUserCode())
    console.log("res =>", JSON.stringify(this.listForm.value));
    this._InvoiceService.InsertInvoice(JSON.stringify(this.listForm.value)).subscribe((res: any) => {
      console.log("response is here =>", res)
      if (res.responseCode == 200) {
        this._commonService.successMsg('Invoice saved Successfully !');
      }
    });
  }


  // bind BL no to list table
  // Submit(BLNO: any) {
  //   console.log(BLNO)
  //   var BL = new Bl();
  //   BL.AGENT_CODE = this._commonService.getUserCode();
  //   BL.BL_NO = BLNO;
  //   this._blService.getBLDetails(BL).subscribe((res: any) => {
  //     BL.ORG_CODE = res.Data.DESTINATION_AGENT_CODE
  //     BL.PORT = res.Data.FINAL_DESTINATION
  //     this.listForm.get('BL_NO')?.setValue(BLNO)
  //     this.listForm.get('SHIPPER_NAME')?.setValue(res.Data.SHIPPER)


  //     this._InvoiceService.GetInvoiceBLDetails(BL).subscribe((res: any) => {
  //       console.log("GetInvoiceBLDetails =>", res)
  //       this.containerDropdownList = res.Data.CONTAINERS
  //       this.listForm.get('BILL_FROM')?.setValue(res.Data.ORG_NAME)
  //       this.listForm.get('BILL_FROM')?.setValue(res.Data.ORG_ADDRESS1)
  //       const add = this.listForm.get("BL_LIST") as FormArray
  //       add.clear();

  //       if (this.value == 'FREIGHT') {
  //         res.Data.FREIGHT.forEach((element: any) => {
  //           console.log("element", element)
  //           add.push(this._formBuilder.group({
  //             ID: [0],
  //             CHARGE_NAME: [element.CHARGE_CODE],
  //             EXCHANE_RATE: [element.EXCHANE_RATE],
  //             QUANTITY: [0],
  //             AMOUNT: [0],
  //             HSN_CODE: [element.HSN_CODE],
  //             REQUESTED_AMOUNT: [element.RATE_REQUESTED],
  //             CURRENCY: [element.CURRENCY],
  //             EXEMPT_FLAG: [element.EXEMPT_FLAG],
  //             IS_SRRCHARGE: [true],
  //             TAX:[''],
  //             IGST:[''],
  //             SGST:[''],
  //             CGST:[''],
  //             TAX_AMOUNT:[''],
  //             TOTAL_AMOUNT:['']

  //           })
  //           )

  //         })
  //       } else if (this.value == 'POD') {

  //         res.Data.POD.forEach((element: any) => {
  //           console.log("element", element)
  //           add.push(this._formBuilder.group({
  //             ID: [0],
  //             CHARGE_NAME: [element.CHARGE_CODE],
  //             EXCHANE_RATE: [element.EXCHANE_RATE],
  //             QUANTITY: [0],
  //             AMOUNT: [0],
  //             HSN_CODE: [element.HSN_CODE],
  //             REQUESTED_AMOUNT: [element.RATE_REQUESTED],
  //             CURRENCY: [element.CURRENCY],
  //             EXEMPT_FLAG: [element.EXEMPT_FLAG],
  //             IS_SRRCHARGE: [true],
  //             TAX:[''],
  //             IGST:[''],
  //             SGST:[''],
  //             CGST:[''],
  //             TAX_AMOUNT:[''],
  //             TOTAL_AMOUNT:['']

  //           })
  //           )
  //         })

  //       } else if (this.value == 'POL') {

  //         res.Data.POL.forEach((element: any) => {
  //           console.log("element", element)
  //           add.push(this._formBuilder.group({
  //             ID: [0],
  //             CHARGE_NAME: [element.CHARGE_CODE],
  //             EXCHANE_RATE: [element.EXCHANE_RATE],
  //             QUANTITY: [0],
  //             AMOUNT: [0],
  //             HSN_CODE: [element.HSN_CODE],
  //             REQUESTED_AMOUNT: [element.RATE_REQUESTED],
  //             CURRENCY: [element.CURRENCY],
  //             EXEMPT_FLAG: [element.EXEMPT_FLAG],
  //             IS_SRRCHARGE: [true],
  //             TAX:[''],
  //             IGST:[''],
  //             SGST:[''],
  //             CGST:[''],
  //             TAX_AMOUNT:[''],
  //             TOTAL_AMOUNT:['']

  //           })
  //           )
  //         })
  //       }

  //     });

  //   }
  //   )
  // }

  saveContainer(event:any, value = 0){
    var containerList = this.containerForm.get('CONTAINER_LIST1')?.value;
    const add = this.containerForm.get('CONTAINER_LIST') as FormArray;

    if (value == 1) {
      add.clear();
      event.forEach((element: any) => {
        add.push(
          this._formBuilder.group({
            CONTAINER_NO: [element.CONTAINER_NO],
          })
        );
      });
    } else if (value == 2) {
      add.clear();
    } else {
      var i = containerList.findIndex((x: any) => x.ID === event.ID);
      if (i == -1) {
        add.removeAt(
          add.value.findIndex(
            (m: { CONTAINER_NO: any }) => m.CONTAINER_NO === event.CONTAINER_NO
          )
        );
      } else {
        add.push(
          this._formBuilder.group({
            CONTAINER_NO: [event.CONTAINER_NO],
          })
        );
      }
    }
  }



  Submit(BLNO: any){
      console.log(BLNO)
    var BL = new Bl();
    BL.AGENT_CODE = this._commonService.getUserCode();
    BL.BL_NO = BLNO;
    this._blService.getBLDetails(BL).subscribe((res: any) => {
      BL.ORG_CODE = res.Data.DESTINATION_AGENT_CODE
      BL.PORT = res.Data.FINAL_DESTINATION
      this.listForm.get('BL_NO')?.setValue(BLNO)
      this.listForm.get('SHIPPER_NAME')?.setValue(res.Data.SHIPPER)
      // this.listForm.get('BILL_TO')?.setValue(res.Data.SHIPPER)

     },(error:any)=>{

      },()=>{

         this._InvoiceService.GetInvoiceBLDetails(BL).subscribe((res: any) => {
        console.log("GetInvoiceBLDetails =>", res)
        this.containerDropdownList = res.Data.CONTAINERS
        this.listForm.get('BILL_FROM')?.setValue(res.Data.ORG_NAME)
        this.listForm.get('BILL_FROM')?.setValue(res.Data.ORG_ADDRESS1)
        const add = this.listForm.get("BL_LIST") as FormArray
        add.clear();
        if (this.value == 'FREIGHT') {
          res.Data.FREIGHT.forEach((element: any) => {
                      console.log("element", element)
                      add.push(this._formBuilder.group({
                        ID: [0],
                        CHARGE_NAME: [element.CHARGE_CODE],
                        EXCHANE_RATE: [element.EXCHANE_RATE],
                        QUANTITY: [0],
                        AMOUNT: [0],
                        HSN_CODE: [element.HSN_CODE],
                        REQUESTED_AMOUNT: [element.RATE_REQUESTED],
                        CURRENCY: [element.CURRENCY],
                        EXEMPT_FLAG: [element.EXEMPT_FLAG],
                        IS_SRRCHARGE: [true],
                        TAX:[''],
                        IGST:[''],
                        SGST:[''],
                        CGST:[''],
                        TAX_AMOUNT:[''],
                        TOTAL_AMOUNT:['']

                      })
                      )

                    })
              } else if (this.value == 'POD') {

              res.Data.POD.forEach((element: any) => {
            console.log("element", element)
            add.push(this._formBuilder.group({
              ID: [0],
              CHARGE_NAME: [element.CHARGE_CODE],
              EXCHANE_RATE: [element.EXCHANE_RATE],
              QUANTITY: [0],
              AMOUNT: [0],
              HSN_CODE: [element.HSN_CODE],
              REQUESTED_AMOUNT: [element.RATE_REQUESTED],
              CURRENCY: [element.CURRENCY],
              EXEMPT_FLAG: [element.EXEMPT_FLAG],
              IS_SRRCHARGE: [true],
              TAX:[''],
              IGST:[''],
              SGST:[''],
              CGST:[''],
              TAX_AMOUNT:[''],
              TOTAL_AMOUNT:['']

            })
            )
          })

        } else if (this.value == 'POL') {

          res.Data.POL.forEach((element: any) => {
            console.log("element", element)
            add.push(this._formBuilder.group({
              ID: [0],
              CHARGE_NAME: [element.CHARGE_CODE],
              EXCHANE_RATE: [element.EXCHANE_RATE],
              QUANTITY: [0],
              AMOUNT: [0],
              HSN_CODE: [element.HSN_CODE],
              REQUESTED_AMOUNT: [element.RATE_REQUESTED],
              CURRENCY: [element.CURRENCY],
              EXEMPT_FLAG: [element.EXEMPT_FLAG],
              IS_SRRCHARGE: [true],
              TAX:[''],
              IGST:[''],
              SGST:[''],
              CGST:[''],
              TAX_AMOUNT:[''],
              TOTAL_AMOUNT:['']

                }));
            });
        }

      });

  });
}


Delete(){

}
}






  //  get SRR Details
    // this._blService.getSRRDetails(BL).subscribe((res:any)=>{
    //   console.log("srr details",res.Data)
    //   const add = this.listForm.get("BL_LIST") as FormArray
    //   add.clear();
    //   res.Data.SRR_RATES.forEach((element:any) => {
    //     console.log("element", element)
    //     add.push(this._formBuilder.group({
    //     ID:[0],
    //     CHARGE_NAME: [element.CHARGE_CODE],
    //     EXCHANE_RATE: [element.EXCHANE_RATE],
    //     QUANTITY: [0],
    //     AMOUNT: [0],
    //     HSN_CODE:[element.HSN_CODE],
    //     REQUESTED_AMOUNT: [0],
    //     CURRENCY: [element.CURRENCY],
    //     EXEMPT_FLAG: [element.EXEMPT_FLAG],
    //     IS_SRRCHARGE:[true],

    //   })
    //   )
    //   });
    // });
