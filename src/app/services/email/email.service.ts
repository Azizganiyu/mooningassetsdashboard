import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

interface accept {
  accepted: any;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  self: string = "info@apexxoptions.com"

  // setting = {
  //   host:'smtp.gmail.com',
  //   username:'azizganiyu0@gmail.com',
  //   password:'gmonivehu@4real',
  //   secure: false,
  //   port: 587,
  //   from: 'Aziz'
  // }

  setting = {
    host:'mail.apexxoptions.com',
    username:'info@apexxoptions.com',
    password:'$aeMz1Ijlh7p',
    secure: false,
    port: 587,
    from: 'Apexx Options'
  }

  //url = 'http://localhost:4000/'
  url = 'https://nodemailer-webapp.herokuapp.com/'

  constructor(private _http: HttpClient) { }

  sendMail(data){
    let email = {email: this.self}
    let headers = new HttpHeaders();
    headers.set('Accept', 'application/json');

   return this._http.post<accept>(
      this.url+'sendcontactmail',
      {...data, ...email, ...this.setting},
      {headers: headers}
    )
  }



  notifySelf(message){
    let data = {
      email: this.self,
      subject: 'Apexx Options'
    }
    let headers = new HttpHeaders();
    headers.set('Accept', 'application/json');

   return this._http.post<accept>(
      this.url+'sendmail',
      {...message, ...data, ...this.setting},
      {headers: headers}
    )
  }

  notify(data){
    let headers = new HttpHeaders();
    headers.set('Accept', 'application/json');

   return this._http.post<accept>(
      this.url+'sendmail',
      {...data, ...this.setting},
      {headers: headers}
    )
  }

  template(name, text){
    return `<img style="margin:auto;" src="https://apexxoptions.com/assets/images/brand-trans.png" alt="image" />
    <h4>Hello ${name}</h4><p>${text}</p>`
  }
}
