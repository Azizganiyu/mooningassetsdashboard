import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FundModalComponent } from 'app/components/fund-modal/fund-modal.component';
import { PostAddressComponent } from 'app/components/post-address/post-address.component';
import { Observable } from 'rxjs';
import { AuthService } from 'app/services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { HelperService } from 'app/services/helper/helper.service';
import { GetAmountComponent } from 'app/components/get-amount/get-amount.component';

interface Request {
  uid: string;
  accepted: number;
  rejected: number;
  value: number;
  addressPaidTo: string;
  addressPaidFrom: string;
  paymentPlan: string;
  paymentType: string;
  planAmount: string;
  date: number;
}

export interface RequestId extends Request { id: string; }

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.scss']
})
export class FundComponent implements OnInit {

  requests: Observable<RequestId[]>;

  plans = {
    starter: {
      min: 200,
      max: 1000
    },
    premium: {
      min: 1000,
      max: 5000
    },
    deluxe: {
      min: 5000,
      max: 10000
    },
    exclusive: {
      min: 10000,
      max: 100000
    }
  }
  constructor(
    private _http: HttpClient,
    private matDialog: MatDialog,
    private auth: AuthService,
    private afs: AngularFirestore,
    public _helper: HelperService
  ) {
  }

  ngOnInit(): void {
    this.fundings()
  }

  getAmount(plan){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.plans[plan];
    dialogConfig.autoFocus = false;
    let dialogRef = this.matDialog.open(GetAmountComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        this.fund(result, plan)
      }
    });
  }

  fund(amount, plan){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      amount: amount,
      plan: plan
    };
    dialogConfig.autoFocus = false;
    let dialogRef = this.matDialog.open(FundModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        this.getAddress(result)
      }
    });
  }

  getAddress(data){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    dialogConfig.autoFocus = false;
    let dialogRef = this.matDialog.open(PostAddressComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      if(result){

      }
    });
  }

  fundings(){
    this.requests = this.afs.collection<Request>('fund_request', ref => ref.where('uid', '==', this.auth.user.uid).limit(20).orderBy("date", "desc"))
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Request;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }


}
