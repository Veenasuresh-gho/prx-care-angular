import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

import { GHOService } from './gho.service';
import { ToastrService } from 'ngx-toastr';
import { tags } from '../models/gho-model';

interface AwsFileResponse {
    Url: string;
}

@Injectable({
    providedIn: 'root',
})
export class FileUploadService {

    private http = inject(HttpClient);
    private ghoService = inject(GHOService);
    private toastr = inject(ToastrService);

    private readonly uploadUrl =
        'https://ghoapps.com/api/file/upload-url';

    /**
     * Get AWS pre-signed upload URL
     */
    awsfileuploadinfo(
        fileName: string,
        fileType: string
    ): Observable<AwsFileResponse> {
        return this.http.get<AwsFileResponse>(
            `${this.uploadUrl}?filename=${encodeURIComponent(fileName)}&filetype=${encodeURIComponent(fileType)}`
        );
    }

    /**
     * Upload file directly to AWS using pre-signed URL
     */
    async uploadFile(
        fileId: string,
        fileType: string,
        file: File,
        fileName: string
    ): Promise<number> {

        try {
            const response = await firstValueFrom(
                this.awsfileuploadinfo(fileName, fileType)
            );

            const uploadUrl = response?.Url;

            if (!uploadUrl) {
                this.toastr.error(
                    'Upload URL missing',
                    'Upload failed'
                );

                return 0;
            }

            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            });

            if (uploadResponse.status === 200) {
                return 2;
            }

            this.toastr.error(
                `Failed to upload file, status code: ${uploadResponse.status}`,
                'Upload failed'
            );

            return 0;

        } catch (error) {
            console.error('File upload error:', error);

            this.toastr.error(
                'Error uploading file',
                'Upload failed'
            );

            return 0;
        }
    }

    /**
     * Complete file upload flow
     */
    async handleFileUpload(
        id: string,
        userId: string,
        file: File | null,
        documentTypeId: string,
        duration?: number
    ): Promise<boolean> {

        if (!file) {
            console.warn('No file provided for upload');
            return false;
        }

        try {
            const tags1: tags[] = [
                {
                    T: 'dk1',
                    V: userId,
                },
                {
                    T: 'dk2',
                    V: id,
                },
                {
                    T: 'c1',
                    V: documentTypeId,
                },
                {
                    T: 'c2',
                    V: file.name,
                },
                {
                    T: 'c3',
                    V: file.size.toString(),
                },
                {
                    T: 'c4',
                    V: duration?.toString() ?? '',
                },
                {
                    T: 'c10',
                    V: '1',
                },
            ];

            const response1 = await firstValueFrom(
                this.ghoService.getdata('fileupload', tags1)
            );

            const fileUploadId =
                response1?.Data?.[0]?.[0]?.id;

            const fileType =
                response1?.Data?.[0]?.[0]?.FileType;

            const fileName =
                response1?.Data?.[0]?.[0]?.FileID;

            if (!fileUploadId) {
                console.error('File upload ID missing');

                this.toastr.error(
                    'File upload information was not created',
                    'Upload failed'
                );

                return false;
            }

            // Step 2: Upload file to AWS
            const status = await this.uploadFile(
                fileUploadId,
                fileType,
                file,
                fileName
            );

            if (status !== 2) {
                return false;
            }

            const tags2: tags[] = [
                {
                    T: 'dk1',
                    V: userId,
                },
                {
                    T: 'dk2',
                    V: documentTypeId,
                },
                {
                    T: 'c1',
                    V: fileUploadId,
                },
                {
                    T: 'c2',
                    V: String(status),
                },
                {
                    T: 'c10',
                    V: '4',
                },
            ];

            await firstValueFrom(
                this.ghoService.getdata('fileupload', tags2)
            );

            this.toastr.success(
                'File uploaded successfully',
                'Success'
            );

            return true;

        } catch (error) {
            console.error('Handle file upload error:', error);

            this.toastr.error(
                'Error uploading file',
                'Upload failed'
            );

            return false;
        }
    }
}