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
    public gameid: any;
    gameurl: any = "";
    is_active: boolean = false;
    balance = 0;
    clicked = false;

    constructor(private liveCasinoService: LiveCasinoService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private _location: Location, private userService: UserService,) {
    }

    ngOnInit(): void {
        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();
        this.gameid = this.route.snapshot.paramMap.get('gameid');
        this.getGameUrl(this.gameid);
        //console.log(this.gameid);
    }

    getBalance() {
        this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
            this.balance = data.casino_balance;
            this.is_active = data.casino_active;
        })
    }

    getGameUrl(gameid: any) {
        //const gi = "AR";
        this.liveCasinoService.getGamesUrlByidRequests(gameid).subscribe((res: any) => {
            this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
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