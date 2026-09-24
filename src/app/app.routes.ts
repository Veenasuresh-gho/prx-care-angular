import { Routes } from '@angular/router';
import { SignIn } from './features/auth/sign-in/sign-in';
import { authGuard } from './guards/auth-guards';
import { Dashboard } from './features/dashboard/dashboard';
import { MedicationsComponent } from './pages/medications/medications';
import { SignUp } from './features/auth/sign-up/sign-up';
import { VitalsComponent } from './pages/vitals/vitals';
import { ConsultationHistoryComponent } from './pages/consultation-history/consultattion-history';
import { LabResults } from './pages/lab-results/lab-results';
import { EmergencyContacts } from './pages/emergency-contacts/emergency-contcacts';

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
        path: 'consultation-history',
        component: ConsultationHistoryComponent
    },
    {
        path: 'lab-records',
        component: LabResults
    },
  
    {
        path: '**',
        redirectTo: 'auth/sign-in'
    }
];

