import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {LoginModalComponent} from "../modals/login-model/login-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  isMobile: boolean;
  loginForm: any;
  errorMsg: any;
  successMsg: string;
  submitted = false;

  constructor(public dialog: MatDialog,private router: Router, private fb: FormBuilder, private _authService: AuthService, private breakpointObserver: BreakpointObserver,private route: ActivatedRoute) {
    // this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
    //   this.isMobile = result.matches;
    // });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      const message = params['message'];
      if (message === 'RegistrationSuccessful') {
        this.successMsg = 'Registration was successful!';
      }
    });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  demologin() {
    //this.submitted = true;
    const loginId = {username:'test1', password:'12345'};
    this._authService.logIn(loginId).subscribe({
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

  login() {

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this._authService.logIn(this.loginForm.value).subscribe({
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

  }

  register() {
    this.router.navigateByUrl("register");
  }

    openlogin(){
      const dialogRef = this.dialog.open(LoginModalComponent, { autoFocus: false, maxHeight: '100vh' });
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
      });
  }
}
