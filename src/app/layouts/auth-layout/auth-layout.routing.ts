import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/authentication/login/login.component';
import { CreateAccountComponent } from 'src/app/pages/authentication/create-account/create-account.component';

export const AuthLayoutRoutes: Routes = [
    { 
        path: 'login',          
        component: LoginComponent 
    },
    { 
        path: 'create-account',       
        component: CreateAccountComponent 
    },
];
