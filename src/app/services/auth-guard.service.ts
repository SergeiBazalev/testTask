import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router) { }

  canActivate() {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}

