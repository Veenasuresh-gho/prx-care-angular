import { Routes } from '@angular/router';
import { SignIn } from './features/auth/sign-in/sign-in';
import { authGuard } from './guards/auth-guards';
import { Dashboard } from './features/dashboard/dashboard';
import { MedicationsComponent } from './pages/medications/medications';
import { SignUp } from './features/auth/sign-up/sign-up';
import { VitalsComponent } from './pages/vitals/vitals';

export const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [authGuard],
        component: Dashboard
    },
    {
        path: 'auth/sign-in',
        component: SignIn
    },
    {
        path: 'auth/sign-up',
        component: SignUp
    },
    {
        path: 'medications',
        component: MedicationsComponent
    },
     {
        path: 'vitals',
        component: VitalsComponent
    },
    {
        path: '**',
        redirectTo: 'auth/sign-in'
    }
];

