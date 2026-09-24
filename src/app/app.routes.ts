import { Routes } from '@angular/router';
import { SignIn } from './features/auth/sign-in/sign-in';
import { authGuard } from './guards/auth-guards';
import { Dashboard } from './features/dashboard/dashboard';
import { MedicationsComponent } from './pages/medications/medications';
import { SignUp } from './features/auth/sign-up/sign-up';
import { VitalsComponent } from './pages/vitals/vitals';
import { ScheduleAppointment } from './pages/schedule-appointment/schedule-appointment';
import { DoctorDetails } from './pages/doctor-details/doctor-details';

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
        path: 'schedule-appointment',
        component: ScheduleAppointment
    },
    {
        path: "schedule-appointment/:id",
        component: DoctorDetails
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

