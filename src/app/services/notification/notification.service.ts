import { Injectable } from '@angular/core';
import {Notification} from '../../models/notification.model'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export interface NotificationId extends Notification { id: string; }

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationCollection: AngularFirestoreCollection<Notification>;

  notification: Observable<NotificationId[]>;

  constructor(private readonly afs: AngularFirestore, private auth: AuthService) {

    this.auth.user$.subscribe((data) => {
      if(data){
        this.notificationCollection = afs.collection<Notification>('notifications', ref => ref.where('uid', '==', this.auth.user.uid).limit(20).orderBy("date", "desc"));

        this.notification = this.notificationCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Notification;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        );
      }
    })

  }

  create(receiver, title, url, description = ''){
    const data =  {
      title: title,
      read: 0,
      url: url,
      description: description,
      uid: receiver,
      date: new Date().getTime(),
    }

    this.afs.collection('notifications').add(data)
  }

  read(id){
    this.afs.collection('notifications').doc(id).set({read: 1}, {merge: true}).then(()=>{
      console.log('updated notification')
    }).catch((error) => {
      console.log(error)
    })
  }

}
