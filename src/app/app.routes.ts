import { Routes } from '@angular/router';
import { SignIn } from './features/auth/sign-in/sign-in';
import { authGuard } from './guards/auth-guards';
import { Dashboard } from './features/dashboard/dashboard';
import { MedicationsComponent } from './pages/medications/medications';

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
        path: 'medications',
        component: MedicationsComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

