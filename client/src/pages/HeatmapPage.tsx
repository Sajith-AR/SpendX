import React from 'react';
import { SpendingHeatmapGrid } from '../components/heatmap/SpendingHeatmapGrid';

export const HeatmapPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <SpendingHeatmapGrid />
    </div>
  );
};
