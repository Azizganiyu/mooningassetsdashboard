import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private toastrService: ToastrService,
  ) { }

  discount(price, discount){
    return (price - ((discount / 100) * price)).toLocaleString()
  }

  discountInt(price, discount){
    return (price - ((discount / 100) * price))
  }

  formatAdsDetailPostData(value){

    // Months array
    let months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Convert timestamp to milliseconds
    let date = new Date(value);

    // Year
    let year = date.getFullYear();

    // Month
    let month = months_arr[date.getMonth()];

    // Day
    let day = date.getDate();

    // Hours
    let hours = date.getHours();

    // Minutes
    let minutes = "0" + date.getMinutes();

    // Seconds
    let seconds = "0" + date.getSeconds();

    // Display date time in MM-dd-yyyy h:m:s format
    let convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return convdataTime

  }

  formatDate(value){

    // Months array
    let months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Convert timestamp to milliseconds
    let date = new Date(value);

    // Year
    let year = date.getFullYear();

    // Month
    let month = months_arr[date.getMonth()];

    // Day
    let day = date.getDate();

    // Display date time in MM-dd-yyyy h:m:s format
    let convdataTime = month+'-'+day+'-'+year;

    return convdataTime

  }

  formatTime(value){
    // Convert timestamp to milliseconds
    let now = new Date()
    let date = new Date(value);

    let day = date.getDate();
    let year = date.getFullYear().toString().substr(-2);
    let month = date.getMonth();
    let hours = date.getHours();
    let mins = date.getMinutes();

    return day+ '/' +month+ '/' +year+ ' ' +hours+':'+mins+(hours > 11? 'PM':'AM')
  }

  cutText(name, chars){
    return (name.length > chars)? name.substr(0, chars)+'...': name
  }

  addDays(date, days){
    let start = new Date(date)
    start.setDate(start.getDate()+days)
    return this.formatAdsDetailPostData(start)
  }

  public showSuccess(message, title) {
    this.toastrService.success(message, title);
  }

  public showError(message, title) {
    this.toastrService.error(message, title);
  }
}
