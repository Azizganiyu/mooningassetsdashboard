import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'app/services/auth/auth.service';
import { HelperService } from 'app/services/helper/helper.service';

@Component({
  selector: 'app-post-address',
  templateUrl: './post-address.component.html',
  styleUrls: ['./post-address.component.scss']
})
export class PostAddressComponent implements OnInit {

  fundForm = this._fb.group({
    value:  ['', [Validators.required]],
    addressPaidTo: ['', [Validators.required]],
    paymentID: ['', [Validators.required]],
    paymentType: ['', [Validators.required]],
    paymentPlan: ['', [Validators.required]],
    planAmount: ['', [Validators.required]],
  })

  submit: boolean = false

  constructor(
    public dialogRef: MatDialogRef<PostAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private afs: AngularFirestore,
    private auth: AuthService,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
    this.fundForm.patchValue({
      addressPaidTo: this.data.addressPaidTo,
      value: this.data.value,
      paymentType: this.data.paymentType,
      paymentPlan : this.data.paymentPlan,
      planAmount : parseInt(this.data.planAmount),
      paymentID : this.data.paymentID
    })
  }

  close() {
    this.dialogRef.close();
  }

  yes(){
    this.dialogRef.close(true);
  }

  no(){
    this.dialogRef.close(false);
  }

  requestFunding(){
    this.submit = true

    let data = {
      ...this.fundForm.value,
      rejected: 0,
      accepted: 0,
      uid: this.auth.user.uid,
      date: new Date().getTime(),
    }

    console.log(data)

    this.afs.collection('fund_request').doc(data.paymentID).set(data).then(() => {
      this._helper.showSuccess('You will be confirmed within the next 4hrs', 'Request Sent!')
      this.submit = false
      this.close()
    }).catch((error) => {
      this._helper.showError(error, "Error sending request, please contact admin")
      this.submit = false
    })
  }

}
