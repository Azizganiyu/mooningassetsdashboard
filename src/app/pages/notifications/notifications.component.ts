import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth/auth.service';
import { HelperService } from 'app/services/helper/helper.service';
import { NotificationService } from 'app/services/notification/notification.service';
import {Observable} from "rxjs";
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewNotificationComponent } from 'app/components/view-notification/view-notification.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notification: Observable<any[]>

  constructor(
    public auth: AuthService,
    private matDialog: MatDialog,
    private notify: NotificationService,
    public _helper: HelperService
  ) {
    this.auth.user$.subscribe((data) => {
      if(data){
        this.notification = this.notify.notification
      }
    })
   }

  ngOnInit(): void {
  }

  view(item){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item
    dialogConfig.autoFocus = false;
    this.matDialog.open(ViewNotificationComponent, dialogConfig);
  }

}
