import {Component, OnInit} from '@angular/core';
import {LedgerService} from "../services/ledger.service";
import {UserService} from "../services/user.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Location} from '@angular/common';
import {ExposureService} from "../services/exposure.service";

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css'],
})
export class LedgerComponent implements OnInit {
  panelOpenState = false;
  user_balance: any;
  FilterForm:any;
  submitted = false;
  type_filter: string = 'all';

  ledger_data: any = [];
  casino_ledger_data: any = [];
  updated_ledger_data: any = [];
  updated_casino_ledger_data: any = [];
  user_id = localStorage.getItem('user_id');
  exposure: any = [];

  constructor(private fb: FormBuilder,private ledgerService: LedgerService, private userService: UserService, private _location: Location, private exposureService: ExposureService) {
  }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      typefilter: [],
      from: [new Date().toISOString().substring(0, 10), Validators.required],
      to: [new Date().toISOString().substring(0, 10), Validators.required],
    });
    const currentDate = new Date();
    const threeDaysBefore = new Date();
    threeDaysBefore.setDate(currentDate.getDate() - 3);
    this.FilterForm.get('from').setValue(threeDaysBefore.toISOString().substring(0, 10));
    this.getExposureDetails();
  }

  get filterFormControl() {
    return this.FilterForm.controls;
  }

  daysDiff(start:any,end:any) {
    let start_date = new Date(start);
    let end_date = new Date(end);
    const startUTC = Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
    const endUTC = Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate());

    const diffInMs = endUTC - startUTC;
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  filter () {
    this.updated_casino_ledger_data=[];
    const days = this.daysDiff(this.FilterForm.value.from,this.FilterForm.value.to);
    const typefilter = this.FilterForm.value.typefilter;
    if(typefilter=='casino' || typefilter=='all'){
      this.getCasinoLedgerDataByDays(days)
      }
        this.getLedgerDataByDays(days);
  }

  getLedgerDataByDays(days: any) {
    const typefilter = this.FilterForm.value.typefilter;

      this.ledgerService.getLedgerByDays(Number(days)).subscribe((res: any) => {
          this.ledger_data = res;
          let ledgerData: any = [];
          this.userService.getUserBalance(this.user_id).subscribe((res: any) => {
              this.user_balance = res;
              let new_limit = this.user_balance.balance;
              
              for (let i = 0; i < this.ledger_data.length; i++) {
                  const item = this.ledger_data[i];
                  // console.log(item.subtype)
                  // console.log(item.description)
                  if (
                      (typefilter === 'all') ||
                      (typefilter === 'sports' && item.subtype !== 'casino' && item.subtype !== 'deposit' && item.subtype !== 'withdraw') ||
                      (typefilter === 'casino' && item.description === 'casino') ||
                      (typefilter === 'deposit' && (item.subtype === 'deposit' || item.subtype === 'withdraw'))
                  ) {
                      const old_limit = new_limit - item.profit_loss;
                      ledgerData.push({ ...item, old_limit: old_limit, new_limit: new_limit });
                      new_limit = old_limit;
                  }
              }
              this.updated_ledger_data = ledgerData;
              console.log(this.updated_ledger_data)
          });
      });
  }

  backClicked(){
    this._location.back();
  }
  getCasinoLedgerDataByDays(days: any) {
    this.ledgerService.getCasinoLedgerByDays(Number(days)).subscribe((res: any) => {
      this.casino_ledger_data = res;
      let casinoData : any=[];
      this.userService.getUserBalance(this.user_id).subscribe((res: any) => {
        this.user_balance = res;
        let new_limit = this.user_balance.balance+this.exposure;
        for (let i = 0; i <this.casino_ledger_data.length ; i++) {
          const items = this.casino_ledger_data[i];
          const old_limit = new_limit - this.casino_ledger_data[i].profit_loss;
          casinoData.push({...items, old_limit: old_limit,new_limit:new_limit});
          new_limit = old_limit;
        }
      });
      this.updated_casino_ledger_data=casinoData
      // casinoData = this.casino_ledger_data
      console.log(this.updated_casino_ledger_data)
    })
  }

  getExposureDetails() {
    this.exposureService.getExposure().subscribe((data: any) => {
        this.exposure = data[0].exp_amount;
    }, (error) => {
      this.exposure = [];
    })
  }
}
