import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LedgerService {

  constructor(private http: HttpClient) {
  }

  getLedgerByDays(days: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-myledger/" + user_id + "/" + days);
  }
  getCasinoLedgerByDays(days: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-casinoledger/" + user_id + "/" + days);
  }
  getBonusLedgerByDays(days: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-myledger-bonus/" + user_id + "/" + days);
  }
}
