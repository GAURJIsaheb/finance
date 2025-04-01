// /src/app/(main)/dashboard/layout.js
import Header from '@/components/Header/header';
import React from 'react';
import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';


const DashboardLayout = ({children}) => {
  return (
    <>
     <Header />
    <div className="px-5">
      <Suspense fallback={<BarLoader className="mt-4" width="100%" color="#89023E" />}>
        {children}
      </Suspense>
    </div>
    </>
  );
};

export default DashboardLayout;
