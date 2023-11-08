import {Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {BetslipComponent} from '../betslip/betslip.component';
import {ActivatedRoute} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {ExposureService} from "../services/exposure.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {TennisoddsService} from "../services/tennis/tennisodds.service";
import {TennisBetsService} from "../services/tennis/tennis-bets.service";

@Component({
    selector: 'app-tennisdetails',
    templateUrl: './tennisdetails.component.html',
    styleUrls: ['./tennisdetails.component.css']
})
export class TennisdetailsComponent implements OnInit, OnDestroy {
    @ViewChild('btn') btn: ElementRef;
    data: any = {
        type: "back",
        value: 12
    };
    math = Math;
    event: any = [];
    event_id: any;
    market_id: any;
    market: any = [];
    markets: any = [];

    tennis_bets: any[] = [];
    score: any = {};
    scoreLength = 0;
    myInterval: any
    exposuresPerRunner: any = [];
    urlSafe: SafeResourceUrl = "";
    is_score: boolean = false;
    market_name: any;
    videourl: SafeResourceUrl = "";


    selectedTabIndex = 0;

    private scoreSubscription: Subscription;
    private marketSubscription: Subscription;

    constructor(public sanitizer: DomSanitizer, public dialog: MatDialog, private toastr: ToastrService, private renderer: Renderer2, private activatedRoute: ActivatedRoute, private tennisOddService: TennisoddsService, private tennisBetsService: TennisBetsService, private exposureService: ExposureService) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param: any) => {
            // this.market_id = param['market_id'];
            this.event_id = param['event_id'];
            this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://nlivetv.lagaikhaipro.com/rtv.php?eventId=" + this.event_id);
            this.getMarket();
            // this.getTennisBets();
        });

        this.myInterval = setInterval(() => {
            if (this.market.length > 0) {
                this.getMarket();
            }
            this.getTennisBets();
        }, 1000);

        this.tennisBetsService.refreshTennisBets.subscribe(() => {
            this.getTennisBets();
        })


    }

    getMarket() {
        this.marketSubscription = this.tennisOddService.getTennisOddsByEventId(this.event_id).subscribe((res: any) => {
            if (res.length != 0 || res != null) {
                this.markets = res;
                //console.log(res);
                this.event_id = this.markets[0].event_id;

                // console.log('market-->',this.markets);
                if (this.tennis_bets.length != 0) {
                    if (this.tennis_bets[0].length != 0) {
                        this.market = this.markets.map((obj1: any) => {
                            let tennis_bet = []
                            tennis_bet.push(this.tennis_bets[0]);
                            const obj2 = tennis_bet.find((obj2: any) => (obj2.event_id === obj1.event_id));
                            //console.log('obj2-->', obj2);
                            if (obj2) {
                                return {
                                    ...obj1,
                                    exp_amount1: obj2.exp_amount1,
                                    exp_amount2: obj2.exp_amount2,
                                    exp_amount3: obj2.exp_amount3
                                };
                            } else {
                                //console.log('elsee-->')
                                return {...obj1, exp_amount1: 0, exp_amount2: 0, exp_amount3: 0};
                            }
                        });
                    }
                } else {
                    this.market = this.markets.map((obj: any) => ({
                        ...obj,
                        exp_amount1: 0,
                        exp_amount2: 0,
                        exp_amount3: 0
                    }));
                }
                //console.log(this.market);
            }
            // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.market[0].link);
        });
    }

    getTennisBets() {
        this.tennisBetsService.getTennisBets(this.event_id).subscribe((data: any) => {
            //console.log(data);
            this.tennis_bets = data;
            //console.log(this.tennis_bets);
        });
    }

    config: MatDialogConfig = {
        disableClose: false,
        hasBackdrop: true,
        backdropClass: 'test',
        width: '90%',
        height: '50%',
        panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
    };

    openDialog(type: any, data: any, price: any, size: any, runner_name: string, index: number = 0) {

        // let firstSpan = this.btn.nativeElement;
        const dialogRef = this.dialog.open(BetslipComponent, {
            disableClose: true,
            data: {
                g_type: 'tennis',
                m_type: type,
                type: data,
                user_id: localStorage.getItem('user_id'),
                event_id: this.event_id,
                runner_name: runner_name,
                value: {'price': price, 'size': size},
                market_id: this.markets.length != 0 ? this.market[0].market_id : 0,
                index: index,
                market_name: this.market[0].runner1 + " v " + this.market[0].runner2,
                enable_draw: false
            }
        });

        setTimeout(() => {
            this.toastr.info('please select bet again');
            dialogRef.close();
        }, 10000);

        dialogRef.afterClosed().subscribe(result => {
            //console.log(`Dialog result: ${result}`);
        });


    }

    selectTab(index: number): void {
        this.selectedTabIndex = index;
    }


    ngOnDestroy(): void {
        clearInterval(this.myInterval);
        this.marketSubscription.unsubscribe();
        // this.scoreSubscription.unsubscribe();
    }

}
