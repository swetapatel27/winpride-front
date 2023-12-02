import {Component, OnInit} from '@angular/core';
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
    is_active: boolean = false;
    balance = 0;
    clicked = false;
    public selectedGame: any;
    provider: any;

    constructor(private liveCasinoService: LiveCasinoService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private _location: Location, private userService: UserService,) {
    }

    ngOnInit(): void {
        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();
        this.gameid = this.route.snapshot.paramMap.get('gameid');
        this.selectedGame = this.route.snapshot.paramMap.get('selectedgame');
        this.getGameUrl(this.gameid,this.selectedGame,this.user_id);

    }

    getBalance() {
        this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
            this.balance = data.casino_balance;
            this.is_active = data.casino_active;
        })
    }

    getGameUrl(gameid: any,selectedGame:any,username:any) {
        //const gi = "AR";
        this.provider = this.route.snapshot.paramMap.get('selectedgame');
        this.liveCasinoService.getGamesUrlByidRequests(gameid,this.provider,this.user_id).subscribe((res: any) => {
            
            this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(res.launch_url);
            // this.gameurl = res.launch_url;
        });
    }

    activateAccount() {
        this.liveCasinoService.activateAccountRequests().subscribe((res: any) => {
            alert('Account Activated');
            location.reload();
        });
    }

    backClicked() {
        this._location.back();
    }
}
