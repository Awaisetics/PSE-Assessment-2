// app/dashboard/job/[jobId]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResumeUpload from '@/components/ResumeUpload';

export default function JobDetailsPage() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        // Fetch job details using jobId
        const fetchJob = async () => {
            const res = await fetch(`/api/jobs/${jobId}`);
            const data = await res.json();
            if (!data.error) {
                setJob(data);
            }
        };
        fetchJob();
    }, [jobId]);

    useEffect(() => {
        // Fetch previously uploaded resumes for persistence
        const fetchResumes = async () => {
            const res = await fetch(`/api/resumes?jobId=${jobId}`);
            const data = await res.json();
            if (!data.error) {
                setResumes(data);
            }
        };
        fetchResumes();
    }, [jobId]);

    const handleUploadSuccess = (resume) => {
        // Append the newly uploaded resume to the list
        setResumes((prev) => [...prev, resume]);
    };

    if (!job) {
        return <div>Loading job details...</div>;
    }

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <p className="text-gray-700">{job.description}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Upload Resumes</h2>
                <ResumeUpload jobId={jobId} onUploadSuccess={handleUploadSuccess} />
            </div>

            <div>
                <h2 className="text-2xl font-semibold">Uploaded Resumes</h2>
                {resumes.length === 0 ? (
                    <p>No resumes uploaded yet.</p>
                ) : (
                    <ul>
                        {resumes.map((resume) => (
                            <li key={resume._id} className="py-1">
                                <a
                                    href={resume.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {resume.originalFileName}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
