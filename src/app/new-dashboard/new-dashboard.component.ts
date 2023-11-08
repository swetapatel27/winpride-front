import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { SupportComponent } from "../modals/support/support.component";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.css']
})
export class NewDashboardComponent implements OnInit {
  screenHeight: number;
  screenWidth: number;

  constructor(private authService: AuthService, public dialog: MatDialog) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    //console.log(this.screenWidth);
  }

  ngOnInit(): void {

  }

  isLoggedIn(): boolean {
    // Check the user's authentication status here
    // Return true if the user is logged in, false otherwise
    const isAuthenticated = this.authService.isLoggedIn();
    return isAuthenticated;
  }
  config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: 'test',
    width: '90%',
    height: '50%',
    panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
  };
  openDialog() {
    const dialogRef = this.dialog.open(SupportComponent,{minWidth: '90vw', maxHeight: '100vh' });
    dialogRef.afterClosed().subscribe((result: any) => {
      //console.log(`Dialog result: ${result}`);
    });

  }
}
