import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { Observable } from 'rxjs';
import { tap, map, take } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

   canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.authService.redirectLink = state.url;
      return this.authService.user$.pipe(
        take(1),
        map(user => !!user),
        tap(loggedIn => {
          if(!loggedIn){
            location.href = `https://apexxoptions.com/auth`
          }
        })
      );
      // const status = this.authService.authState$.pipe(
      //   map(user => {
      //     return (user && user.emailVerified)
      //   })
      // );

      // if(status){
      //   return true
      // }else{
      //   this.router.navigate(['/auth/login']);
      // }
  }


}
