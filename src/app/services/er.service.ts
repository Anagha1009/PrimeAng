import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ER } from '../models/er';

@Injectable({
  providedIn: 'root',
})
export class ErService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  postERDetails(ER: any, isVessel: boolean) {
    return this._http.post<any>(
      this.BASE_URL + 'ER/InsertER?isVessel=' + isVessel,
      ER,
      this.httpOptions
    );
  }

  getERList(er: ER) {
    return this._http.get<any>(
      this.BASE_URL +
        'ER/GetERList?AGENT_CODE=' +
        er.AGENT_CODE +
        '&DEPO_CODE=' +
        er.DEPO_CODE +
        '&ORG_CODE=' +
        er.ORG_CODE +
        '&PORT=' +
        er.PORT,
      this.httpOptions
    );
  }

  getERDetails(erNo: any, orgcode: any, port: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ER/GetERDetails?REPO_NO=' +
        erNo +
        '&ORG_CODE=' +
        orgcode +
        '&PORT=' +
        port,
      this.httpOptions
    );
  }

  getERContainerDetails(erNo: any, agentCode: any, depoCode: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ER/GetERContainerDetails?REPO_NO=' +
        erNo +
        '&AGENT_CODE=' +
        agentCode +
        '&DEPO_CODE=' +
        depoCode,
      this.httpOptions
    );
  }

  getERRateDetails(erNo: any) {
    return this._http.get<any>(
      this.BASE_URL + 'ER/GetERRateDetails?REPO_NO=' + erNo,
      this.httpOptions
    );
  }
}
