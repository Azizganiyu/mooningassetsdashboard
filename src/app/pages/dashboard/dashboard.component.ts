import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'app/services/auth/auth.service';
import Chart from 'chart.js';


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{


  loading: boolean = true

  funds: any
  earnings: any
  withdrawals: any
  transactions: any
  transactionData: any = []

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
    ) {
  }


  ngOnInit(){
    this.getAmountFunded()
  }

  getAmountFunded(){
    this.afs.collection('fund_request', ref => ref.where('uid', '==', this.auth.user.uid)).get()
    .subscribe((data) => {
      if(!data.empty){
        let count = 0
        data.forEach((fund) => {
          if(fund.data().accepted){
            count += fund.data().planAmount
          }
        })
        this.funds = '$'+count.toLocaleString()
      }
      else{
        this.funds = '$0'
      }
      this.getEarnings()
    })
  }

  getEarnings(){
    this.afs.collection('transactions', ref => ref.where('uid', '==', this.auth.user.uid)).get()
    .subscribe((data) => {
      if(!data.empty){
        let transactions = 0
        let credit = 0
        let debit = 0
        let transactionData = []
        data.forEach((fund) => {
          transactions++
          credit += fund.data().type == 'credit'? fund.data().value:0
          debit += fund.data().type == 'debit'? fund.data().value:0
          transactionData.push({...fund.data()})
        })
        this.transactionData = transactionData
        this.transactions = transactions
        this.earnings = '$'+credit.toLocaleString()
        this.withdrawals = '$'+(debit)
      }
      else{
        this.transactions = 0
        this.earnings = '$0'
        this.withdrawals = '$0'
      }
      this.loading = false
    })
  }

}
