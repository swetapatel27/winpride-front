import {Component,ViewChild, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from "../services/user.service";
import {ExposureService} from "../services/exposure.service";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {RegisterModalComponent} from "../modals/register-modal/register-modal.component";
import {PopupModalComponent} from "../modals/popup/popup.component";
import {ChangePasswordComponent} from "../modals/change-password/change-password.component";
import {LoginModalComponent} from "../modals/login-model/login-modal.component";
import { ReloadService } from '../services/reload.service';
import {LiveCasinoService} from "../services/livecasino.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  isLoggedIn: boolean = false;
  user_id = localStorage.getItem("user_id");
  username = localStorage.getItem("username");
  balance = 0;
  exposure: any = [];
  loginForm: any;
  errorMsg: any;
  submitted = false;
  balanceUpdated : boolean =false;

  constructor(public dialog: MatDialog,private router: Router, private fb: FormBuilder, private userService: UserService, private exposureService: ExposureService,private authService:AuthService, private reloadService: ReloadService,private liveCasinoService: LiveCasinoService) {

  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (localStorage.getItem("isLoggedIn") == "true") {
      this.isLoggedIn = true;

      this.userService.refreshBalance.subscribe(() => {
        this.getBalance();
      })
      this.getBalance();
      this.exposureService.refresh.subscribe(() => {
        this.getExposureDetails();
      })
      this.getExposureDetails();
    }
    const istrue:any = false;
    const isPopup:any = localStorage.getItem("popup");
    if(!isPopup) this.openPopupModal();
    setTimeout(()=>{
      localStorage.setItem("popup",istrue);
    }, 5000);

    this.reloadService.reload$.subscribe(() => {
      this.refresh();
    });
    setTimeout(()=>{
      this.casinoBalanceToAccount();
      this.casinoLedger();
    }, 2000);
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  logout() {
    this.authService.logout();
    this.router.navigate([""]).then(() => {
      window.location.reload();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  login() {

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.authService.logIn(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res.error) {
            this.errorMsg = res.message;
          } else {
            localStorage.setItem('token', res.data['token']);
            localStorage.setItem('username', res.data['username']);
            localStorage.setItem('role', res.data['role']);
            localStorage.setItem('user_id', res.data['userId']);
            localStorage.setItem('isLoggedIn', "true");
            this.router.navigateByUrl('/dashboard/home');
            // window.location.reload();
          }
        }, error: (err) => {
          //console.log('err->', err);

          if (err.error.errors[0].hasOwnProperty('username')) {
            this.errorMsg = err.error.errors[0].username;
          } else {
            this.errorMsg = err.message;
          }

        }
      });
    }
    // this.router.navigate(["login"]);
  }
sports(){
    this.router.navigateByUrl("dashboard/match")
}
  logOut() {
    localStorage.removeItem("isLoggedIn");
    this.router.navigate(["login"]).then(() => {
      window.location.reload();
    });
  }

  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  getExposureDetails() {
    this.exposureService.getExposure().subscribe((data: any) => {
      // console.log('eeee',data[0]);
      this.exposure = data;
    }, (error) => {
      this.exposure = [];
    })
  }

  getBalance() {
    this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
      this.balance = data.balance;
    })
  }

  refresh() {
    if (localStorage.getItem("isLoggedIn") == "true") {
      this.isLoggedIn = true;
      this.userService.getBalanceNext();
      this.exposureService.getExposureNext();

      this.userService.refreshBalance.subscribe(() => {
        this.getBalance();
      })
      this.getBalance();
      this.exposureService.refresh.subscribe(() => {
        this.getExposureDetails();
      })
      this.getExposureDetails();
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

   openRegister(){
      const dialogRef = this.dialog.open(RegisterModalComponent, { autoFocus: false, maxHeight: '100vh' });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
      });
  }
  openlogin(){
      const dialogRef = this.dialog.open(LoginModalComponent, { autoFocus: false, maxHeight: '100vh' });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
      });
  }
  openPopupModal(){
    const dialogRef = this.dialog.open(PopupModalComponent, {});
    dialogRef.afterClosed().subscribe((result: any) => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  casinoBalanceToAccount(){
    if(this.balanceUpdated==false){
      const data ={
        id:this.user_id
     }
     this.liveCasinoService.convertCasinoBalance(data).subscribe((data: any) => {
     })
     this.balanceUpdated=true;
    }

}
casinoLedger(){
  this.liveCasinoService.ledgerEntryCasino(this.user_id).subscribe((data: any) => {
  })
}

}
