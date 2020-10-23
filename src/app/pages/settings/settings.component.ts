import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth/auth.service';
import { HelperService } from 'app/services/helper/helper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  updatingChangepassForm: boolean = false
  updatingChangeemailForm: boolean = false

  changepassForm = this.fb.group({
    oldpassword: ['', [Validators.required]],
    newpassword: ['', [Validators.required]],
  });

  changeemailForm = this.fb.group({
    password: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private _helper: HelperService
  ) { }

  ngOnInit(): void {
  }

  async changePass(){
    this.updatingChangepassForm = true
    const change = await this.auth.changePassword(this.changepassForm.value);
    if(change.status){
      this._helper.showSuccess(change.message, 'Operation Successfull')
    }
    else{
      this._helper.showError(change.message, "Error changing password")
    }
    this.updatingChangepassForm = false
  }

  async changeEmail(){
    this.updatingChangeemailForm = true
    const change = await this.auth.changeEmail(this.changeemailForm.value);
    if(change.status){
      this._helper.showSuccess(change.message, 'Operation Successfull')
    }
    else{
      this._helper.showError(change.message, "Error changing email")
    }
    this.updatingChangeemailForm = false
  }

}
