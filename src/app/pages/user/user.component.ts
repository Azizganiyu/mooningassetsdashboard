import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { masterCountries } from 'app/shared/master-countries';
import { HelperService } from 'app/services/helper/helper.service';
import { AngularFireStorage } from '@angular/fire/storage';
import {Observable} from 'rxjs'
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.scss']
})

export class UserComponent implements OnInit{

  countryList = masterCountries

  userForm = this.fb.group({
    full_name: ['', [Validators.required]],
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    country: [null, [Validators.required]],
    address: ['', [Validators.required]],
    currency: [null, [Validators.required]],
    phone_code: [null, [Validators.required]],
    phone_number: ['', [Validators.required]],
  });

  submit: boolean = false;

  amountFunded: any = 'Loading...'
  amountEarned: any = 'Loading...'
  balance: any = 'Loading...'

  imageInfo : string = ""
  openUploader: boolean = false
  uploading : boolean = false
  uploadPercent: Observable<number>;
  imagePreview : any = 'assets/images/placeholder.png'
  fileData: File = null;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private _helper: HelperService,
    private storage: AngularFireStorage,
    private afs: AngularFirestore
    ) {
      this.userForm.patchValue({
        full_name: this.auth.user.displayName,
        email: this.auth.user.email,
        country: this.auth.user.country,
        address: this.auth.user.address,
        currency: this.auth.user.currency,
        phone_code: this.auth.user.phoneCode,
        phone_number: this.auth.user.phone,
      })
  }

  ngOnInit(){
    this.getAmountFunded()
    this.getEarnings()
  }

  updateProfile(){
    this.submit = true
    this.auth.updateUser(this.userForm.value).then(()=>{
      this.submit = false
      this._helper.showSuccess('Successfully updated user profile', 'Operation Successfull')
    }).catch((error) => {
      this.submit = false
      this._helper.showError(error.message, "Error updating profile")
    })
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }


  preview() {
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      this.imageInfo = "invalid image"
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.imagePreview = reader.result;
    }
    this.startUpload()
  }

  startUpload() {

    const name = `${Date.now()}_${this.fileData.name}`
    const path = `uploads/${name}`;

    const ref = this.storage.ref(path)
    const task = ref.put(this.fileData);

      this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe((data) => {

          this.auth.updatePhoto(data).then(() => {
            this._helper.showSuccess('Successfully updated profile image', 'Operation Successfull')
            this.uploadPercent = null
          }).catch((error) => {
            console.log(error)
            this._helper.showError(error, "Error updating profile image")
            this.uploadPercent = null
          })

        })

      } )
   )
  .subscribe()

  }

  round(value){
    return Math.round(value)
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
        this.amountFunded = '$'+count.toLocaleString()
      }
      else{
        this.amountFunded = '$0'
      }
    })
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
