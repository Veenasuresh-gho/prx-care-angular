import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToastrService } from 'ngx-toastr';
import { SheetComponent } from '../../components/sheet/sheet-component';
import { EmptyMessageComponent } from '../../components/empty-message/empty-message';
import { GHOService } from '../../services/gho.service';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../models/gho-model';
import { BannerComponent } from './components/banner/banner';
import { AddEmergencyContact } from './components/add-emergency-contact/add-emergency-contact';
import { EditEmergencyContact } from './components/edit-emergency-contact/edit-emergency-contact';

@Component({
    selector: 'emergency-contacts',
    standalone: true,
    imports: [
        SheetComponent,
        MatIconModule,
        MatProgressSpinnerModule,
        BannerComponent,
        AddEmergencyContact,
        EditEmergencyContact,
        EmptyMessageComponent
    ],
    templateUrl: './emergency-contacts.html',
    styleUrl: './emergency-contacts.css'
})
export class EmergencyContacts implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    res: ghoresult = new ghoresult();
    loading = false;
    emergencyContacts: any[] = [];
    isSheetOpen = false;
    isEditMode = false;
    selectedContact: any = null;
    private toastr = inject(ToastrService);

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getEmergencyContacts();
    }


    getEmergencyContacts(): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        this.loading = true;
        const tv: tags[] = [
             {
                T: 'dk1',
                V: ''
            },
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c10',
                V: '3'
            }
        ];
        this.srv.getdata(
            'patientcontact',
            tv
        ).subscribe({
            next: (r) => {
                this.emergencyContacts = r.Data?.[0] ?? [];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(
                    'Emergency Contact API Error:',
                    err
                );
                this.emergencyContacts = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });

    }


    openAddSheet(): void {
        this.isEditMode = false;
        this.selectedContact = null;
        this.isSheetOpen = true;
    }


    openEditSheet(contact: any): void {
        this.selectedContact = contact;
        this.isEditMode = true;
        this.isSheetOpen = true;

    }


    closeSheet(): void {
        this.isSheetOpen = false;
        this.selectedContact = null;
        this.isEditMode = false;
    }


    contactSaved(): void {
        this.closeSheet();
        this.isEditMode = false;
        this.selectedContact = null;
        this.getEmergencyContacts();
    }


    deleteEmergencyContact(contact: any): void {
        const userId =
            sessionStorage.getItem('id');
        if (!userId) {
            console.error(
                'User ID not found'
            );
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: contact?.ID || ''
            },
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c10',
                V: '4'
            }

        ];
        this.srv.getdata(
            'patientcontact',
            tv
        ).subscribe({
            next: (r) => {
                this.getEmergencyContacts();
                this.cdr.detectChanges();
                this.toastr.success(
                    'Emergency contact deleted successfully'
                );
            },
            error: (err) => {
                console.error(
                    'Emergency Contact API Error:',
                    err
                );
                this.loading = false;
                this.cdr.detectChanges();
                this.toastr.error(
                    'Failed to delete emergency contact'
                );
            }
        });
    }
}