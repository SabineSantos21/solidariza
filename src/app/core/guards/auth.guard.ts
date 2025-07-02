import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    user: any;
    token: string;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate() {
        
        this.user = this.authenticationService.currentUser();
        this.token = this.authenticationService.currentToken();

        if (this.user) {

            if(this.token && this.token !== '' && this.token !== null) {
                return true;
            }

            // logged in so return true
            this.router.navigate(['/account/login']);
            return false;
        }
        // not logged in so redirect to login page with the return url
        return false;
    }
}
