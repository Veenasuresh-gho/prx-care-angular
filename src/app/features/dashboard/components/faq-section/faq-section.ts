import { Component } from '@angular/core';
interface FAQ {
    question: string;
    answer: string;
}
@Component({
    selector: 'app-faq-section',
    standalone: true,
    templateUrl: './faq-section.html'
})
export class FaqSectionComponent {
    readonly faqs: FAQ[] = [
        {
            question: 'What is a Patient Journey Management System?',
            answer: 'It is a platform that helps hospitals and clinics guide patients through every stage of their healthcare journey, from booking appointments to follow-ups and ongoing care.'
        },
        {
            question: 'How does it improve the patient experience?',
            answer: 'By reducing wait times, providing clear communication, offering personalized reminders, and ensuring patients feel supported throughout their care process.'
        },
        {
            question: 'Can patients access their medical history in the system?',
            answer: 'Yes, patients can securely access their medical history, prescriptions, and test results through the system’s patient portal.'
        },
        {
            question: 'Does the system send appointment reminders?',
            answer: 'Absolutely! Patients receive automated reminders via SMS, email, or app notifications to help reduce no-shows and missed appointments.'
        },
        {
            question: 'Is the system secure and HIPAA-compliant?',
            answer: 'Yes, the platform follows strict security protocols and complies with HIPAA regulations to protect patient data and privacy.'
        }
    ];

    openIndex: number | null = null;
    toggle(index: number): void {
        this.openIndex = this.openIndex === index ? null : index;
    }
}