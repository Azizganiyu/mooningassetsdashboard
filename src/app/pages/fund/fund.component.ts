import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.css']
})
export class FundComponent implements OnInit {

  value: number = 0;
  nairaRate:number = 4091325.59
  fundForm = this._fb.group({
    value:  ['', [Validators.required]]
  })

  constructor(
    private _fb: FormBuilder
  ) {
    this.fundForm.get('value').valueChanges.subscribe((val) => {
      this.value = val*this.nairaRate
    })
  }

  ngOnInit(): void {
  }

}
