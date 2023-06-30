import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import { PartyService } from 'src/app/services/party.service';

import { PARTY } from 'src/app/models/party';
import { MASTER } from 'src/app/models/master';
import { Bl } from 'src/app/models/bl';
import { InvoiceService } from 'src/app/services/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-list2',
  templateUrl: './invoice-list2.component.html',
  styleUrls: ['./invoice-list2.component.scss'],
})
export class InvoiceList2Component implements OnInit {
  listForm: FormGroup;
  containerForm: FormGroup;
  submitted: boolean = false;
  CurrencyList: any[] = [];
  ChargeMasterList: any[] = [];
  BillFromList: any[] = [];
  containerDropdownList: any[] = [];
  AddressList: any[] = [];
  BLNO: string = '';
  blno: any;
  data: any;
  ORG_CODE: string = '';
  PORT: string = '';
  value: any;
  currentDate: any;
  POL: boolean = false;
  dropdownSettings = {};
  master: MASTER = new MASTER();
  customer: PARTY = new PARTY();
  symbol: string;
  container: any[] = [];
  containerResult: any;
  total: any;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _blService: BlService,
    private _commonService: CommonService,
    private _InvoiceService: InvoiceService
  ) {}

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
      INVOICE_DATE: [''],
      CONTAINER_NO: [],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      ADDRESS: [''],
      BRANCH_ID: [0],
      STATUS: ['PROFORMA'],
      TOTAL_CONTAINER: [''],
      CONTAINER_LIST1: new FormControl(
        this.containerDropdownList,
        Validators.required
      ),
      CONTAINER_LIST: new FormArray([]),
      BL_LIST: new FormArray([]),
    });

    var BLNO = this.route.snapshot.paramMap.get('BL_NO');
    console.log('BLNO', BLNO);
    this.listForm.get('BL_NO')?.setValue(BLNO);

    this.getDropdown();
    this.Submit(BLNO);

    this.listForm.get('INVOICE_TYPE')?.setValue(localStorage.getItem('value'));
    this.value = localStorage.getItem('value');
    if (this.value == 'POL') {
      this.POL = true;
    } else if (this.value == 'FREIGHT') {
      this.POL = true;
    } else {
      this.POL = false;
    }

    // To set Inovice type
    if (this.value == 'FREIGHT') {
      this.listForm
        .get('INVOICE_TYPE')
        ?.setValue(localStorage.getItem('value'));
    } else {
      this.listForm.get('INVOICE_TYPE')?.setValue('LOCAL');
    }

    // get current Date
    this.currentDate = this._commonService.getcurrentDate(new Date());
    this.listForm.get('INVOICE_DATE')?.setValue(this.currentDate);
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
        this.CurrencyList = res.Data;
      }
    });

    // Get Invoice Charge
    this._commonService
      .getDropdownData('INVOICE_CHARGE')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.ChargeMasterList = res.Data;
        }
      });

    // Get Cutomer Name Bill_To
    this._commonService
      .getDropdownData('CUSTOMER_NAME')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.BillFromList = res.Data;
        }
      });

    this._commonService.getDropdownData('ADDRESS').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.AddressList = res.Data;
      }
    });
  }

  getAddress(address: any, BranchId: any) {
    this.listForm.get('ADDRESS').setValue(address);
    this.listForm.get('BRANCH_ID').setValue(BranchId);
    // console.log("address", address)
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
        TAX: [''],
        IGST: [''],
        SGST: [''],
        CGST: [''],
        TAX_AMOUNT: [''],
        TAXAMNT: [''],
        TOTAL_AMOUNT: [''],
      })
    );
  }

  // submit form final
  SubmitList() {
    // this.submitted = true;
    // if (this.listForm.invalid) {
    //   return;
    // }
    this.listForm
      .get('INVOICE_NO')
      .setValue(this._commonService.getRandomNumber('INV'));
    this.listForm.get('AGENT_NAME').setValue(this._commonService.getUserName());
    this.listForm.get('AGENT_CODE').setValue(this._commonService.getUserCode());

    this._InvoiceService
      .InsertInvoice(JSON.stringify(this.listForm.value))
      .subscribe((res: any) => {
        console.log('response is here =>', res);
        if (res.responseCode == 200) {
          this._commonService.successMsg('Invoice saved Successfully !');
          this._router.navigateByUrl('/home/operations/new-invoice');
        }
      });
  }

  saveContainer(event: any, value = 0) {
    var containerList = this.listForm.get('CONTAINER_LIST1')?.value;
    const add = this.listForm.get('CONTAINER_LIST') as FormArray;

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

    const add1 = this.listForm.get('BL_LIST') as FormArray;

    add1.controls.forEach((element) => {
      if (element.get('CHARGE_TYPE').value == 'BL') {
        element.get('QUANTITY').setValue(1);
      } else {
        element.get('QUANTITY').setValue(add.length);
      }

      element
        .get('AMOUNT')
        .setValue(
          element.get('QUANTITY').value * element.get('APPROVED_RATE').value
        );
      element
        .get('TAX_AMOUNT')
        .setValue(
          element.get('QUANTITY').value * element.get('APPROVED_RATE').value
        );

      var tax =
        (element.get('TAX_AMOUNT').value * element.get('TAX').value) / 100;
      element.get('TAXAMNT').setValue(tax);
      element
        .get('TOTAL_AMOUNT')
        .setValue(
          element.get('QUANTITY').value * element.get('APPROVED_RATE').value +
            tax
        );
    });
  }

  getTaxableAmount(event: any, index: any) {
    const add1 = this.listForm.get('BL_LIST') as FormArray;

    if (event.target.value == '') {
      event.target.value = 1;
    }

    add1
      .at(index)
      .get('TAX_AMOUNT')
      .setValue(
        add1.at(index).get('QUANTITY').value *
          add1.at(index).get('APPROVED_RATE').value *
          event.target.value
      );

    var tax =
      (add1.at(index).get('TAX_AMOUNT').value *
        add1.at(index).get('TAX').value) /
      100;

    add1.at(index).get('TAXAMNT').setValue(tax);
    add1
      .at(index)
      .get('TOTAL_AMOUNT')
      .setValue(add1.at(index).get('TAX_AMOUNT').value + tax);
  }

  Submit(BLNO: any) {
    console.log(BLNO);
    var BL = new Bl();
    BL.AGENT_CODE = this._commonService.getUserCode();
    BL.BL_NO = BLNO;
    this._blService.getBLDetails(BL).subscribe(
      (res: any) => {
        console.log('get bl details', res);
        BL.ORG_CODE = this._commonService.getUserOrgCode();
        BL.PORT = this._commonService.getUserPort();
        this.listForm.get('BL_NO')?.setValue(BLNO);
        this.listForm.get('SHIPPER_NAME')?.setValue(res.Data.SHIPPER);
        // this.listForm.get('SHIPPER_NAME')?.setValue(res.Data.CONSIGNEE)
      },
      (error: any) => {},
      () => {
        this._InvoiceService.GetInvoiceBLDetails(BL).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this.containerDropdownList = res.Data.CONTAINERS;
            this.AddressList = res.Data.BRANCH;
            this.listForm.get('BILL_FROM')?.setValue(res.Data.ORG_NAME);
            this.listForm.get('BILL_FROM')?.setValue(res.Data.ORG_ADDRESS1);
            const add = this.listForm.get('BL_LIST') as FormArray;
            add.clear();
            if (this.value == 'FREIGHT') {
              res.Data.FREIGHT.forEach((element: any) => {
                add.push(
                  this._formBuilder.group({
                    ID: [0],
                    CHARGE_NAME: [element.CHARGE_CODE],
                    EXCHANE_RATE: [element.EXCHANE_RATE],
                    QUANTITY: [0],
                    APPROVED_RATE: [element.APPROVED_RATE],
                    AMOUNT: [element.APPROVED_RATE],
                    HSN_CODE: [element.HSN_CODE],
                    REQUESTED_AMOUNT: [element.RATE_REQUESTED],
                    CURRENCY: [element.CURRENCY],
                    EXEMPT_FLAG: [element.EXEMPT_FLAG],
                    IS_SRRCHARGE: [true],
                    TAX: [element.RATE],
                    IGST: [element.IGST],
                    SGST: [element.SGST],
                    CGST: [element.CGST],
                    TAX_AMOUNT: [element.APPROVED_RATE],
                    TAXAMNT: [(element.APPROVED_RATE * element.RATE) / 100],
                    TOTAL_AMOUNT: [''],
                    CHARGE_TYPE: [element.CHARGE_TYPE],
                  })
                );
              });
            } else if (this.value == 'POD') {
              res.Data.POD.forEach((element: any) => {
                add.push(
                  this._formBuilder.group({
                    ID: [0],
                    CHARGE_NAME: [element.CHARGE_CODE],
                    EXCHANE_RATE: [element.EXCHANE_RATE],
                    QUANTITY: [0],
                    APPROVED_RATE: [element.APPROVED_RATE],
                    AMOUNT: [element.APPROVED_RATE],
                    HSN_CODE: [element.HSN_CODE],
                    REQUESTED_AMOUNT: [element.RATE_REQUESTED],
                    CURRENCY: [element.CURRENCY],
                    EXEMPT_FLAG: [element.EXEMPT_FLAG],
                    IS_SRRCHARGE: [true],
                    TAX: [element.RATE],
                    IGST: [element.IGST],
                    SGST: [element.SGST],
                    CGST: [element.CGST],
                    TAX_AMOUNT: [element.APPROVED_RATE],
                    TAXAMNT: [(element.APPROVED_RATE * element.RATE) / 100],
                    TOTAL_AMOUNT: [''],
                    CHARGE_TYPE: [element.CHARGE_TYPE],
                  })
                );
              });
            } else if (this.value == 'POL') {
              res.Data.POL.forEach((element: any) => {
                add.push(
                  this._formBuilder.group({
                    ID: [0],
                    CHARGE_NAME: [element.CHARGE_CODE],
                    EXCHANE_RATE: [element.EXCHANE_RATE],
                    QUANTITY: [0],
                    APPROVED_RATE: [element.APPROVED_RATE],
                    AMOUNT: [element.APPROVED_RATE],
                    HSN_CODE: [element.HSN_CODE],
                    REQUESTED_AMOUNT: [element.RATE_REQUESTED],
                    CURRENCY: [element.CURRENCY],
                    EXEMPT_FLAG: [element.EXEMPT_FLAG],
                    IS_SRRCHARGE: [true],
                    TAX: [element.RATE],
                    IGST: [element.IGST],
                    SGST: [element.SGST],
                    CGST: [element.CGST],
                    TAX_AMOUNT: [element.APPROVED_RATE],
                    TAXAMNT: [(element.APPROVED_RATE * element.RATE) / 100],
                    TOTAL_AMOUNT: [''],
                    CHARGE_TYPE: [element.CHARGE_TYPE],
                  })
                );
              });
            }
          }
        });
      }
    );
  }

  Delete(ID: number) {
    console.log(ID);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._InvoiceService.DeleteInvoice(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
          }
        });
      }
    });
  }

  deleteBranch(i: number) {
    const add = this.listForm.get('BL_LIST') as FormArray;
    add.removeAt(i);
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

// bind to qty and selection conatiner

// if(value == 1){
//   this.containerResult = event.length
//   console.log("container 1",event.length)
//   const add = this.listForm.get('BL_LIST') as FormArray;
//   for (var j = 0; j < add.length; j++) {
//     add.at(j)?.get('QUANTITY')?.setValue(this.containerResult)
//     this.total = this.listForm.get('TOTAL_CONTAINER').setValue(this.containerResult);
//   }

// }
// else if(event.length == 0){
//   this.containerResult = 0;
//   const add = this.listForm.get('BL_LIST') as FormArray;
//   for (var j = 0; j < add.length; j++) {
//     add.at(j)?.get('QUANTITY')?.setValue(this.containerResult)
//     this.total = this.listForm.get('TOTAL_CONTAINER').setValue(this.containerResult);
//   }

// }else{
//   this.containerResult = containerList.length
//   const add = this.listForm.get('BL_LIST') as FormArray;
//   for (var j = 0; j < add.length; j++) {
//     add.at(j)?.get('QUANTITY')?.setValue(this.containerResult)
//     this.total = this.listForm.get('TOTAL_CONTAINER').setValue(this.containerResult);
//   }

// }

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
