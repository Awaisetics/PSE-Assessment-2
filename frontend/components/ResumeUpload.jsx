// components/ResumeUpload.jsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ResumeUpload({ jobId, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        setUploading(true);
        setError(null);

        // Process each file individually
        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('jobId', jobId);

            try {
                const res = await fetch('/api/resumes', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (data.success) {
                    // Trigger callback with each uploaded resume data
                    onUploadSuccess(data.resume);
                } else {
                    setError(data.error || 'Upload failed');
                }
            } catch (err) {
                console.error(err);
                setError('Upload failed');
            }
        }
        setUploading(false);
    }, [jobId, onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true // Allow multiple files
    });

    return (
        <div className="border-dashed border-2 p-6 text-center">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the resume file(s) here ...</p>
                ) : (
                    <p>Drag 'n' drop resume files here, or click to select files</p>
                )}
            </div>
            {uploading && <p>Uploading...</p>}  
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
