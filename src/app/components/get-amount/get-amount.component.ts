import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-get-amount',
  templateUrl: './get-amount.component.html',
  styleUrls: ['./get-amount.component.scss']
})
export class GetAmountComponent implements OnInit {

  fundForm = this._fb.group({
    value:  ['', [Validators.required, Validators.min(this.data.min), Validators.max(this.data.max)]],
  })

  constructor(
    public dialogRef: MatDialogRef<GetAmountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
  ) {
    console.log(this.data)
   }

  ngOnInit(): void {
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

  getAmount(){
    this.dialogRef.close(this.fundForm.value.value);
  }

}
