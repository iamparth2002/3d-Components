'use client';

import React from 'react';
import TubeSheetSection from '@/sections/TubeSheetSection';
import RiserSection from '@/sections/RiserSection';
import HeatExchangerDetailedView from '@/sections/HeatExchangerDetailedView';

export default function Page() {
  return (
    <>
      <h2 className="text-2xl font-semibold p-4 absolute">
        Heat Exchanger Detailed View
      </h2>
      <div className="w-full h-screen flex">
      <div style={{ width: '60%', height: '100%' }}>
        <HeatExchangerDetailedView />
      </div>

      {/* Right Panel */}
      <div style={{ width: '40%', height: '100%', display: 'flex', flexDirection: 'column' }} className="border-l-2">
        {/* TubeSheet Section */}
        <TubeSheetSection />

        {/* Riser Section */}
        <RiserSection />
      </div>
    </div>
    </>
  );
}
