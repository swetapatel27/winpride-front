import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {CarouselComponent} from './carousel/carousel.component';
import {FooterComponent} from './footer/footer.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MatchdetailComponent} from './matchdetail/matchdetail.component'
import {MatTabsModule} from '@angular/material/tabs';
import {BetslipComponent} from './betslip/betslip.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {NewDashboardComponent} from './new-dashboard/new-dashboard.component';
import {RegisterComponent} from './register/register.component';
import {RechargeWalletComponent} from './recharge-wallet/recharge-wallet.component';
import {RechargeHistoryComponent} from './recharge-history/recharge-history.component';
import {AuthInterceptor} from "./auth.interceptor";
import {MatchComponent} from './match/match.component';
import {CricketComponent} from './cricket/cricket.component';
import {FootballComponent} from './football/football.component';
import {TennisComponent} from './tennis/tennis.component';
import {ToastrModule} from 'ngx-toastr';
import {InplayMatchesComponent} from './inplay-matches/inplay-matches.component';
import {ChangePasswordComponent} from './modals/change-password/change-password.component';
import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component';
import {ProfileComponent} from './profile/profile.component';
import {TennisdetailsComponent} from './tennisdetails/tennisdetails.component';
import {LedgerComponent} from './ledger/ledger.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {MybetsComponent} from './mybets/mybets.component';
import {CasinoComponent} from './casino/casino.component';
import {TimerOverlayComponent} from './timer-overlay/timer-overlay.component';
import {SoccerdetailsComponent} from './soccerdetails/soccerdetails.component';
import {DwRequestsComponent} from './dw-requests/dw-requests.component';
import {DepositsComponent} from './deposit/deposit.component';
import {WithdrawsComponent} from './withdraw/withdraw.component';
import {DepositFormComponent} from './modals/deposit-form/deposit-form.component';
import {WithdrawFormComponent} from './modals/withdraw-form/withdraw-form.component';
import {MainComponent} from './main/main.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {RegisterModalComponent} from './modals/register-modal/register-modal.component';
import {RefererComponent} from './referer/referer.component';
import {PopupModalComponent} from './modals/popup/popup.component';
import {LivecasinoComponent} from "./livecasino/casino.component";
import {CasinoDwComponent} from "./casino-dw/casinodw.component";
import {CasinoDepositComponent} from './modals/casino-deposit/deposit-form.component';
import {CasinoWithdrawComponent} from './modals/casino-withdraw/withdraw-form.component';
import {CasinoLedgerComponent} from "./casino-ladger/ledger.component";
import {ProofListComponent} from "./modals/proof-list/proof-list.component";
import {CasinoDetailComponent} from "./casino-detail/detail.component";
import {MybetListComponent} from "./my-bets/bets.component";
import {SupportComponent} from "./modals/support/support.component";
import {RulesModelComponent} from "./modals/rule-book/book.component";
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
import {LoginModalComponent} from "./modals/login-model/login-modal.component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        CarouselComponent,
        FooterComponent,
        DashboardComponent,
        LoginComponent,
        SidenavComponent,
        MatchdetailComponent,
        BetslipComponent,
        NewDashboardComponent,
        RegisterComponent,
        RechargeWalletComponent,
        RechargeHistoryComponent,
        MatchComponent,
        CricketComponent,
        FootballComponent,
        TennisComponent,
        InplayMatchesComponent,
        ChangePasswordComponent,
        TermsConditionsComponent,
        ProfileComponent,
        TennisdetailsComponent,
        LedgerComponent,
        MybetsComponent,
        CasinoComponent,
        TimerOverlayComponent,
        SoccerdetailsComponent,
        DepositsComponent,
        DwRequestsComponent,
        WithdrawsComponent,
        DepositFormComponent,
        WithdrawFormComponent,
        MainComponent,
        RegisterModalComponent,
        RefererComponent,
        PopupModalComponent,
        LivecasinoComponent,
        CasinoDwComponent,
        CasinoDepositComponent,
        CasinoWithdrawComponent,
        CasinoLedgerComponent,
        ProofListComponent,
        CasinoDetailComponent,
        MybetListComponent,
        SupportComponent,
        RulesModelComponent,
        UnsettlebetListComponent,
        ProfitLossComponent,
        ComingSoonComponent,
        BonusComponent,
        BonusLedgerComponent,
        LandingPageComponent,
        ContactPageComponent,
        PrivacyPageComponent,
        GameRulePageComponent,
        TermsPageComponent,
        LoginModalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatMenuModule,
        MatTabsModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        FormsModule,
        IvyCarouselModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        NgbCollapseModule,

        ToastrModule.forRoot(),
        NgbModule,
    ],
    entryComponents: [
        BetslipComponent, ChangePasswordComponent
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
