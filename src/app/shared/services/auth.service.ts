import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;

    constructor() {
    }

    /**
     * Returns the current user
     */
    public currentUser(): any {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    public currentToken(): any {
        const token = localStorage.getItem('token');
        return token ? token.replace(/^"(.*)"$/, '$1') : null;
    }
}

