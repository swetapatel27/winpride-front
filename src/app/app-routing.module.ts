import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomeComponent} from './home/home.component';
import {CricketComponent} from './cricket/cricket.component';
import {FootballComponent} from './football/football.component';
import {TennisComponent} from './tennis/tennis.component';
import {LoginComponent} from './login/login.component';
import {MatchdetailComponent} from './matchdetail/matchdetail.component';
import {NewDashboardComponent} from "./new-dashboard/new-dashboard.component";
import {RegisterComponent} from "./register/register.component";
import {RefererComponent} from "./referer/referer.component";
import {AuthGuard} from "./guards/auth.guard";
import {RechargeWalletComponent} from "./recharge-wallet/recharge-wallet.component";
import {RechargeHistoryComponent} from "./recharge-history/recharge-history.component";
import {MatchComponent} from "./match/match.component";
import {InplayMatchesComponent} from "./inplay-matches/inplay-matches.component";
import {TermsConditionsComponent} from "./terms-conditions/terms-conditions.component";
import {ProfileComponent} from "./profile/profile.component";
import {TennisdetailsComponent} from "./tennisdetails/tennisdetails.component";
import {LedgerComponent} from "./ledger/ledger.component";
import {MybetsComponent} from "./mybets/mybets.component";
import {CasinoComponent} from "./casino/casino.component";
import {SoccerdetailsComponent} from "./soccerdetails/soccerdetails.component";
import {DwRequestsComponent} from "./dw-requests/dw-requests.component";
import {DepositsComponent} from "./deposit/deposit.component";
import {WithdrawsComponent} from "./withdraw/withdraw.component";
import {MainComponent} from "./main/main.component";
import {LivecasinoComponent} from "./livecasino/casino.component";
import {CasinoDwComponent} from "./casino-dw/casinodw.component";
import {CasinoLedgerComponent} from "./casino-ladger/ledger.component";
import {CasinoDetailComponent} from "./casino-detail/detail.component";
import {MybetListComponent} from "./my-bets/bets.component";
import {UnsettlebetListComponent} from "./unsettled-bets/bets.component";
import {ProfitLossComponent} from "./profit-loss/report.component";
import {ComingSoonComponent} from "./coming-soon/detail.component";
import {BonusComponent} from "./bonus/bonus.component";
import {BonusLedgerComponent} from "./bonus-ledger/bonus-ledger.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {TermsPageComponent} from "./static/terms/detail.component";
import {ContactPageComponent} from "./static/contactus/detail.component";
import {PrivacyPageComponent} from "./static/privacypolicy/detail.component";
import {GameRulePageComponent} from "./static/gamesrule/detail.component";
import {LivecasinoGamesComponent} from "./casino-games/casino-games.component";


const appRoutes: Routes = [
    // {path:'matchdetail',component:MatchdetailComponent},
    // {path:'matchdetail/:id',component:MatchdetailComponent},
    // {path:'dashboard',component:NewDashboardComponent},

    {
        path: 'dashboard', component: NewDashboardComponent, canActivate: [AuthGuard], children: [
            {path: '', redirectTo: 'match', pathMatch: 'full'},
            {path: 'match', component: MatchComponent},
            {path: 'inplay-match', component: InplayMatchesComponent},
            {path: 'match-details/:event_id', component: MatchdetailComponent},
            {path: 'tennis-details/:event_id', component: TennisdetailsComponent},
            {path: 'soccer-details/:event_id', component: SoccerdetailsComponent},
            {path: 'mybets', component: MybetsComponent},
            {path: 'recharge-history', component: RechargeHistoryComponent},
            {path: 'recharge-wallet', component: RechargeWalletComponent},
            {path: 'terms-conditions', component: TermsConditionsComponent},
            {path: 'profile', component: ProfileComponent},
            {path: 'ledger', component: LedgerComponent},

            {path: 'deposit', component: DepositsComponent},
            {path: 'withdraw', component: WithdrawsComponent},
            {path: 'dw-request', component: DwRequestsComponent},
            {path: 'home', component: HomeComponent},
            {path: 'cricket', component: CricketComponent},
            {path: 'football', component: FootballComponent},
            {path: 'tennis', component: TennisComponent},
            {path: 'livecasino', component: LivecasinoComponent},
            {path: 'casino-dw', component: CasinoDwComponent},
            {path: 'livecasino/:gameid', component: LivecasinoGamesComponent},
            {path: 'casino-ledger', component: CasinoLedgerComponent},
            {path: 'my-bets', component: MybetListComponent},
            {path: 'unsettled-bets', component: UnsettlebetListComponent},
            {path: 'profit-loss', component: ProfitLossComponent},
            {path: 'coming-soon', component: ComingSoonComponent},
            {path: 'bonus', component: BonusComponent},
            {path: 'bonus-ledger', component: BonusLedgerComponent},
             {path: 'casino-detail/:gameid/:selectedgame', component: CasinoDetailComponent},
        ]
    },
    {path: 'casino-detail/:gameid/:selectedgame', component: CasinoDetailComponent,canActivate: [AuthGuard]},
    {path: 'livecasino/:gameid', component: LivecasinoGamesComponent,canActivate: [AuthGuard]},
    {path: 'home', component: HomeComponent},
    // {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'referer/:username', component: RefererComponent},

    {
        path: 'dashboard', component: NewDashboardComponent, children: [
            {path: 'coming-soon', component: ComingSoonComponent},
            {path: 'contactus', component: ContactPageComponent},
            {path: 'privacypolicy', component: PrivacyPageComponent},
            {path: 'gamesrule', component: GameRulePageComponent},
            {path: 'terms', component: TermsPageComponent},
            {path: 'casino/:provider', component: CasinoComponent},
        ]
    },
    // {path: '', redirectTo: "login", pathMatch: "full"},
    {path: '', component: NewDashboardComponent, children: [{path: '', component: LandingPageComponent}]},
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
