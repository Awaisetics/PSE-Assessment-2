// app/dashboard/page.jsx
'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateJobModal from "@/components/CreateJobModal";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        // Fetch the jobs for the authenticated user
        const fetchJobs = async () => {
            const res = await fetch("/api/jobs");
            const data = await res.json();
            setJobs(data);
        };
        if (status === "authenticated") {
            fetchJobs();
        }
    }, [status]);

    // Function to handle deletion of a job
    const handleDeleteJob = async (jobId) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
                setJobs((prev) => prev.filter((job) => job._id !== jobId));
            } else {
                alert(data.error || "Failed to delete job");
            }
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    };

    const handleJobCreated = (newJob) => {
        // Update the jobs list with the new job
        setJobs((prev) => [...prev, newJob]);
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
                    <p className="text-gray-600">Welcome, {session?.user?.name}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowModal(true)}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Create New Job
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="rounded-lg bg-white p-6 shadow-md">
                {jobs.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        <p>No jobs created yet. Click on `&quot;`Create New Job`&quot;` to get started.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {jobs.map((job) => (
                            <li key={job._id} className="py-4 flex items-center justify-between">
                                <div>
                                    <a
                                        href={`/dashboard/job/${job._id}`}
                                        className="text-lg font-semibold text-blue-600 hover:underline"
                                    >
                                        {job.title}
                                    </a>
                                    <p className="text-gray-600">{job.description}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteJob(job._id)}
                                    className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {showModal && (
                <CreateJobModal
                    onClose={() => setShowModal(false)}
                    onJobCreated={handleJobCreated}
                />
            )}
        </div>
    );
}
