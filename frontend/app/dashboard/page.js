'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    // This is a dummy function for now
    // Later, you'll connect this to your backend API
    const handleCreateJob = () => {
        // Here you'd normally make an API call to the backend
        alert('Job creation feature will be implemented in the next step');
    };

    if (status === 'loading') {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
                    <p className="text-gray-600">Welcome, {session?.user?.name}</p>
                </div>
                <button
                    onClick={() => signOut()}
                    className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    Logout
                </button>
                <button
                    onClick={handleCreateJob}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Create New Job
                </button>
            </header>

            <div className="rounded-lg bg-white p-6 shadow-md">
                {jobs.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        <p>No jobs created yet. Click on &quotCreate New Job&quot to get started.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {jobs.map((job) => (
                            <li key={job.id} className="py-4">
                                <h2 className="text-lg font-semibold">{job.title}</h2>
                                <p className="text-gray-600">{job.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}