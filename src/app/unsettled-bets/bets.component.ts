import {Component, OnInit} from '@angular/core';
import { forkJoin,Observable } from 'rxjs';
import {Location} from '@angular/common';
import {MarketBetsService} from "../services/market-bets.service";
import {TennisBetsService} from "../services/tennis/tennis-bets.service";
import {SoccerBetsService} from "../services/soccer/soccer-bets.service";
import {SessionBetsService} from "../services/session-bets.service";
import {FancyBetsService} from "../services/fancy-bets.service";
import {BookmakerBetsService} from "../services/bookmaker-bets.service";

@Component({
  selector: 'app-unsettle-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css'],
  providers: []
})
export class UnsettlebetListComponent implements OnInit {
  match_bets: any = [];
  tennis_bets: any = [];
  soccer_bets: any = [];
  session_bets: any = [];
  bookmaker_bets: any = [];
  fancy_bets: any = [];

  marge_bets: any = [];

  constructor(private matchBetService: MarketBetsService,private bookmakerBetsService: BookmakerBetsService,private fancyBetsService: FancyBetsService,private sessionBetsService: SessionBetsService, private tennisBetsService: TennisBetsService, private soccerBetService: SoccerBetsService, private _location: Location) {
  }

  ngOnInit(): void {
    this.getAllBets();
  }

  getAllBets() {
    forkJoin([
      this.matchBetService.getOpenBetsForMatch(),
      this.bookmakerBetsService.getOpenBetsForBookmaker(),
      this.sessionBetsService.getOpenBetsforSession(),
      this.fancyBetsService.getOpenBetsforFancy(),
      this.soccerBetService.getOpenBetsforSoccer(),
      this.tennisBetsService.getOpenBetsforTennis(),
    ]).subscribe({
      next: (responses: [any, any, any, any, any, any]) => {
        this.match_bets = responses[0];
        this.bookmaker_bets = responses[1];
        this.session_bets = responses[2];
        this.fancy_bets = responses[3];
        this.soccer_bets = responses[4];
        this.tennis_bets = responses[5];
  
        this.marge_bets = [
          ...(this.match_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.bookmaker_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.session_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.fancy_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-cricket.png' })),
          ...(this.soccer_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-football.png' })),
          ...(this.tennis_bets as any[]).map(item => ({ ...item, 'matchtype': 'menu-tennis.png' })),
        ];
      },
      error: (error) => {
        console.error('Error fetching bets:', error);
      },
    });
  }

  backClicked(){
    this._location.back();
  }
}
