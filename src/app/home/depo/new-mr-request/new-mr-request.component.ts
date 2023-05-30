import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CONTAINER } from 'src/app/models/container';
import { ContainerService } from 'src/app/services/container.service';
import { locale as english } from 'src/app/@core/translate/mnr/en';
import { locale as hindi } from 'src/app/@core/translate/mnr/hi';
import { locale as arabic } from 'src/app/@core/translate/mnr/ar';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { DepoService } from 'src/app/services/depo.service';
import { Mr } from 'src/app/models/mr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-mr-request',
  templateUrl: './new-mr-request.component.html',
  styleUrls: ['./new-mr-request.component.scss'],
})
export class NewMrRequestComponent implements OnInit {
  containerNo: string = '';
  containerDetails: any;
  submitted: boolean = false;
  submitted1: boolean = false;
  isRecords: boolean = true;
  componentList: any[] = [];
  damageList: any[] = [];
  repairList: any[] = [];
  lengthList: any[] = [];
  widthList: any[] = [];
  heightList: any[] = [];
  quantityList: any[] = [];
  images: any[] = [];
  imageUploads: any[] = [];
  mrForm: FormGroup;
  mrModalForm: FormGroup;
  isLoading: boolean = false;
  depoName: string = '';

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _containerService: ContainerService,
    private _commonService: CommonService,
    private _depoService: DepoService,
    private _router: Router,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.depoName = this._commonService.getUser().depo;
    this.mrForm = this._formBuilder.group({
      MR_LIST: new FormArray([]),
    });

    this.mrModalForm = this._formBuilder.group({
      LOCATION: ['', Validators.required],
      COMPONENT: ['', Validators.required],
      DAMAGE: ['', Validators.required],
      REPAIR: ['', Validators.required],
      UNIT: ['', Validators.required],
      RESPONSIBILITY: ['', Validators.required],
      LENGTH: ['', Validators.required],
      WIDTH: ['', Validators.required],
      HEIGHT: ['', Validators.required],
    });

    this.getDropdown();
  }

  get f() {
    var x = this.mrForm.get('MR_LIST') as FormArray;
    return x.controls;
  }

  get f1() {
    return this.mrModalForm.controls;
  }

  openMrModal() {
    this.submitted1 = false;
    this.mrModalForm.reset();
    this.mrModalForm.get('COMPONENT').setValue('');
    this.mrModalForm.get('DAMAGE').setValue('');
    this.mrModalForm.get('REPAIR').setValue('');
    this.mrModalForm.get('UNIT').setValue('');
    this.mrModalForm.get('RESPONSIBILITY').setValue('');
    this.mrModalForm.get('LENGTH').setValue('');
    this.mrModalForm.get('WIDTH').setValue('');
    this.mrModalForm.get('HEIGHT').setValue('');
    this.openBtn.nativeElement.click();
  }

  getDropdown() {
    this._commonService.getDropdownData('COMPONENT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.componentList = res.Data;
      }
    });

    this._commonService.getDropdownData('DAMAGE').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.damageList = res.Data;
      }
    });
  }

  getRepairMaster(componentvalue: any) {
    this.repairList = [];
    this.lengthList = [];
    this.widthList = [];
    this.quantityList = [];
    this.mrModalForm.get('REPAIR').setValue('');
    this.mrModalForm.get('LENGTH').setValue('');
    this.mrModalForm.get('WIDTH').setValue('');
    this.mrModalForm.get('HEIGHT').setValue('');
    this.mrModalForm.get('UNIT').setValue('');
    this._commonService
      .getDropdownData(
        'REPAIR',
        '',
        componentvalue,
        this._commonService.getUser().depo
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.repairList = res.Data;
          this.GetMeasurementList(componentvalue);
        }
      });
  }

  GetMeasurementList(component: any = '', repair: any = '') {
    this.lengthList = [];
    this.widthList = [];
    this.quantityList = [];
    this.mrModalForm.get('LENGTH').setValue('');
    this.mrModalForm.get('WIDTH').setValue('');
    this.mrModalForm.get('HEIGHT').setValue('');
    this.mrModalForm.get('UNIT').setValue('');
    component =
      component == '' ? this.mrModalForm.get('COMPONENT').value : component;
    var depocode = this._commonService.getUser().depo;
    this._commonService
      .getDropdownData('MNR_LENGTH', '', component, depocode, repair)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          debugger;
          this.lengthList = res.Data;
        }
      });
    this._commonService
      .getDropdownData('MNR_WIDTH', '', component, depocode, repair)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.widthList = res.Data;
        }
      });
    this._commonService
      .getDropdownData('MNR_HEIGHT', '', component, depocode, repair)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.heightList = res.Data;
        }
      });

    this._commonService
      .getDropdownData('MNR_QUANTITY', '', component, depocode, repair)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.quantityList = res.Data;
        }
      });
  }

  getContainerDetails() {
    this.submitted = true;
    if (this.containerNo == '') {
      return;
    }
    this.isRecords = false;
    this._commonService.destroyDT();
    var container = new CONTAINER();
    container.CONTAINER_NO = this.containerNo;
    this._containerService
      .GetContainerMasterDetails(container)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.isRecords = true;
          this.containerDetails = res.Data;
        } else {
          this.isRecords = false;
        }

        this._commonService.getDT();
      });
  }

  addRequest() {
    this.submitted1 = true;
    if (this.mrModalForm.invalid) {
      return;
    }

    var mr = new Mr();

    const add = this.mrForm.get('MR_LIST') as FormArray;
    mr.COMPONENT = this.mrModalForm.get('COMPONENT').value;
    mr.REPAIR = this.mrModalForm.get('REPAIR').value;
    mr.LENGTH = this.mrModalForm.get('LENGTH').value;
    mr.WIDTH = this.mrModalForm.get('WIDTH').value;
    mr.HEIGHT = this.mrModalForm.get('HEIGHT').value;
    mr.QUANTITY = this.mrModalForm.get('UNIT').value;
    mr.DEPO_CODE = this._commonService.getUser().depo;

    this._depoService.getMNRTariff(mr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        add.push(
          this._formBuilder.group({
            MR_NO: [''],
            CONTAINER_NO: [this.containerNo],
            LOCATION: [this.mrModalForm.value.LOCATION],
            COMPONENT: [this.mrModalForm.value.COMPONENT],
            DAMAGE: [this.mrModalForm.value.DAMAGE],
            REPAIR: [this.mrModalForm.value.REPAIR],
            DESC: [''],
            LENGTH: [this.mrModalForm.value.LENGTH],
            WIDTH: [this.mrModalForm.value.WIDTH],
            HEIGHT: [this.mrModalForm.value.HEIGHT],
            UNIT: [this.mrModalForm.value.UNIT],
            RESPONSIBILITY: [this.mrModalForm.value.RESPONSIBILITY],
            MAN_HOUR: [res.Data.MAN_HOUR],
            LABOUR: [res.Data.LABOUR_CHARGE],
            MATERIAL: [res.Data.MATERIAL_COST],
            TOTAL: [res.Data.TOTAL],
            TAX: [0],
            FINAL_TOTAL: [0],
            REMARKS: [''],
          })
        );
      } else {
        this._commonService.errorMsg(
          'Sorry ! Currently No tariff is present for this Depo <br> MnR Request cannot be added !'
        );
      }
      this.closeBtn.nativeElement.click();
    });
  }

  removeItem(i: any) {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    add.removeAt(i);
  }

  LabourCount(index: number) {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var mh = add.at(index)?.get('MAN_HOUR')?.value;
    var totalAmount = +mh * 60;
    add
      .at(index)
      ?.get('LABOUR')
      ?.setValue(Math.round(totalAmount * 100) / 100);
  }

  ManHourSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      var mh = add.at(i)?.get('MAN_HOUR')?.value;
      totalAmount += +mh;
    }
    return Math.round(totalAmount * 100) / 100;
  }

  LabourSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      var labour = add.at(i)?.get('LABOUR')?.value;
      totalAmount += +labour;
    }
    return Math.round(totalAmount * 100) / 100;
  }

  MaterialSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      var material = add.at(i)?.get('MATERIAL')?.value;
      totalAmount += +material;
    }
    return Math.round(totalAmount * 100) / 100;
  }

  TotalSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      totalAmount += +add.at(i)?.get('TOTAL')?.value;
    }
    return Math.round(totalAmount * 100) / 100;
  }

  TotalFreshDamageSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      if (add.at(i)?.get('RESPONSIBILITY')?.value != 'O') {
        totalAmount += +add.at(i)?.get('TOTAL')?.value;
      }
    }
    return Math.round(totalAmount * 100) / 100;
  }

  TotalWTSum() {
    const add = this.mrForm.get('MR_LIST') as FormArray;
    var totalAmount = 0;
    for (var i = 0; i < add.length; i++) {
      if (add.at(i)?.get('RESPONSIBILITY')?.value == 'O') {
        totalAmount += +add.at(i)?.get('TOTAL')?.value;
      }
    }
    return Math.round(totalAmount * 100) / 100;
  }

  TaxTotal() {
    var total = this.TotalSum();
    return Math.round(total * 18) / 100;
  }

  FinalTotal() {
    var totalAmount = 0;
    totalAmount += +this.TotalSum() + +this.TaxTotal();
    return Math.round(totalAmount * 100) / 100;
  }

  fileUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.images.push(event.target.result);

          this.mrForm.patchValue({
            fileSource: this.images,
          });
        };

        reader.readAsDataURL(event.target.files[i]);
        this.imageUploads.push(event.target.files[i]);
      }
    }
  }

  uploadFilestoDB(MR: string) {
    const payload = new FormData();
    this.imageUploads.forEach((element: any) => {
      payload.append('formFile', element);
    });

    this._depoService.uploadFiles(payload, MR).subscribe();
  }

  submitRequest() {
    if (this.images.length == 0) {
      this._commonService.warnMsg('Please Upload atleast 1 Container Image');
      return;
    }

    this.isLoading = true;
    var mrList = this.mrForm.get('MR_LIST');
    var mrNo = this._commonService.getRandomNumber('MR');
    for (var i = 0; i < mrList?.value.length; i++) {
      this.mrForm.value.MR_LIST[i].CONTAINER_NO = this.containerNo;
      this.mrForm.value.MR_LIST[i].TAX = this.TaxTotal();
      this.mrForm.value.MR_LIST[i].FINAL_TOTAL = this.FinalTotal();
      this.mrForm.value.MR_LIST[i].MR_NO = mrNo;
      this.mrForm.value.MR_LIST[i].DEPO_CODE =
        this._commonService.getUserCode();
      this.mrForm.value.MR_LIST[i].CREATED_BY =
        this._commonService.getUserName();
    }

    var MR = this.mrForm.value.MR_LIST[0].MR_NO;

    this._depoService
      .createMRRequest(JSON.stringify(mrList?.value))
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res.responseCode == 200) {
          this.uploadFilestoDB(MR);
          this._commonService.successMsg(
            'Your MnR request is submitted successfully <br> MnR No is ' + mrNo
          );
          this._router.navigateByUrl('/home/depo/mr-request-list');
        }
      });
  }

  removeFile(url: any) {
    this.images = this.images.filter((a) => a !== url);
  }
}
