import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Clipboard } from '@angular/cdk/clipboard';
import { HelperService } from 'app/services/helper/helper.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-fund-modal',
  templateUrl: './fund-modal.component.html',
  styleUrls: ['./fund-modal.component.scss']
})
export class FundModalComponent implements OnInit {

  url = "https://blockchain.info/tobtc?currency=USD&value="
  bitcoin: any = 'Loading...'
  submit: boolean = false
  activeTabIndex: number = 0
  addressPaidTo: string = "please wait..."
  value: any
  paymentType: string = "bitcoin"
  paymentPlan: string = this.data.plan
  planAmount: number = this.data.amount

  constructor(
    public dialogRef: MatDialogRef<FundModalComponent>,
    private _http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clipboard: Clipboard,
    private _helper: HelperService,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.getWalletAddress()
    this.getRate(this.data.amount)
  }

  // ngAfterViewInit() {
  //   console.log('afterViewInit => ', this.tabGroup.selectedIndex);
  // }

  close() {
    this.dialogRef.close();
  }

  yes(){
    let data = {
      addressPaidTo: this.addressPaidTo,
      value: this.value,
      paymentType: this.paymentType,
      paymentPlan : this.paymentPlan,
      planAmount : this.planAmount
    }
    this.dialogRef.close(data);
  }

  no(){
    this.dialogRef.close(false);
  }

  getRate(value){
    let headers = new HttpHeaders();
    headers.set('Accept', 'application/json');

   return this._http.get(
      this.url+value,
      {headers: headers}
    ).subscribe(data => {
      this.bitcoin = '₿ '+data
      this.value = data
    })
  }

  copy(){
    this.clipboard.copy(this.addressPaidTo)
    this._helper.showSuccess('', 'Copied!')
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    //console.log('tabChangeEvent => ', tabChangeEvent);
    this.activeTabIndex = tabChangeEvent.index
  }

  getWalletAddress(){
    this.afs.collection('admin').doc('settings').get()
    .subscribe((data) => {
      this.addressPaidTo = data.data().wallet
    })
  }

}
