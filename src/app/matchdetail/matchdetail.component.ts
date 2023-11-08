import {Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {BetslipComponent} from '../betslip/betslip.component';
import {ActivatedRoute} from "@angular/router";
import {MatchService} from "../services/match.service";
import {Subscription, switchMap} from "rxjs";
import {SessionBetsService} from "../services/session-bets.service";
import {BookmakerService} from "../services/bookmaker.service";
import {BookmakerBetsService} from "../services/bookmaker-bets.service";
import {ExposureService} from "../services/exposure.service";
import {ToastrService} from "ngx-toastr";
import {MarketBetsService} from "../services/market-bets.service";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {FancyBetsService} from "../services/fancy-bets.service";
import {HttpClient} from '@angular/common/http';
import {SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-matchdetail',
  templateUrl: './matchdetail.component.html',
  styleUrls: ['./matchdetail.component.css'],
  // encapsulation: ViewEncapsulation.None

})
export class MatchdetailComponent implements OnInit, OnDestroy {
  htmlContent: SafeHtml;
  @ViewChild('btn') btn: ElementRef;
  data: any = {
    type: "back",
    value: 12
  };

  videourl: any = "";

  event: any = [];
  event_id: any;
  market: any = [];
  markets: any = [];
  book_maker_odd: any = [];
  book_maker_odds: any = [];

  sessions: any = [];
  fancies:any=[];
  session_bets: any[] = [];
  fancy_bets: any[] = [];
  match_bets: any[] = [];
  bookmaker_bets: any[] = [];
  score: any = {};
  scoreLength = 0;
  myInterval: any
  exposuresPerRunner: any = [];
  fancyExposuresPerRunner: any = [];
  is_score: boolean = false;
  market_name: any;
  marketStartTime: any;
  math = Math
  last24ballsNew: any = [];

  cashout_submited: boolean = false;
  cashout_price: any;
  show_cashout_confirm: boolean = false;
  cashout_errmsg = "";

  selectedTabIndex = 0;
  enable_draw: boolean = false;
  private sessionSubscription: Subscription;
  private fancySubscription: Subscription;
  private scoreSubscription: Subscription;
  private marketSubscription: Subscription;
  private bookmakerSubscription: Subscription;

  cash_out_profit = 0;
  total_profit_loss = 0;
  status = '';

  constructor(private http: HttpClient, public sanitizer: DomSanitizer, public dialog: MatDialog, private toastr: ToastrService, private bookMakerService: BookmakerService,private BookmakerBetService: BookmakerBetsService, private renderer: Renderer2, private activatedRoute: ActivatedRoute, private matchService: MatchService, private sessionBetsService: SessionBetsService, private matchBetsService: MarketBetsService, private exposureService: ExposureService, private fancyBetService:FancyBetsService) {
  }


  ngOnInit(): void {

    // this.fetchHTMLPage();
    this.activatedRoute.params.subscribe((param: any) => {
      this.event_id = param['event_id'];
      this.videourl = this.sanitizer.bypassSecurityTrustResourceUrl("https://nlivetv.lagaikhaipro.com/rtv.php?eventId=" + this.event_id);
    })
    this.getMarket();
    this.getBookMakerOdds();
    this.getSession();
    this.getFancy();
    this.getLiveScore();
    // this.matchService.getEvent(this.event_id).subscribe((res: any) => {
    //   this.event = res;
    //   if (this.event.length > 0) {
    //     this.market_name = this.event[0].runners[0].runnerName + " v " + this.event[0].runners[1].runnerName;
    //   }
    //
    //   // this.getMarket();
    //   // this.getSession();
    //   // this.getLiveScore();
    //   // this.getVideoLink();
    // })

    this.myInterval = setInterval(() => {
      if (this.market.length > 0) {
        this.getMarket();
      }

      this.getSession();
      this.getBookMakerOdds();
      this.getFancy();
      if (this.bookmaker_bets.length > 0) {
        this.getBookmakerBets();
      }
      if (this.scoreLength > 0) {
        this.getLiveScore();
      }
      if (this.match_bets.length > 0) {
        this.getMatchBets();
      }
      if (this.session_bets.length > 0) {
        this.getSessionBets();
      }
      if (this.fancy_bets.length > 0) {
        this.getFancyBets();
      }
      this.getLiveScore();
      this.calculateCashOut();
    }, 5000);

    this.matchBetsService.refreshMatchBets.subscribe(() => {
      this.getMatchBets();
    })
    this.getMatchBets();
    this.BookmakerBetService.refreshBookmakerBets.subscribe(() => {
      this.getBookmakerBets();
    })
    this.getBookmakerBets();

    this.fancyBetService.refreshFancyBets.subscribe(()=>{
      this.getFancyBets();
    });
    this.getFancyBets();

    this.sessionBetsService.refresh.subscribe(() => {
      this.getSessionBets();
    })
    this.getSessionBets();

    this.exposureService.refreshExposureAmtByRunner.subscribe(() => {
      this.getExposureByRunnerName();
    });
    this.getExposureByRunnerName();

    this.exposureService.refreshFancyExposureAmtByRunner.subscribe(()=>{
      this.getFancyExposureByRunnerName();
    })
    this.getFancyExposureByRunnerName();

  }

  getInterestingReverseLoop(data: any[], overNumber: any) {
    const stringWithoutParentheses = overNumber.replace(/[()]/g, '');
    const numberValue = parseFloat(stringWithoutParentheses);
    const startIndex = Math.floor(numberValue * 10) % 10;
    // console.log('index', Number(numberValue));
    const interestingLoopData = [];

    // Fill the array with zero values
    for (let i = 0; i < 6; i++) {
      interestingLoopData.push({
        score_card: "-",
        out_text: "0",
        comment: ""
      });
    }
    if (data.length > 0) {
      if (startIndex > 0) {
        const relevantData = data.slice(-startIndex);
        // console.log('RD-->', relevantData);


        for (let i = 0; i < relevantData.length && i < 6; i++) {
          interestingLoopData[i].score_card = relevantData[i].score_card;
        }
        // console.log('na-->', interestingLoopData);
      } else {
        for (let i = 0; i < 6; i++) {
          interestingLoopData[i].score_card = data[i].score_card
        }
      }
    }
    return interestingLoopData;
  }

  getMarket() {
    this.marketSubscription = this.matchService.getMarketOdd(this.event_id).subscribe((res: any) => {
        this.markets = res;
        if (this.markets.length > 0) {
          this.market_name = this.markets[0].runner1 + " v " + this.markets[0].runner2;
          this.marketStartTime = this.markets[0].start_time;
          if (this.match_bets.length != 0) {
            if (this.match_bets[0].length != 0) {
              this.market = this.markets.map((obj1: any) => {
                let match_bet = []
                match_bet.push(this.match_bets[0]);
                const obj2 = match_bet.find((obj2: any) => (obj2.event_id == obj1.event_id && obj2.status == 1));
                if (obj2) {
                  return {
                    ...obj1,
                    exp_amount1: obj2.exp_amount1,
                    exp_amount2: obj2.exp_amount2,
                    exp_amount3: obj2.exp_amount3
                  };
                } else {
                  return {...obj1, exp_amount1: 0, exp_amount2: 0, exp_amount3: 0};
                }
              });
            }
          } else {
            this.market = this.markets.map((obj: any) => ({...obj, exp_amount1: 0, exp_amount2: 0, exp_amount3: 0}));
          }
          if (this.market[0].hasOwnProperty('back2_price')) {
            if (this.market[0].back2_price != null) {
              this.enable_draw = true;
            } else if (this.market[0].back2_price == null) {
              this.enable_draw = false;
            }
          }
        }
      }
    )
    // console.log('this amrket', this.market);
  }

  getBookMakerOdds() {
    this.bookmakerSubscription = this.bookMakerService.getBookmakerOdd(this.event_id).subscribe((res: any) => {
      this.book_maker_odds = res;
      if (this.book_maker_odds.length > 0) {
        this.market_name = this.book_maker_odds[0].runner1 + " v " + this.book_maker_odds[0].runner2;
        // console.log('bookmaker length', this.bookmaker_bets.length);
        if (this.bookmaker_bets.length != 0) {
          if (this.bookmaker_bets[0].length != 0) {
            // console.log('in book');
            this.book_maker_odd = this.book_maker_odds.map((obj1: any) => {
              let bookmaker_bet = []
              bookmaker_bet.push(this.bookmaker_bets[0]);
              // console.log('bookmaker bet-->',bookmaker_bet);
              const obj2 = bookmaker_bet.find((obj2: any) => (obj2.event_id == obj1.event_id && obj2.status == 1));
              // console.log('obj2-->',obj2);
              if (obj2) {
                return {
                  ...obj1,
                  exp_amount1: obj2.exp_amount1,
                  exp_amount2: obj2.exp_amount2,
                  exp_amount3: obj2.exp_amount3,
                  status:obj2.status
                };
              } else {
                return {...obj1, exp_amount1: 0, exp_amount2: 0, exp_amount3: 0};
              }
            });
          }
        } else {
          this.book_maker_odd = this.book_maker_odds.map((obj: any) => ({
            ...obj,
            exp_amount1: 0,
            exp_amount2: 0,
            exp_amount3: 0
          }));
        }
        if (this.book_maker_odd[0].hasOwnProperty('back2_price')) {
          if (this.book_maker_odd[0].back2_price != null) {
            this.enable_draw = true;
          } else if (this.book_maker_odd[0].back2_price == null) {
            this.enable_draw = false;
          }
        }
      }
    })
    // console.log('book,=', this.book_maker_odd);

  }

  getBookmakerBets() {
    this.BookmakerBetService.getBookmakerBets(this.event_id).subscribe((data: any) => {
      this.bookmaker_bets = data;
    });
  }

  getSession() {
    this.sessionSubscription = this.matchService.getSession(this.event_id).subscribe((res: any) => {
      if (res != null) {
        this.sessions = res;
        this.sessions = this.sessions.sort((a:any, b:any) => a.sr_no - b.sr_no);
        if (this.exposuresPerRunner.length != 0) {
          this.sessions = this.sessions.map((obj1: any) => {
            const obj2 = this.exposuresPerRunner.find((obj2: any) => (obj2.runner_name == obj1.runner_name && obj2.status == 1));
            // console.log(obj2);
            return obj2 ? {...obj1, ...obj2} : {...obj1, exp_amount: 0};
          });

        } else {
          this.sessions = this.sessions.map((obj: any) => ({...obj, exp_amount: 0}));
          // this.sessions = this.sessions.sort((a:any, b:any) => a.sr_no - b.sr_no);
        }
      } else {
        this.sessions = [];
      }
    });

    // console.log('session-->', this.sessions);
  }

 getFancy() {
    this.fancySubscription = this.matchService.getFancy(this.event_id).subscribe((res: any) => {
      if (res != null) {
        // res.sort((a:any, b:any) => a.srno.localeCompare(b.srno));
        this.fancies = res;
        if (this.fancyExposuresPerRunner.length != 0) {
          this.fancies = this.fancies.map((obj1: any) => {
            const obj2 = this.fancyExposuresPerRunner.find((obj2: any) => (obj2.runner_name == obj1.runner_name && obj2.status == 1));
            // console.log('obj2-->',obj2);
            return obj2 ? {...obj1, ...obj2} : {...obj1, exp_amount: 0};
          });
        } else {
          this.fancies = this.fancies.map((obj: any) => ({...obj, exp_amount: 0}));
        }
      } else {
        this.fancies = [];
      }
    });

    // console.log('fancy-->', this.fancies);
  }


  getLiveScore() {
    this.scoreSubscription = this.matchService.getScore(this.event_id).subscribe((res: any) => {
      if (res != null) {
        this.score = res;
        this.scoreLength = this.score.length
        if ("teams" in this.score) {
          this.is_score = true;
          this.last24ballsNew = this.score.last24ballsNew;
        } else {
          this.is_score = false;
        }
        console.log('this is score-->', this.is_score);
      }
    }, (error: any) => {
      this.scoreLength = 0;
    })
  }


  getSessionBets() {
    this.sessionBetsService.getSessionBet(this.event_id).subscribe((data: any) => {
      this.session_bets = data;
      // console.log(this.session_bets);

    })
  }

  getMatchBets() {
    this.matchBetsService.getMatchBets(this.event_id).subscribe((data: any) => {
      this.match_bets = data;
    });
  }
  getFancyBets() {
    this.fancyBetService.getFancyBets(this.event_id).subscribe((data: any) => {
      this.fancy_bets = data;
    });
  }

  getExposureByRunnerName() {
    this.exposureService.getExposureAmtByRunner(this.event_id).subscribe((data: any) => {
      if (data.length != 0) {
        this.exposuresPerRunner = data;
      } else {
        this.exposuresPerRunner = [];
      }
    })
  }

  getFancyExposureByRunnerName() {
    this.exposureService.getFancyExposureAmtByRunner(this.event_id).subscribe((data: any) => {
      if (data.length != 0) {
        this.fancyExposuresPerRunner = data;
      } else {
        this.fancyExposuresPerRunner = [];
      }
    })
  }

  calculateCashOut() {
    if (this.match_bets.length != 0) {

      this.cashout_submited = !this.match_bets[0].is_switched;
      let last_bet = this.match_bets[0]
      let current_market = this.market[0];
      //console.log(current_market);
      //console.log(last_bet.runner_name);

      this.total_profit_loss = Math.abs(last_bet.loss_amount);

      if (current_market.runner1 == last_bet.runner_name) {
        if (last_bet.type == 'Back') {
          this.cashout_price = current_market.back0_price
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.back0_price) {
              this.cash_out_profit = last_bet.exp_amount1 - ((Math.abs(last_bet.loss_amount) * current_market.back0_price) - Math.abs(last_bet.loss_amount));
              this.status = 'loss';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else if (last_bet.price > current_market.back0_price) {
              this.cash_out_profit = last_bet.exp_amount1 - ((Math.abs(last_bet.loss_amount) * current_market.back0_price) - Math.abs(last_bet.loss_amount));
              this.status = 'profit';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
              // console.log('b-p/l',this.cash_out_profit);
              // console.log('b-tp/l',this.total_profit_loss);
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        } else {
          this.cashout_price = current_market.lay0_price
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.lay0_price) {
              this.status = 'profit';
              this.cash_out_profit = last_bet.exp_amount1 + ((Math.abs(last_bet.win_amount) * current_market.lay0_price) - Math.abs(last_bet.win_amount));
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
            } else if (last_bet.price > current_market.lay0_price) {
              this.cash_out_profit = last_bet.exp_amount1 + ((Math.abs(last_bet.win_amount) * current_market.lay0_price) - Math.abs(last_bet.win_amount));
              this.status = 'loss';
              //console.log("l-p/l", this.cash_out_profit);
              //console.log("l-tp/l", this.cash_out_profit);
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        }
      } else if (current_market.runner2 == last_bet.runner_name) {
        //console.log('inn2');
        if (last_bet.type == 'Back') {
          this.cashout_price = current_market.back1_price
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.back1_price) {
              this.cash_out_profit = last_bet.exp_amount2 - ((Math.abs(last_bet.loss_amount) * current_market.back1_price) - Math.abs(last_bet.loss_amount));
              this.status = 'loss';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else if (last_bet.price > current_market.back1_price) {
              this.cash_out_profit = last_bet.exp_amount2 - ((Math.abs(last_bet.loss_amount) * current_market.back1_price) - Math.abs(last_bet.loss_amount));
              this.status = 'profit';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
              // console.log('b-p/l',this.cash_out_profit);
              // console.log('b-tp/l',this.total_profit_loss);
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';

            }
          }
        } else {
          this.cashout_price = current_market.lay1_price
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.lay1_price) {
              this.status = 'profit';
              this.cash_out_profit = last_bet.exp_amount2 + ((Math.abs(last_bet.win_amount) * current_market.lay1_price) - Math.abs(last_bet.win_amount));
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
            } else if (last_bet.price > current_market.lay1_price) {
              this.cash_out_profit = last_bet.exp_amount2 + ((Math.abs(last_bet.win_amount) * current_market.lay1_price) - Math.abs(last_bet.win_amount));
              this.status = 'loss';
              //console.log("l-p/l", this.cash_out_profit);
              //console.log("l-tp/l", this.cash_out_profit);
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        }
      } else if (last_bet.runner_name.trim() == 'Draw') {

        if (last_bet.type == 'Back') {
          this.cashout_price = current_market.back2_price;

          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {

            if (last_bet.price < current_market.back2_price) {
              this.cash_out_profit = last_bet.exp_amount3 - ((Math.abs(last_bet.loss_amount) * current_market.back2_price) - Math.abs(last_bet.loss_amount));
              this.status = 'loss';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else if (last_bet.price > current_market.back2_price) {
              this.cash_out_profit = last_bet.exp_amount3 - ((Math.abs(last_bet.loss_amount) * current_market.back2_price) - Math.abs(last_bet.loss_amount));
              this.status = 'profit';
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
              // console.log('b-p/l',this.cash_out_profit);
              // console.log('b-tp/l',this.total_profit_loss);
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        } else {
          this.cashout_price = current_market.lay2_price;
          //console.log('cp--->', this.cashout_price);
          if (this.cashout_price >= 1.03 && this.cashout_price <= 3.26) {
            if (last_bet.price < current_market.lay2_price) {
              this.status = 'profit';
              this.cash_out_profit = last_bet.exp_amount3 + ((Math.abs(last_bet.win_amount) * current_market.lay2_price) - Math.abs(last_bet.win_amount));
              //console.log("l-p/l", this.cash_out_profit);
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
              //console.log("l-tp/l", this.cash_out_profit);

              this.cash_out_profit = (this.cash_out_profit * 75) / 100;
              this.total_profit_loss = (this.total_profit_loss * 75) / 100;
            } else if (last_bet.price > current_market.lay2_price) {
              this.cash_out_profit = last_bet.exp_amount3 + ((Math.abs(last_bet.win_amount) * current_market.lay2_price) - Math.abs(last_bet.win_amount));
              this.status = 'loss';
              //console.log("l-p/l", this.cash_out_profit);
              //console.log("l-tp/l", this.cash_out_profit);
              this.total_profit_loss = Math.abs(last_bet.loss_amount) + this.cash_out_profit;
            } else {
              this.cash_out_profit = 0;
              this.total_profit_loss = Math.abs(last_bet.loss_amount);
              this.status = 'profit';
            }
          }
        }
      }


      //console.log(this.cash_out_profit)
      //console.log(this.total_profit_loss)
      //console.log(this.status);


    }
  }

  display_cashout() {
    //console.log(this.cashout_price);

    if (this.cashout_price >= 1.03 && this.cashout_price < 11.01) {
      this.show_cashout_confirm = true;
    } else {
      this.cashout_errmsg = "Cash out can be done for ODDs between 1.03 and 11.01";
    }
    //console.log(this.cashout_errmsg);
  }

  submit_cashout(is_confirm: boolean) {
    if (is_confirm) {
      let cashout_details = {
        user_id: localStorage.getItem('user_id'),
        event_id: this.event_id,
        runner_name: this.match_bets[0].runner_name,
        type: this.match_bets[0].type,
        new_price: this.cashout_price,
        price: this.match_bets[0].price,
        main_type: 'match_odd',
        amount: this.total_profit_loss.toFixed(2),
        status: this.status,
        loss_amount: this.match_bets[0].loss_amount,
        cashout_pl: this.cash_out_profit.toFixed(2),
        market_id: this.match_bets[0].market_id
      }
      //console.log('casshh-->', cashout_details);
      this.matchBetsService.cashout(cashout_details).subscribe((res: any) => {
        this.toastr.success('cashed out successfully');
        this.getMatchBets();
      });
      this.show_cashout_confirm = false;
    } else {
      this.show_cashout_confirm = false;
    }
  }

  config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: 'test',
    width: '90%',
    height: '50%',
    panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
  };

  openDialog(type: any, data: any, price: any, size: any, runner_name: string, index: number = 0, min?: number, max?: number) {
    let config = {
      disableClose: true,
      data: {
        g_type: 'cricket',
        m_type: type,
        type: data,
        user_id: localStorage.getItem('user_id'),
        event_id: this.event_id,
        runner_name: runner_name,
        value: { 'price': price, 'size': size },
        market_id: this.markets.length !== 0 ? this.market[0].market_id : 0,
        index: index,
        market_name: this.market_name,
        enable_draw: this.enable_draw,
        ...(min !== undefined && max !== undefined ? { min, max } : {}),
      }
    };
    //console.log('min--.',config);
    // let firstSpan = this.btn.nativeElement;
    const dialogRef = this.dialog.open(BetslipComponent, config);

    // setTimeout(() => {
    //   this.toastr.info('please select bet again');
    //   dialogRef.close();
    // }, 10000);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
  }


  ngOnDestroy(): void {
    clearInterval(this.myInterval);
    this.sessionSubscription.unsubscribe();
    this.fancySubscription.unsubscribe();
    this.marketSubscription.unsubscribe();
    this.scoreSubscription.unsubscribe();
    this.bookmakerSubscription.unsubscribe();
  }

}


