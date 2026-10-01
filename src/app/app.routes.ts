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
import { ScheduleAppointment } from './pages/schedule-appointment/schedule-appointment';
import { DoctorDetails } from './pages/doctor-details/doctor-details';
import { ClinicalHistory } from './pages/clinical-history/clinical-history';
import { Allergy } from './pages/allergy/allergy';
import { HealthInsurance } from './pages/health-insurance/health-insurance';
import { EmergencyServicesComponent } from './pages/emergency-services/emergency-services';
import { AboutUs } from './features/footer/components/about-us/about-us';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Contact } from './features/footer/components/contact/contact';
import { PrivacyPolicy } from './features/footer/components/privacy-policy/privacy-policy';
import { ShippingPolicy } from './features/footer/components/shipping-policy/shipping-policy';
import { CancellationPolicy } from './features/footer/components/cancellation-policy/cancellation-policy';
import { TermsOfUse } from './features/footer/components/terms-of-use/terms-of-use';
import { Careers } from './features/footer/components/careers/careers';
import { Abdm } from './features/abdm/abdm';
import { Profile } from './pages/profile/profile';
import { KidsDevelopment } from './pages/kids-development/kids-development';
import { Milestones } from './pages/kids-development/milestones/milestones';
import { MedicalRecords } from './pages/medical-records/medical-records';
import { MedicalRecordsList } from './pages/medical-records/components/medical-record-list/medical-records-list';
import { AppointmentDetails } from './pages/appointment-details/appointment-details';
import { DetailsPage } from './pages/appointment-details/details-page/details-page';

export const routes: Routes = [
    {
        path: 'auth/sign-in',
        component: SignIn
    },
    {
        path: 'auth/sign-up',
        component: SignUp
    },
    {
        path: '',
        component: DashboardLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'schedule-appointment',
                component: ScheduleAppointment
            },
            {
                path: 'schedule-appointment/:id',
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
                path: 'consultation-history',
                component: ConsultationHistoryComponent
            },
            {
                path: 'lab-records',
                component: LabResults
            },
            {
                path: 'emergency-contacts',
                component: EmergencyContacts
            },
            {
                path: 'facilitator',
                component: ClinicalHistory
            },
            {
                path: 'health-insurance',
                component: HealthInsurance
            },
            {
                path: 'allergy',
                component: Allergy
            },
            {
                path: 'emergency-services',
                component: EmergencyServicesComponent
            },
            {
                path: 'profile',
                component: Profile
            },
            {
                path: 'medical-records',
                component: MedicalRecords
            },
            {
                path: 'records',
                component: MedicalRecordsList
            },
            {
                path: 'kids-development',
                component: KidsDevelopment
            },
            {
                path: 'kids-development/milestones',
                component: Milestones
            },
            {
                path: 'appointments',
                component: AppointmentDetails
            },
            {
                path: 'appointments/:id',
                component: DetailsPage
            },
        ]
    },
    {
        path: '',
        component: PublicLayout,
        children: [
            {
                path: 'about',
                component: AboutUs
            },
            {
                path: 'contact',
                component: Contact
            },
            {
                path: 'privacy-policy',
                component: PrivacyPolicy
            },
            {
                path: 'shipping-policy',
                component: ShippingPolicy
            },
            {
                path: 'cancellation-policy',
                component: CancellationPolicy
            },
            {
                path: 'terms-and-conditions',
                component: TermsOfUse
            },
            {
                path: 'careers',
                component: Careers
            },
            {
                path: 'ayushman-bharath-digital-mission',
                component: Abdm
            }

        ]
    },

];