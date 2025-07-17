'use client';

import Header from './_components/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        <main className='min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-start flex-col'>
            <div className='main-container w-full'>
                <Header />
                <div className='py-3 px-6 w-full'>
                    {children}
                </div>
            </div>
        </main>
    );
}