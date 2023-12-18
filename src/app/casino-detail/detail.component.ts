import {Component, OnInit, HostListener} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'
import {LiveCasinoService} from "../services/livecasino.service";
import {Location} from '@angular/common';
import {UserService} from "../services/user.service";

@Component({
    selector: 'app-casino-details',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
    providers: []
})
export class CasinoDetailComponent implements OnInit {

    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    public gameid: any;
    gameurl: any = "";
    gameurl1: any = "";
    is_active: boolean = false;
    balance = 0;
    clicked = false;
    public selectedGame: any;

    constructor(private liveCasinoService: LiveCasinoService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private _location: Location, private userService: UserService,) {
        this.route.queryParams.subscribe(params => {
            this.gameurl1 = params['gameurl'];
        });
    }




    ngOnInit(): void {
        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();
        this.gameid = this.route.snapshot.paramMap.get('gameid');
        this.selectedGame = this.route.snapshot.paramMap.get('selectedgame');
        this.getGameUrl(this.gameurl1);

    }

    ngOnDestroy(): void {
        this.casinoBalanceToAccount();
        this.casinoLedger();
    }

    getBalance() {
        this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
            this.balance = data.casino_balance;
            this.is_active = data.casino_active;
        })
    }

    getGameUrl(gameurl:any) {
        //const gi = "AR";
            this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(gameurl);
        
    }

    activateAccount() {
        this.liveCasinoService.activateAccountRequests().subscribe((res: any) => {
            alert('Account Activated');
            location.reload();
        });
    }

    casinoBalanceToAccount(){
        const data ={
           id:this.user_id
        }
        this.liveCasinoService.convertCasinoBalance(data).subscribe((data: any) => {
        })
    }

    casinoLedger(){
        this.liveCasinoService.ledgerEntryCasino(this.user_id).subscribe((data: any) => {
        })
    }

    backClicked() {
        this._location.back();
    }
}
