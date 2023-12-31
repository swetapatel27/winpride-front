import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'
import {LiveCasinoService} from "../services/livecasino.service";
import {UserService} from "../services/user.service";
import {ExposureService} from "../services/exposure.service";

@Component({
    selector: 'app-livecasino',
    templateUrl: './casino.component.html',
    styleUrls: ['./casino.component.css'],
    providers: []
})
export class LivecasinoComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    balance = 0;
    vendors: any = [];
    gameList: any = [];
    gameurl: any = "";
    activeVendor: string = "";
    isloading: boolean = false;
    is_active: boolean = false;
    clicked = false;
    img_list = [ "/assets/images/pragmatic play.png", "/assets/images/habanero.png","/assets/images/boongo.png", "/assets/images/playson.png", "/assets/images/cq9.png",  "/assets/images/evoplay.png", "/assets/images/toptrend.png", " /assets/images/dreamtech.png", "/assets/images/pgsoft.png", "/assets/images/reel-kingdom.png", "/assets/images/ezugi.png", "/assets/images/evolution.png", "/assets/images/supernova.png", "/assets/images/baccarat-x-pro.png"]
    selectedGame: string = "";
    exposure: any = [];

    constructor(private liveCasinoService: LiveCasinoService, private sanitizer: DomSanitizer, private userService: UserService, private router: Router, private exposureService: ExposureService) {
    }

    ngOnInit(): void {
        this.getVendorList();

        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();
        this.getExposureDetails();
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
            // console.log(res.providers)
            this.vendors = res.providers.map((vendor: any, index: number) => {
                return {
                    name: vendor.name,  // or use the property that contains the vendor name
                    code: vendor.code,  // or use the property that contains the vendor code
                    image: this.img_list[index]
                };
            });
            const temp = this.vendors[1]
            this.vendors[1]= this.vendors[this.vendors.length-2]
            this.vendors[this.vendors.length-2]=temp

            const temp1 = this.vendors[2]
            this.vendors[2]= this.vendors[this.vendors.length-1]
            this.vendors[this.vendors.length-1]=temp1

            // console.log(this.vendors)
        });
    }

    getGameList(provider: any) {
        this.gameurl = "";
        this.activeVendor = provider;

        this.isloading = true;
        this.liveCasinoService.getGamesByProviderRequests(provider).subscribe((res: any) => {
            this.gameList = res.games;
            this.isloading = false;
            this.router.navigate(['/dashboard/livecasino', provider], { state: { gameList: this.gameList } });
 
        });
    }

    openCasino(provider: any) {
        this.router.navigate(['/dashboard/casino', provider]);
    }

    getGameUrl(gameid: any) {

        const selectedgame= this.selectedGame;

        const data ={
            gameId: gameid,
            provider: this.selectedGame,
            userId: this.user_id,
            balance: this.balance,
            exposure: this.exposure
        }
        console.log(data)

        this.liveCasinoService.getGamesUrlByidRequests(data).subscribe((res: any) => {

            this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(res.launch_url);
            this.router.navigate(['/casino-detail/', gameid, selectedgame])
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

    setSelectedGame(gameName: string) {
        this.selectedGame = gameName;
      }

      getExposureDetails() {
        this.exposureService.getExposure().subscribe((data: any) => {
            this.exposure = data[0].exp_amount;
        }, (error) => {
          this.exposure = [];
        })
      }

}
