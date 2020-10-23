import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { tap, map, take } from "rxjs/operators";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore'

import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {User} from '../../models/user.model'
import {UserData} from '../../models/userData.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<UserData>;
  authState$: Observable<any>;
  user: any

  redirectLink: string = "/auth/verify-identity"

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ){
    this.authState$ = this.afAuth.authState
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user && user.emailVerified) {
          let userData = this.afs.doc<UserData>(`users/${user.uid}`).valueChanges();

          userData.subscribe((data) => {
            this.user = data
            if(!data.status){
              this.signOut()
            }
          })

            return userData


        } else {
          return of(null)
        }
      })
    )

    // this.afs.collection('users').get().subscribe((data) => {
    //   data.forEach((value) => {

    //     this.afAuth.currentUser.then((result) => { result.updateProfile({
    //       displayName: value.data().displayName,
    //       photoURL: value.data().photoURL
    //     }).then(()=>{
    //       console.log('updated')
    //     })

    //   })
    // })
  }


  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credentials = await this.afAuth.signInWithPopup(provider);
    await this.updateUserData(credentials.user);
    return {status: true, message: 'successfully logged in'}
  }

  async emailSignin(data) {
    const result = await this.afAuth.signInWithEmailAndPassword(data.email, data.password).then((credentials) => {
      return {status: true, message: 'successfully logged in'}
    }).catch((error) => {
      return {status: false, message: error.message}
    });
    return result;
  }

  async emailSignup(data) {
    const result = await this.afAuth.createUserWithEmailAndPassword(data.email, data.password).then((credentials) => {
      this.afAuth.currentUser.then((result) => { result.updateProfile({
        displayName: data.full_name,
        photoURL: 'assets/images/avatar.png'
      }).then(()=>{
        const updateData = {
          uid: credentials.user.uid,
          email: credentials.user.email,
          displayName: data.full_name,
          photoURL: 'assets/images/avatar.png',
          country: data.country,
          address: data.address,
          currency: data.currency,
          phoneCode: data.phone_code,
          phone: data.phone_number
        };
        return this.updateUserData(updateData)
      })
    });
      this.sendVerificationMail()
      return {status: true, message: 'successfully signed up'}
    }).catch((error) => {
      return {status: false, message: error.message}
    });
    return result;
  }


  async signOut() {
    await this.afAuth.signOut();
    location.href = `https://apexxoptions.com/auth/sign-out`
  }

  async resetPassword(data) {
    const result = await this.afAuth.sendPasswordResetEmail(data.email).then(() => {
      return {status: true, message: 'Recovery email successfully sent'}
    }).catch((error) => {
      return {status: false, message: error.message}
    });
    return result;
  }

  async changePassword(data) {
    const user = await this.afAuth.currentUser;
    const credentials = auth.EmailAuthProvider.credential(user.email, data.oldpassword);
    const authenticate = await user.reauthenticateWithCredential(credentials).then(() => {
          return {status: true, message: 'authenticated'};
        }).catch((error) => {
          return {status: false, message: error};
        });
    if(authenticate.status){
      const changePass = await user.updatePassword(data.newpassword).then(() => {
        return {status: true, message: 'Successfull changed password'};
      }).catch((error) => {
        return {status: false, message: error};
      });

      return changePass
    }
    else{
      return authenticate;
    }
  }

  async changeEmail(data) {
    const user = await this.afAuth.currentUser;
    const credentials = auth.EmailAuthProvider.credential(user.email, data.password);
    const authenticate = await user.reauthenticateWithCredential(credentials).then(() => {
          return {status: true, message: 'authenticated'};
        }).catch((error) => {
          return {status: false, message: error};
        });
    if(authenticate.status){
      const changeEmail = await user.updateEmail(data.email).then(() => {
        this.afs.doc(`users/${this.user.uid}`).set({email: data.email}, {merge: true});
        return {status: true, message: 'Successfull changed email'};
      }).catch((error) => {
        return {status: false, message: error};
      });

      return changeEmail
    }
    else{
      return authenticate;
    }
  }


  private async updateUserData(values){
    const random = Math.random().toString(36).substring(2, 2) + Math.random().toString(36).substring(2, 8)
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${values.uid}`);
    await userRef.get().toPromise().then((data) => {
      if(!data.exists){
        console.log('user does not exists')
        const data = {
          ...values,
          role: 'user',
          status: 1,
          verified: 0,
          requestedVerification: 0,
          username: values.displayName.replace(/\s+/g, '-').toLowerCase()+'-'+random,
          date: new Date().getTime(),
        };
        return userRef.set(data, {merge: true});
      }
    })
  }

  sendVerificationMail(){
    this.afAuth.currentUser.then((result) => {
      result.sendEmailVerification().then(() => {
        console.log('email sent')
      }).catch((err) => console.log(err));
    })
  }

  async updatePhoto(result){
    await this.afAuth.currentUser.then((user) => {
      user.updateProfile({
      photoURL: result
      })
    })
    const userRef = this.afs.doc(`users/${this.user.uid}`);
    return userRef.set({photoURL: result}, {merge: true});
  }

  updateUser(data){
    const values = {
      displayName: data.full_name,
      phone: data.phone_number,
      country: data.country,
      address: data.address,
      currency: data.currency,
      phoneCode: data.phone_code,
    };

    return this.afs.doc(`users/${this.user.uid}`).set(values, {merge: true});
  }

  updateSocial(data){
    const values = {
      about: data.about,
      website: data.website? data.website: '',
      facebook: data.facebook,
      twitter: data.twitter? data.twitter: '',
      instagram: data.instagram? data.instagram: '',
      linkedin: data.linkedin? data.linkedin: '',
      updatedExtra: 1
    };

    return this.afs.doc(`users/${this.user.uid}`).set(values, {merge: true});
  }

  getUser(id){
    return this.afs.collection<UserData>('users').doc(id).get()
  }
  getUserByUsername(username){
    return this.afs.collection<UserData>('users', ref => ref.where('username', '==', username)).get()
  }
}
