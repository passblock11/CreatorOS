import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <div className="stat bg-base-100 shadow-lg rounded-lg">
      <div className="stat-figure text-primary">{icon}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value text-primary">{value}</div>
      {description && <div className="stat-desc">{description}</div>}
      {trend && (
        <div className={`stat-desc ${trend.isPositive ? 'text-success' : 'text-error'}`}>
          {trend.isPositive ? '↗︎' : '↘︎'} {trend.value}
        </div>
      )}
    </div>
  );
}
