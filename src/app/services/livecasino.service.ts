import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LiveCasinoService {

  constructor(private http: HttpClient) {
  }

  getVendorsRequests(): Observable<any> {
    //let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/casino/vendorlist");
  }

  getGamesByProviderRequests(provider:any): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/gamelist/"+provider);
  }

  getGamesUrlByidRequests(gameid:any): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/gameUrl/"+gameid);
  }

  activateAccountRequests(): Observable<any> {
    return this.http.get<any>(environment.base_url + "/casino/account-activation");
  }
}
