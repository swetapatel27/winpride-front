import {Component, OnInit} from '@angular/core';
import {ExposureService} from "../services/exposure.service";
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {ChangePasswordComponent} from "../modals/change-password/change-password.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  baseurl = window.location.origin;
  user_id = localStorage.getItem("user_id");
  balance = 0;
  exposure: any = [];
  username = localStorage.getItem('username');
  cricket_all_bets_pl: any = [];
  // refrerurl: any = environment.base_url+'/referer/'+localStorage.getItem('username');
  refrerurl: any = this.baseurl + '/register?username='+localStorage.getItem('username');

  constructor(private userService: UserService, private exposureService: ExposureService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
      this.balance = data.balance;
    });
    this.exposureService.getExposure().subscribe((data: any) => {
      // console.log('eeee',data[0]);
      this.exposure = data;
    }, (error) => {
      this.exposure = [];
    })
    this.exposureService.getAllBetsPl().subscribe((res: any) => {
      this.cricket_all_bets_pl = res;
    });
  }

  copyMessage(val: any){
    const selBox:any = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';

    // extract html
    const span = document.createElement('span');
    span.innerHTML = val;
    
    selBox.value = span.textContent || span.innerText;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}

// config: MatDialogConfig = {
//   disableClose: false,
//   hasBackdrop: true,
//   backdropClass: 'test',
//   width: '90%',
//   height: '50%',
//   panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
// };
//
// openDialog()
// {
//   const dialogRef = this.dialog.open(ChangePasswordComponent, {});
//
//   dialogRef.afterClosed().subscribe((result: any) => {
//     console.log(`Dialog result: ${result}`);
//   });
//
// }


