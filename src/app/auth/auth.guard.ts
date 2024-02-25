import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    isTokenExpired: boolean;
    constructor(private router: Router, private tokenService: TokenService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = localStorage.getItem('access_token');
        this.isTokenExpired = this.tokenService.isTokenExpired(token);
        console.log(token)
        console.log(this.isTokenExpired)
        if (this.isTokenExpired) {
        return true;
        } else {
        this.router.navigate(['/login-page']);
        return false;
        }
    }
}
