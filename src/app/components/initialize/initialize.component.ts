import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-initialize',
  templateUrl: './initialize.component.html',
  styleUrls: ['./initialize.component.css']
})
export class InitializeComponent implements OnInit {

  decKey: string = '$aeMz1Ijlh7p'
  uid: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AuthService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if(params.u){
        this.uid = params.u
        this.getLoginDetails()
      }
      else{
        this.router.navigate(['dashboard'])
      }
    })

  }

  ngOnInit(): void {
    //this.router.navigate(['dashboard'])
  }

  getLoginDetails(){
    this.afs.collection('ota').doc(this.uid).get()
    .subscribe((data) => {
      if (data.exists){
        this.authenticate(data.data().email, data.data().password, data.data().key)
      }
      else{
        this.router.navigate(['dashboard'])
      }
    }, (error => {
      console.log(error)
    }))
  }

  async authenticate(email, pass, key){
    const decEmail = CryptoJS.AES.decrypt(email.trim(), key.trim()).toString(CryptoJS.enc.Utf8);
    const decPassword = CryptoJS.AES.decrypt(pass.trim(), key.trim()).toString(CryptoJS.enc.Utf8);

    await this.auth.emailSignin({email: decEmail, password: decPassword});

    this.afs.collection('ota').doc(this.uid).delete()
    .then(() => {
      this.router.navigate(['dashboard'])
    })
    .catch((error) => {
      console.log(error)
    })

    // if(!login.status){

    // } else {
    //   this.router.navigate(['dashboard'])
    // }

  }



}
