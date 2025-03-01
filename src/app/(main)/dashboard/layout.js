// /src/app/(main)/dashboard/layout.js
import React from 'react';
import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';


const DashboardLayout = ({children}) => {
  return (
    <div className="px-5">
            <h1 className="text-6xl font-bold text-purple-700 mb-5 ">Dashboard</h1>
      <Suspense fallback={<BarLoader className="mt-4" width="100%" color="#89023E" />}>
        {children}
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
