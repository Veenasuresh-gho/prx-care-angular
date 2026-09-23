export interface DashboardServiceItem {
  title: string;
  description: string;
  link: string;
  icon: any;
}

export interface DashboardServices {
  Personal: DashboardServiceItem[];
  Connect: DashboardServiceItem[];
  Essentials: DashboardServiceItem[];
}

export const DASHBOARD_SERVICES: DashboardServices = {
  Personal: [
    {
      title: 'Medications',
      description:
        'Track your current prescriptions and medication history.',
      link: '/medications',
      icon: '/assets/medication-icon.png',
    },
    {
      title: 'Vitals',
      description:
        'Monitor and record vital health metrics such as BP and temperature.',
      link: '/vitals',
      icon: '/assets/vitals-icon.png',
    },
    {
      title: 'Kids Development',
      description:
        'Monitor your child’s growth and development milestones.',
      link: '/kids-development',
      icon: '/assets/kids.jpg',
    },
  ],

  Connect: [
    {
      title: 'Schedule Appointment',
      description:
        'Book an appointment with your preferred doctor at your convenience.',
      link: '/schedule-appointment',
      icon: '/assets/calender-icon.png',
    },
    {
      title: 'Medical Records',
      description:
        'Access and manage your complete medical history in one place.',
      link: '/medical-records',
      icon: '/assets/medical-records-icon.png',
    },
    {
      title: 'Video Consultation',
      description:
        'Consult with your doctor remotely through a secure video consultation.',
      link: '/schedule-appointment?type=tele',
      icon: '/assets/video-icon.png',
    },
  ],

  Essentials: [
    {
      title: 'Consultation History',
      description:
        'View your past consultations and doctor notes.',
      link: '/consultation-history',
      icon: '/assets/consultation-history-icon.png',
    },
    {
      title: 'Lab Results',
      description:
        'Store and access your laboratory test reports in one place.',
      link: '/lab-records',
      icon: '/assets/lab-report-icon.png',
    },
    {
      title: 'Emergency Contact',
      description:
        'Add and update contacts to be notified during emergencies.',
      link: '/emergency-contacts',
      icon: '/assets/emergency-contact.png',
    },
    {
      title: 'Clinical History',
      description:
        'View and manage your doctor or facilitator information.',
      link: '/facilitator',
      icon: '/assets/facilitator-icon.png',
    },
    {
      title: 'Health Insurance',
      description:
        'Manage and view your health insurance plans and benefits.',
      link: '/health-insurance',
      icon: '/assets/health-insurance-icon.png',
    },
  ],
};