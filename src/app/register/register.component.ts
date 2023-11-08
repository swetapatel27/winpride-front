import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router,ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: any;
  errorMsg: any;
  successMsg: string;
  submitted = false;
  inpReadonly = false;
  clicked = false;

  constructor(private _location: Location,private router: Router,private route: ActivatedRoute, private fb: FormBuilder, private userService: UserService) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      role: ['5',],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      // email:['',[Validators.required,Validators.email]],
      referer_name: [null,]
    });
    // Accessing query parameters
    this.route.queryParams.subscribe(params => {
      const parameterValue = params['username'];
      if(parameterValue){
        this.registerForm.get('referer_name').setValue(parameterValue);
        this.inpReadonly = true;
      }
    });
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else {
      this.clicked = true;

      this.userService.createUser(this.registerForm.value).subscribe(
        (res: any) => {
          this.clicked=false;
          if (res.errors) {
            this.errorMsg = res.errors;
          } else {
            this.submitted=false;
            this.successMsg = 'Registration was successful!';
            this.registerForm.reset({
              role: this.registerForm.get('role').value,
              referer_name: this.registerForm.get('referer_name').value
            });
            setTimeout(() => {
              this.successMsg="";
            },2000);
            //this.router.navigateByUrl('register');
          }
        },
        (error) => {
          this.clicked=false;
          if (error.status === 422) {
            this.errorMsg = error.error.errors.map((errorObj: any) => errorObj.username).join(' ');
            setTimeout(() => {
              this.errorMsg="";
            },5000);
          }
        }
      );

      return ;
    }

  }

}
