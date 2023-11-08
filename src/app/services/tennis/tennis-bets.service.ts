import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {ExposureService} from "../exposure.service";
import {UserService} from "../user.service";

@Injectable({
  providedIn: 'root'
})
export class TennisBetsService {
  private _RefreshTennisBets$ = new Subject<void>();

  constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService) {
  }

  get refreshTennisBets() {
    return this._RefreshTennisBets$;
  }

  addTennisBet(tennisbet_details: any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/add-tennisbet", tennisbet_details).pipe(tap(() => {
      this._RefreshTennisBets$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }

  getTennisBets(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/tennisbets-byevent/" + event_id + "/" + user_id);
  }

  getUserTennisBetsByEventId(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-tennisbet-byeventid-foruser/" + event_id + "/" + user_id);
  }

  getCloseBetsforTennis(days:any):Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-opentennisbets/" +user_id+ "/0/" + days);
  }

  getOpenBetsforTennis():Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-opentennisbets/" +user_id + '/1');
  }

}
