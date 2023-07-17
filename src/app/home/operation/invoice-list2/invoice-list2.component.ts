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
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-invoice-list2',
  templateUrl: './invoice-list2.component.html',
  styleUrls: ['./invoice-list2.component.scss'],
})
export class InvoiceList2Component implements OnInit {
  listForm: FormGroup;
  containerForm: FormGroup;
  submitted: boolean = false;
  isUpdate:boolean = false;
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
  container: any[] = [];
  total: any;
  selectedItems: any[] = [];
  BankAccList: any[] =[];

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
      INVOICE_ID: [0],
      INVOICE_NO: [''],
      INVOICE_TYPE: [''],
      BILL_TO: ['',Validators.required],
      BILL_FROM: [''],
      SHIPPER_NAME: [''],
      PAYMENT_TERM: [''],
      BL_NO: [''],
      INVOICE_DATE: [''],
      CONTAINER_NO: [],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      ADDRESS: ['',Validators.required],
      BRANCH_ID: [0],
      STATUS: ['PROFORMA'],
      TOTAL_CONTAINER: [''],
      CONTAINER_LIST1: new FormControl(
        this.containerDropdownList,
        Validators.required
      ),
      CONTAINER_LIST: new FormArray([]),
      BL_LIST: new FormArray([]),
      CONTAINERS: [''],
      SHIPPER_REF: [''],
      REMARKS: [''],
      IS_TAX:[''],
      BANCK_ACC:['', Validators.required]
    });

    var BLNO = this.route.snapshot.paramMap.get('BL_NO');
    this.listForm.get('BL_NO')?.setValue(BLNO);

    this.getDropdown();

    this.value = localStorage.getItem('value');
    this.listForm.get('INVOICE_TYPE')?.setValue(localStorage.getItem('value'));
    this.listForm.get('INVOICE_ID')?.setValue(localStorage.getItem('INVOICE_ID'));

    if (localStorage.getItem('INVOICE_ID') == '0') {
      this.Submit(BLNO);
    } else {
      this.getInvoiceDetails(+localStorage.getItem('INVOICE_ID'));
    }

    if (this.value == 'POL' || this.value == 'FREIGHT') {
      this.POL = true;
      this.listForm.get('PAYMENT_TERM')?.setValue('PREPAID')
    } else {
      this.POL = false;
      this.listForm.get('PAYMENT_TERM')?.setValue('COLLECT')

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

  getAddress(address: any, BranchId: any, isTax:any, event:any) {
    this.listForm.get('ADDRESS').setValue(address);
    this.listForm.get('BRANCH_ID').setValue(BranchId);
    this.listForm.get('IS_TAX').setValue(isTax)
    const add1 = this.listForm.get('BL_LIST') as FormArray;
    if(!isTax && event.target.checked){
      add1.controls.forEach(element => {
        element.get('TAX_AMOUNT').setValue(0)
        element.get('TOTAL_AMOUNT').setValue(element.get('QUANTITY').value * element.get('APPROVED_RATE').value + element.get('TAX_AMOUNT').value);
        element.get('TOTAL_AMOUNT').setValue(element.get('TAXABLE_AMOUNT').value + element.get('TAX_AMOUNT').value);
      });
    }
    else{      
      add1.controls.forEach(element => {
        element.get('TAX_AMOUNT').setValue(+element.get('APPROVED_RATE').value * +element.get('RATE_PER').value / 100)
        element.get('TOTAL_AMOUNT').setValue(element.get('QUANTITY').value * element.get('APPROVED_RATE').value + element.get('TAX_AMOUNT').value);
        element.get('TOTAL_AMOUNT').setValue(element.get('TAXABLE_AMOUNT').value + element.get('TAX_AMOUNT').value);
      });
    }    
  }

  // add new row
  addRow() {
    this.submitted = true;
    if (this.listForm.invalid) {
      return;
    }
    const add = this.listForm.get('BL_LIST') as FormArray;

    add.push(
      this._formBuilder.group({
        ID: [0],
        CHARGE_NAME: ['', Validators.required],
        EXCHANGE_RATE: [''],
        QUANTITY: ['', Validators.required],
        AMOUNT: [''],
        HSN_CODE: ['', Validators.required],
        APPROVED_RATE: [''],
        CURRENCY: ['', Validators.required],
        EXEMPT_FLAG: ['', Validators.required],
        IS_SRRCHARGE: [false],
        RATE_PER: [''],
        IGST: [''],
        SGST: [''],
        CGST: [''],
        TAXABLE_AMOUNT: [''],
        TAX_AMOUNT: [''],
        TOTAL_AMOUNT: [''],
      })
    );
  }

  // submit form final
  SubmitList() {
    this.submitted = true;
    this.isUpdate = false
    if (this.listForm.invalid) {
      return;
    }

    this.listForm.get('AGENT_NAME').setValue(this._commonService.getUserName());
    this.listForm.get('AGENT_CODE').setValue(this._commonService.getUserCode());
    const add = this.listForm.get('CONTAINER_LIST') as FormArray;
    var cl = '';
    add.value.forEach((element: any) => {
      cl += element.CONTAINER_NO + ',';
    });
    this.listForm.get('CONTAINERS').setValue(cl);
    const blList = this.listForm.get('BL_LIST') as FormArray
    blList.controls.forEach(element => {
      if(element.get('EXCHANGE_RATE').value == ''){
        element.get('EXCHANGE_RATE').setValue(0)
      }
    });
    console.log(JSON.stringify(this.listForm.value))
    // this._InvoiceService
    //   .InsertInvoice(JSON.stringify(this.listForm.value))
    //   .subscribe((res: any) => {
    //     if (res.responseCode == 200) {
    //       this._commonService.successMsg('Invoice saved Successfully !');
    //       this._router.navigateByUrl('/home/operations/new-invoice');
    //     }
    //   });
  }

  saveContainer(event: any, value = 0) {
    
      var containerList = this.listForm.get('CONTAINER_LIST1')?.value;
      const add = this.listForm.get('CONTAINER_LIST') as FormArray;
        if (value == 1) {
          debugger
          add.clear();
          event.forEach((element: any) => {
            add.push(
              this._formBuilder.group({
                CONTAINER_NO: [element.CONTAINER_NO],
              })
            );
          });
        } else if (value == 2) {
          debugger
          add.clear();
        } else {
          debugger
          var i = containerList.findIndex((x: any) => x.ID === event.ID);
          if (i == -1) {
            add.removeAt(
              add.value.findIndex(
                (m: { CONTAINER_NO: any }) => m.CONTAINER_NO === event.CONTAINER_NO
              )
            );
          } else {
            debugger
            add.push(
              this._formBuilder.group({
                CONTAINER_NO: [event.CONTAINER_NO],
              })
            );
          }
        }
    
        const add1 = this.listForm.get('BL_LIST') as FormArray;
    
        add1.controls.forEach((element) => {
          if (element.get('CHARGE_TYPE').value == 'BL' ) {
            element.get('QUANTITY').setValue(1);
          }else{ 
            element.get('QUANTITY').setValue(add.length);
             }
          element.get('AMOUNT').setValue(element.get('QUANTITY').value * element.get('APPROVED_RATE').value);
          var exchangeRate =element.get('EXCHANGE_RATE').value == '' ? 1 : element.get('EXCHANGE_RATE').value
          element.get('TAXABLE_AMOUNT').setValue(element.get('QUANTITY').value * element.get('APPROVED_RATE').value * exchangeRate);
    
          var tax = (element.get('TAXABLE_AMOUNT').value * element.get('RATE_PER').value) / 100;
          element.get('TAX_AMOUNT').setValue(this.listForm.get('IS_TAX').value ? tax : 0);
          element.get('TOTAL_AMOUNT').setValue(element.get('TAXABLE_AMOUNT').value + element.get('TAX_AMOUNT').value);
        });   
    }

  getTaxableAmount(event: any, index: any) {
    const add1 = this.listForm.get('BL_LIST') as FormArray;

    var exchangeRate = event.target.value == '' ? 1 : event.target.value
    
    add1.at(index).get('TAXABLE_AMOUNT').setValue(add1.at(index).get('QUANTITY').value * add1.at(index).get('APPROVED_RATE').value * exchangeRate);
    var tax = (add1.at(index).get('TAXABLE_AMOUNT').value * add1.at(index).get('RATE_PER').value) / 100;
    add1.at(index).get('TAX_AMOUNT').setValue(this.listForm.get('IS_TAX').value ? tax : 0);
    add1.at(index).get('TOTAL_AMOUNT').setValue(add1.at(index).get('TAXABLE_AMOUNT').value + add1.at(index).get('TAX_AMOUNT').value);
  }

  Submit(BLNO: any) {
    var BL = new Bl();
    BL.AGENT_CODE = this._commonService.getUserCode();
    BL.BL_NO = BLNO;
    this._blService.getBLDetails(BL).subscribe(
      (res: any) => {
        BL.ORG_CODE = this._commonService.getUserOrgCode();
        BL.PORT = this._commonService.getUserPort();
        this.listForm.get('BL_NO')?.setValue(BLNO);
        this.listForm.get('SHIPPER_NAME')?.setValue(res.Data.SHIPPER);
      },
      (error: any) => {},
      () => {
        this._InvoiceService.GetInvoiceBLDetails(BL).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this.containerDropdownList = [];
            this.containerDropdownList = res.Data.CONTAINERS;
            this.AddressList = [];
            this.AddressList = res.Data.BRANCH;
            this.BankAccList = [];
            this.BankAccList = res.Data.BANK
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
                    EXCHANGE_RATE: [''],
                    QUANTITY: [0],
                    APPROVED_RATE: [element.APPROVED_RATE],
                    AMOUNT: [element.APPROVED_RATE],
                    HSN_CODE: [element.HSN_CODE],
                    CURRENCY: [element.CURRENCY],
                    EXEMPT_FLAG: [element.EXEMPT_FLAG],
                    IS_SRRCHARGE: [true],
                    RATE_PER: [element.RATE],
                    IGST: [element.IGST],
                    SGST: [element.SGST],
                    CGST: [element.CGST],
                    TAXABLE_AMOUNT: [element.APPROVED_RATE],
                    TAX_AMOUNT: [(element.APPROVED_RATE * element.RATE) / 100],
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
                    EXCHANGE_RATE: [''],
                    QUANTITY: [0],
                    APPROVED_RATE: [element.APPROVED_RATE],
                    AMOUNT: [element.APPROVED_RATE],
                    HSN_CODE: [element.HSN_CODE],
                    CURRENCY: [element.CURRENCY],
                    EXEMPT_FLAG: [element.EXEMPT_FLAG],
                    IS_SRRCHARGE: [true],
                    RATE_PER: [element.RATE],
                    IGST: [element.IGST],
                    SGST: [element.SGST],
                    CGST: [element.CGST],
                    TAXABLE_AMOUNT: [element.APPROVED_RATE],
                    TAX_AMOUNT: [(element.APPROVED_RATE * element.RATE) / 100],
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
                    EXCHANGE_RATE: [''],
                    QUANTITY: [0],
                    APPROVED_RATE: [element.APPROVED_RATE],
                    AMOUNT: [element.APPROVED_RATE],
                    HSN_CODE: [element.HSN_CODE],
                    CURRENCY: [element.CURRENCY],
                    EXEMPT_FLAG: [element.EXEMPT_FLAG],
                    IS_SRRCHARGE: [true],
                    RATE_PER: [element.RATE],
                    IGST: [element.IGST],
                    SGST: [element.SGST],
                    CGST: [element.CGST],
                    TAXABLE_AMOUNT: [element.APPROVED_RATE],
                    TAX_AMOUNT: [(element.APPROVED_RATE * element.RATE) / 100],
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

  getInvoiceDetails(invoiceID: number) {
     this.isUpdate = true
     
     this._blService.getInvoiceDetailsNew(
        invoiceID,
        '',
        this._commonService.getUserPort(),
        this._commonService.getUserOrgCode()
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          
          this.listForm.patchValue(res.Data);
          this.listForm.get('INVOICE_DATE')?.setValue(formatDate(this.listForm.get('INVOICE_DATE')?.value,'yyyy-MM-dd','en'));
          this.containerDropdownList = [];
          this.containerDropdownList = res.Data.BL_CONTAINER_LIST;

          var x = this.listForm.get('CONTAINERS').value.split(',');
          var ss: any = [];
          x.forEach((element: any) => {
            if (element != '') {
              ss.push(this.containerDropdownList.filter(
                  (x) => x.CONTAINER_NO === element)[0]
              );
            }
          });
          this.selectedItems = ss;

          const add = this.listForm.get('BL_LIST') as FormArray;
          add.clear();

          res.Data.BL_LIST.forEach((element: any) => {
            add.push(this._formBuilder.group(element));           
             });

          this.AddressList = [];
          this.listForm.get('ADDRESS').setValue('')
          this.AddressList = res.Data.BRANCH;
        }
      });

  }

  // Delete(ID: number) {
  //   console.log("i",ID)

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //           this._InvoiceService.DeleteInvoice(ID).subscribe((res: any) => {
  //         if (res.ResponseCode == 200) {
  //           Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
  //         }
  //       });
  //     }
  //   });
  // }

  deleteBranch(i: number) {
    const add = this.listForm.get('BL_LIST') as FormArray;
    add.removeAt(i);
  }
}
