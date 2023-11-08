import {Component, OnInit} from '@angular/core';
import {LiveCasinoService} from "../services/livecasino.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector: 'app-casino',
    templateUrl: './casino.component.html',
    styleUrls: ['./casino.component.css']
})
export class CasinoComponent implements OnInit {
    gameList: any = [];
    gameurl: any = "";
    activeVendor: string = "";
    isloading: boolean = false;

    constructor(private liveCasinoService: LiveCasinoService, private activatedRoute: ActivatedRoute, private router:Router) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param: any) => {
            this.activeVendor = param['provider'];
            console.log('provider-->', this.activeVendor);
            this.getGameList();
        });
    }

    getGameList() {
        this.gameurl = "";
        this.isloading = true;
        this.liveCasinoService.getGamesByProviderRequests(this.activeVendor).subscribe((res: any) => {
            this.gameList = res;
            console.log(this.gameList);
            this.isloading = false;
        });
    }

    openNewGameTab(gameid: any) {
        this.router.navigate(['/casino-detail', gameid])
    }

}
