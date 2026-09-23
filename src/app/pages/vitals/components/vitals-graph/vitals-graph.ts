
import {
    ChangeDetectorRef,
    Component,
    inject,
    Inject,
    OnInit
} from '@angular/core';

import {
    MAT_DIALOG_DATA,
    MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexYAxis,
    ApexDataLabels,
    ApexGrid,
    ApexTooltip,
    ApexStroke,
    ApexFill,
    ApexMarkers
} from 'ng-apexcharts';
import { GHOService } from '../../../../services/gho.service';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../models/gho-model';

export interface VitalGraphDialogData {
    title: string;
    apiName: string;
    unit: string;
}

export type VitalRange = 'W' | '2W' | 'M' | '6M' | 'Y' | '5Y';
export interface VitalGraphPoint {
    VitalDate: string;
    Value: string;
}

@Component({
    selector: 'app-vital-graph',
    standalone: true,
    imports: [
        CommonModule,
        NgApexchartsModule
    ],
    templateUrl: './vitals-graph.html',
    styleUrl: './vitals-graph.css',
})
export class VitalGraphComponent implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    loading = false;
    vitalGraphData: VitalGraphPoint[] = [];
    selectedRange: VitalRange = 'W';
    rangeOptions: VitalRange[] = [
        'W',
        '2W',
        'M',
        '6M',
        'Y',
        '5Y'
    ];

    chartSeries: ApexAxisChartSeries = [
        {
            name: 'Value',
            data: []
        }
    ];

    chartDetails: ApexChart = {
        type: 'area',
        height: 320,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    };

    chartXAxis: ApexXAxis = {
        type: 'category',
        labels: {
            style: {
                colors: '#64748b',
                fontSize: '12px'
            }
        },
        axisBorder: {
            color: '#e2e8f0'
        },
        axisTicks: {
            show: false
        }
    };

    chartYAxis: ApexYAxis = {
        labels: {
            style: {
                colors: '#64748b',
                fontSize: '12px'
            }
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        tickAmount: 5,
        forceNiceScale: true
    };

    chartDataLabels: ApexDataLabels = {
        enabled: false
    };

    chartGrid: ApexGrid = {
        borderColor: '#e2e8f0',
        strokeDashArray: 3,
        xaxis: {
            lines: {
                show: false
            }
        }
    };

    chartTooltip: ApexTooltip = {
        enabled: true,
        y: {
            formatter: (value: number) => {
                return `${value}`;
            }
        }
    };

    chartStroke: ApexStroke = {
        curve: 'smooth',
        width: 2.5
    };

    chartFill: ApexFill = {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.25,
            opacityTo: 0,
            stops: [0, 100]
        }
    };

    chartMarkers: ApexMarkers = {
        size: 0,
        hover: {
            size: 4
        }
    };

    constructor(
        private dialogRef: MatDialogRef<VitalGraphComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: VitalGraphDialogData,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getVitalGraphData();
    }

    close(): void {
        this.dialogRef.close();
    }


    changeRange(range: VitalRange): void {
        this.selectedRange = range;
        this.getVitalGraphData();
    }

    private getRangeDays(): number {
        switch (this.selectedRange) {
            case 'W':
                return 7;
            case '2W':
                return 14;
            case 'M':
                return 30;
            case '6M':
                return 180;
            case 'Y':
                return 365;
            case '5Y':
                return 1825;
            default:
                return 7;
        }
    }


    getVitalGraphData(): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: userId
            },
            {
                T: 'dk2',
                V: this.data.apiName
            },
            {
                T: 'c1',
                V: this.getRangeDays().toString()
            },
            {
                T: 'c10',
                V: '9'
            }

        ];
        this.srv.getdata('patientvital', tv).subscribe({
            next: (r) => {
                this.vitalGraphData = r.Data?.[0] ?? [];
                this.mapGraphData();
                this.loading = false;
                this.cdr.detectChanges();
            },

            error: (err) => {
                console.error(
                    'Vital Graph API Error:',
                    err
                );
                this.vitalGraphData = [];
                this.chartSeries = [
                    {
                        name: 'Value',
                        data: []
                    }
                ];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    getRecentVitals(): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        this.loading = true;
        const tv: tags[] = [

            {
                T: 'dk1',
                V: userId
            },

            {
                T: 'dk2',
                V: this.data.apiName
            },

            {
                T: 'c1',
                V: this.getRangeDays().toString()
            },

            {
                T: 'c10',
                V: '8'
            }

        ];
        this.srv.getdata('patientvital', tv).subscribe({
            next: (r) => {
                this.vitalGraphData = r.Data?.[0] ?? [];
                this.mapGraphData();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(
                    'Vital Graph API Error:',
                    err
                );
                this.vitalGraphData = [];
                this.chartSeries = [
                    {
                        name: 'Value',
                        data: []
                    }
                ];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }


    private mapGraphData(): void {
        const chartData = this.vitalGraphData.map(item => {
            return {
                x: this.formatChartDate(item.VitalDate),
                y: Number(item.Value)
            };

        });
        this.chartSeries = [
            {
                name: this.data.apiName,
                data: chartData
            }
        ];
        this.updateYAxis();
    }

    private formatChartDate(date: string): string {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    private updateYAxis(): void {
        if (!this.vitalGraphData.length) {
            this.chartYAxis = {
                ...this.chartYAxis,
                min: 0,
                max: 100,
                tickAmount: 5
            };
            return;
        }
        const values = this.vitalGraphData
            .map(item => Number(item.Value))
            .filter(value => !isNaN(value));
        if (!values.length) {
            return;
        }
        let min = Math.floor(Math.min(...values) / 10) * 10 - 10;
        let max = Math.ceil(Math.max(...values) / 10) * 10 + 10;
        min = Math.max(0, min);
        const span = max - min;
        const remainder = span % 4;
        if (remainder !== 0) {
            max += 4 - remainder;
        }

        this.chartYAxis = {
            ...this.chartYAxis,
            min,
            max,
            tickAmount: 5
        };
    }


    get minimum(): number {

        if (!this.vitalGraphData.length) {
            return 0;
        }

        const values = this.vitalGraphData
            .map(item => Number(item.Value))
            .filter(value => !isNaN(value));

        return values.length
            ? Math.min(...values)
            : 0;
    }

    get maximum(): number {

        if (!this.vitalGraphData.length) {
            return 0;
        }

        const values = this.vitalGraphData
            .map(item => Number(item.Value))
            .filter(value => !isNaN(value));

        return values.length
            ? Math.max(...values)
            : 0;
    }

    get average(): number {

        if (!this.vitalGraphData.length) {
            return 0;
        }

        const values = this.vitalGraphData
            .map(item => Number(item.Value))
            .filter(value => !isNaN(value));

        if (!values.length) {
            return 0;
        }

        const avg =
            values.reduce(
                (sum, value) => sum + value,
                0
            ) / values.length;

        return Math.round(avg);
    }
}
