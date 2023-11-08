import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'
import {LiveCasinoService} from "../services/livecasino.service";
import {UserService} from "../services/user.service";

@Component({
    selector: 'app-livecasino',
    templateUrl: './casino.component.html',
    styleUrls: ['./casino.component.css'],
    providers: []
})
export class LivecasinoComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    balance = 0;
    vendors: any = [];
    gameList: any = [];
    gameurl: any = "";
    activeVendor: string = "";
    isloading: boolean = false;
    is_active: boolean = false;
    clicked = false;
    img_list = ["/assets/images/evolution.png", "/assets/images/ezugi.png", "/assets/images/PowerGames.png", "/assets/images/pragmatic play.png", "/assets/images/qtech.png", "/assets/images/supernova.png", "/assets/images/baccarat-x-pro.png"]

    constructor(private liveCasinoService: LiveCasinoService, private sanitizer: DomSanitizer, private userService: UserService, private router: Router) {
    }

    ngOnInit(): void {
        this.getVendorList();

        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();
    }

    getBalance() {
        this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
            this.balance = data.casino_balance;
            this.is_active = data.casino_active;
        })
    }

    // getVendorList() {
    //     this.liveCasinoService.getVendorsRequests().subscribe((res: any) => {
    //         this.vendors = res;
    //         if (res[0]) this.getGameList(res[0]);
    //     });
    // }

     getVendorList() {
        this.liveCasinoService.getVendorsRequests().subscribe((res: any) => {
            this.vendors = res.map((value: any, index: any) => ({
                name: value,
                imageUrl: this.img_list[index], // Use the corresponding image URL from img_list
            }));
            console.log(this.vendors)
            // this.vendors = res;
            // this.vendors = res.filter((vendor:any) => vendor === "Evolution" || vendor === "Ezugi");
            // console.log(this.vendors);
            // if(this.vendors[0]) this.getGameList(this.vendors[0]);
            // if(res[0]) this.getGameList(res[0]);
        });
    }

    getGameList(provider: any) {
        this.gameurl = "";
        this.activeVendor = provider;
        this.isloading = true;
        this.liveCasinoService.getGamesByProviderRequests(provider).subscribe((res: any) => {
            this.gameList = res;
            this.isloading = false;
        });
    }

    openCasino(provider: any) {
        this.router.navigate(['/dashboard/casino', provider]);
    }

    getGameUrl(gameid: any) {
        this.liveCasinoService.getGamesUrlByidRequests(gameid).subscribe((res: any) => {
            this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
        });
    }

    openNewGameTab(gameid: any) {
        this.router.navigate(['/casino-detail/', gameid])
    }

    activateAccount() {
        this.liveCasinoService.activateAccountRequests().subscribe((res: any) => {
            alert('Account Activated');
            location.reload();
        });
    }

}