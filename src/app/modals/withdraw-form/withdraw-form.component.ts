import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {TransactionService} from "../../services/transaction.service";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-withdraw-form',
  templateUrl: './withdraw-form.component.html',
  styleUrls: ['./withdraw-form.component.css']
})
export class WithdrawFormComponent implements OnInit {
  withdrawForm: any;
  errorMsg: any;
  submitted = false;
  msgs:any = [];

  user_id = localStorage.getItem('user_id')

  username = localStorage.getItem('username');
  showUpiTextbox: boolean = false;
  showUpiOtherbox: boolean = false;

  clicked:boolean=false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private transactionService: TransactionService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.withdrawForm = this.fb.group({
      user_id: [this.user_id, Validators.required],
      txn_type: ['', Validators.required],
      upi: ['', Validators.required],
      amount: ['', Validators.required],
      account_id: ['', Validators.required],
      ifsc_code: ['', Validators.required],
      bank_name: ['', Validators.required],
      branch: ['', Validators.required],
      username: [this.username, Validators.required],
    });
  }

  get withdrawFormControl() {
    return this.withdrawForm.controls;
  }

  toggleUpiTextbox() {
    this.showUpiTextbox = true;
    this.showUpiOtherbox = false;
  }

  toggleBankbox() {
    this.showUpiOtherbox = true;
    this.showUpiTextbox = false;
  }

  addWithdrawRequest() {
    let request_details:any;
    if(this.withdrawForm.value.txn_type=='bank'){
      request_details = {
      user_id: this.user_id,
      amount: this.withdrawForm.value.amount,
      txn_type:this.withdrawForm.value.txn_type,
      account_id: this.withdrawForm.value.account_id,
      ifsc_code: this.withdrawForm.value.ifsc_code,
      bank_name: this.withdrawForm.value.bank_name,
      branch: this.withdrawForm.value.branch,
      username: this.username
    };
    }else if(this.withdrawForm.value.txn_type=='upi'){
      request_details = {
      user_id: this.user_id,
      amount: this.withdrawForm.value.amount,
      txn_type:this.withdrawForm.value.txn_type,
      upi:this.withdrawForm.value.upi,
      username: this.username
    };
    }
    var admin_id = 1;
    var transfer_data = {
      'amount':request_details.amount,
      'transfer_by':admin_id,
      'transfer_from_id':request_details.user_id,
      'transfer_to_id':admin_id
    };
    this.clicked=true;
    this.transactionService.addWithdrawRequest(request_details).subscribe((res: any) => {
      if (res.error) {
        this.errorMsg = res.error;
      } else {
        if (res.affectedRows > 0) {
          this.userService.transferFund(transfer_data).subscribe((res: any) => {
            if (res.errors) {
              this.errorMsg = res.errors;
            } else {
              this.clicked=false;
              this.toastr.success('Withdraw Request Sent');
              this.dismiss();
            }
          });
        }else{
          this.toastr.error('Something went wrong');
              this.dismiss();
        }
      }
    }, (error:any) => {
      //console.log('print-->', error.error.errors);
      this.errorMsg = error.error.errors;
      this.msgs = [];
      this.errorMsg.forEach((obj: any) => {
        Object.values(obj);
        this.msgs.push(Object.values(obj));
        this.toastr.error(this.msgs[0]);
      });
    });
  }


  dismiss() {
    this.dialogRef.close();
  }

}
