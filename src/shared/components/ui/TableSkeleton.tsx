import React from 'react';
import { Skeleton } from './Skeleton';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-50 last:border-0">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-4">
              <Skeleton variant="shimmer" className="h-4 w-3/4 rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
