// app/error/page.tsx or pages/error.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("error") || "An unknown error occurred. Please try again.";

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-red-600">
                    Oops! Something went wrong.
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    Please check the error message below and try again.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center text-red-600 font-semibold mb-4">
                        {errorMessage}
                    </div>
                    <div className="mt-6 flex justify-center">
                        <a
                            href="/login"
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Go back to Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
