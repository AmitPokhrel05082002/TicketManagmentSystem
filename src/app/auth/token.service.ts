import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import * as jwt from 'jsonwebtoken';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getTokenExpirationDate(token: string): Date | null {
    const decodedToken: any = jwtDecode(token);
    if (!decodedToken.exp) return null;

    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);

    return date;
  }

  isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    if (expirationDate === null) return false;

    const now = new Date();

    // Convert expirationDate to UTC
    const expirationTimeUtc = new Date(expirationDate.toISOString()).getTime();

    // Convert now to UTC
    const currentTimeUtc = now.getTime() + now.getTimezoneOffset() * 60000;
    console.log(expirationTimeUtc)
    console.log(currentTimeUtc)
    return expirationTimeUtc > currentTimeUtc;
  }


}
