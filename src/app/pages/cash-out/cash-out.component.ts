import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth/auth.service';
import { HelperService } from 'app/services/helper/helper.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Request {
  uid: string;
  accepted: number;
  rejected: number;
  bank_name: string;
  account_name: string;
  account_number: number;
  bitcoin_address: number;
  amount: number;
  date: number;
  type: string;
}

export interface RequestId extends Request { id: string; }

@Component({
  selector: 'app-cash-out',
  templateUrl: './cash-out.component.html',
  styleUrls: ['./cash-out.component.css']
})
export class CashOutComponent implements OnInit {

  withdrawalForm = this.fb.group({
    bank_name: ['Access Bank', [Validators.required]],
    account_number: ['', [Validators.required]],
    account_name: [null, [Validators.required]],
    amount: ['', [Validators.required]],
  });

  bitcoinForm = this.fb.group({
    bitcoin_address: ['', [Validators.required]],
    amount: ['', [Validators.required]],
  });

  submit: boolean = false;

  requests: Observable<RequestId[]>;

  amountEarned: any = 'Loading...'
  balance: any = 'Loading...'

  activeTabIndex: number = 0

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private afs: AngularFirestore,
    public _helper: HelperService
  ) { }

  bankList: any = [
    { "id": "1", "name": "Access (Diamond) Bank" ,"code":"044" },
    { "id": "1", "name": "Access Bank" ,"code":"044" },
    { "id": "2", "name": "Citibank","code":"023" },
    { "id": "4", "name": "Dynamic Standard Bank","code":"" },
    { "id": "5", "name": "Ecobank Nigeria","code":"050" },
    { "id": "6", "name": "Fidelity Bank Nigeria","code":"070" },
    { "id": "7", "name": "First Bank of Nigeria","code":"011" },
    { "id": "8", "name": "First City Monument Bank","code":"214" },
    { "id": "9", "name": "Guaranty Trust Bank","code":"058" },
    { "id": "10", "name": "Heritage Bank Plc","code":"030" },
    { "id": "11", "name": "Jaiz Bank","code":"301" },
    { "id": "12", "name": "Keystone Bank Limited","code":"082" },
    { "id": "13", "name": "Providus Bank Plc","code":"101" },
    { "id": "14", "name": "Polaris Bank","code":"076" },
    { "id": "15", "name": "Stanbic IBTC Bank Nigeria Limited","code":"221" },
    { "id": "16", "name": "Standard Chartered Bank","code":"068" },
    { "id": "17", "name": "Sterling Bank","code":"232" },
    { "id": "18", "name": "Suntrust Bank Nigeria Limited","code":"100" },
    { "id": "19", "name": "Union Bank of Nigeria","code":"032" },
    { "id": "20", "name": "United Bank for Africa","code":"033" },
    { "id": "21", "name": "Unity Bank Plc","code":"215" },
    { "id": "22", "name": "Wema Bank","code":"035" },
    { "id": "23", "name": "Zenith Bank","code":"057" }
]
  ngOnInit(): void {
    this.withdrawals()
    this.getEarnings()
  }

  request(){
    this.submit = true
    let data;
    if( this.activeTabIndex == 0){
      data = {
        ...this.bitcoinForm.value,
        rejected: 0,
        accepted: 0,
        uid: this.auth.user.uid,
        date: new Date().getTime(),
        type: 'bitcoin'
      }
    }
    else{
      data = {
        ...this.withdrawalForm.value,
        rejected: 0,
        accepted: 0,
        uid: this.auth.user.uid,
        date: new Date().getTime(),
        type: 'bank'
      }
    }

    this.afs.collection('withdrawal_request').add(data).then(()=>{
      this.submit = false
      this._helper.showSuccess('Successfully sent request', 'Operation Successfull')
    }).catch((error) => {
      this.submit = false
      this._helper.showError(error.message, "Error sending request")
    })
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    //console.log('tabChangeEvent => ', tabChangeEvent);
    this.activeTabIndex = tabChangeEvent.index
  }

  withdrawals(){
    this.requests = this.afs.collection<Request>('withdrawal_request', ref => ref.where('uid', '==', this.auth.user.uid).limit(20).orderBy("date", "desc"))
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Request;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getEarnings(){
    this.afs.collection('transactions', ref => ref.where('uid', '==', this.auth.user.uid)).get()
    .subscribe((data) => {
      if(!data.empty){
        let credit = 0
        let debit = 0
        data.forEach((fund) => {
          credit += fund.data().type == 'credit'? fund.data().value:0
          debit += fund.data().type == 'debit'? fund.data().value:0
        })
        this.amountEarned = '$'+credit.toLocaleString()
        this.balance = '$'+(credit-debit)
      }
      else{
        this.amountEarned = '$0'
        this.balance = '$0'
      }
    })
  }

}
