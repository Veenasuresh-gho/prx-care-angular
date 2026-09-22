import { Component } from '@angular/core';
import { SignIn } from './sign-in/sign-in';

@Component({
    selector: 'app-auth',
    imports: [SignIn],
    templateUrl: './auth.html',
})
export class Auth { }
