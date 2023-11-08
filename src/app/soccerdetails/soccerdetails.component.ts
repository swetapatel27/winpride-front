import {Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {BetslipComponent} from '../betslip/betslip.component';
import {ActivatedRoute} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {ExposureService} from "../services/exposure.service";
import {ToastrService} from "ngx-toastr";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SocceroddsService} from "../services/soccer/soccerodds.service";
import {SoccerBetsService} from "../services/soccer/soccer-bets.service";

@Component({
    selector: 'app-soccerdetails',
    templateUrl: './soccerdetails.component.html',
    styleUrls: ['./soccerdetails.component.css']
})
export class SoccerdetailsComponent implements OnInit, OnDestroy {
    data: any = {
        type: "back",
        value: 12
    };
    math = Math;
    event_id: any;
    market_id: any;
    market: any = [];
    markets: any = [];
    soccer_bets: any[] = [];
    myInterval: any
    selectedTabIndex = 0;
    videourl: SafeResourceUrl = "";
    private scoreSubscription: Subscription;
    private marketSubscription: Subscription;

    constructor(public sanitizer: DomSanitizer, public dialog: MatDialog, private toastr: ToastrService, private renderer: Renderer2, private activatedRoute: ActivatedRoute, private soccerBetService: SoccerBetsService, private soccerOddService: SocceroddsService) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param: any) => {
            this.event_id = param['event_id'];
            this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://nlivetv.lagaikhaipro.com/rtv.php?eventId=" + this.event_id);
            this.getMarket();
        });
        this.myInterval = setInterval(() => {
            if (this.market.length > 0) {
                this.getMarket();
            }
            this.getSoccerBets();
        }, 1000);

        this.soccerBetService.refreshSoccerBets.subscribe(() => {
            this.getSoccerBets();
        })
    }

    getSoccerBets() {
        this.soccerBetService.getSoccerBets(this.event_id).subscribe((data: any) => {
            //console.log(data);
            this.soccer_bets = data;
            //console.log(this.soccer_bets);
        });
    }

    getMarket() {
        this.marketSubscription = this.soccerOddService.getSoccerOddsByEventId(this.event_id).subscribe((res: any) => {
            if (res.length != 0 || res != null) {
                this.markets = res;
                //console.log(res);
                this.event_id = this.markets[0].event_id;

                // console.log('market-->',this.markets);
                if (this.soccer_bets.length != 0) {
                    if (this.soccer_bets[0].length != 0) {
                        this.market = this.markets.map((obj1: any) => {
                            let soccer_bet = []
                            soccer_bet.push(this.soccer_bets[0]);
                            const obj2 = soccer_bet.find((obj2: any) => (obj2.event_id === obj1.event_id));
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
                g_type: 'soccer',
                m_type: type,
                type: data,
                user_id: localStorage.getItem('user_id'),
                event_id: this.event_id,
                runner_name: runner_name,
                value: {'price': price, 'size': size},
                market_id: this.markets.length != 0 ? this.market[0].market_id : 0,
                index: index,
                market_name: this.market[0].runner1 + " v " + this.market[0].runner2,
                enable_draw: true
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
