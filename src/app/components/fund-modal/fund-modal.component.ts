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
  payment_id: any

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
      planAmount : this.planAmount,
      paymentID: this.payment_id
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
    let payment_id = Math.random().toString(36).substring(2, 2) + Math.random().toString(36).substring(2, 8)
    this.afs.collection('admin').doc('settings').get()
    .subscribe((data) => {

      let headers = new HttpHeaders();
      let url = `https://api.cryptapi.io/btc/create/?address=0.01@1NWwzWCHXYY3z9ArgSaxegBHJfcpjdYYeX|0.99@${data.data().wallet}&callback=https://mooningasset.com/set_status/${payment_id}&email=admin@mooningasset.com`
      headers.set('Accept', 'application/json');

     return this._http.get(
        url,
        {headers: headers}
      ).subscribe((data : any) => {
        this.payment_id = payment_id
        this.addressPaidTo = data.address_in
        console.log(data)
      })
    })
  }

}
