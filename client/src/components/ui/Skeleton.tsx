import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse p-4">
      <div className="h-32 bg-[#111827] rounded-3xl border border-[#1E293B]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-[#111827] rounded-3xl border border-[#1E293B]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-[#111827] rounded-3xl border border-[#1E293B]" />
        <div className="h-72 bg-[#111827] rounded-3xl border border-[#1E293B]" />
      </div>
    </div>
  );
};
