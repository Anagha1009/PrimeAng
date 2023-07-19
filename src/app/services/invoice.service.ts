import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Bl, MergeBl } from '../models/bl';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  GetInvoiceBLDetails(BL: Bl) {
    return this._http.get<any>(
      this.BASE_URL +
        'Invoice/GetInvoiceBLDetails?ORG_CODE=' +
        BL.ORG_CODE +
        '&PORT=' +
        BL.PORT +
        '&BL_NO=' +
        BL.BL_NO,
      this.httpOptions
    );
  }

  InsertInvoice(data: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Invoice/InsertInvoice',
      data,
      this.httpOptions
    );
  }

  DeleteInvoice(ID: number) {
    return this._http.delete<any>(
      this.BASE_URL + 'Invoice/DeleteInvoice?ID=' + ID,
      this.httpOptions
    );
  }
  checkBL(BL_NO:any, INVOICE_TYPE:any){
    return this._http.post<any>(
      this.BASE_URL + 'Invoice/GetBLExists?INVOICE_TYPE=' +INVOICE_TYPE + 
      '&BL_NO=' + BL_NO,
       this.httpOptions)
  }
}
