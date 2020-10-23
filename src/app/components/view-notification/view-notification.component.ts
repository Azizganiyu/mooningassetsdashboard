import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.scss']
})
export class ViewNotificationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ViewNotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
