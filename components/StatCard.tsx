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
    <div className="stat bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-base-300 hover:border-primary/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
      <div className="stat-figure text-primary opacity-90 z-10">{icon}</div>
      <div className="stat-title font-semibold text-base opacity-70">{title}</div>
      <div className="stat-value text-primary text-4xl font-bold my-2">{value}</div>
      {description && <div className="stat-desc text-sm opacity-60">{description}</div>}
      {trend && (
        <div className={`stat-desc font-semibold ${trend.isPositive ? 'text-success' : 'text-error'}`}>
          {trend.isPositive ? '↗︎' : '↘︎'} {trend.value}
        </div>
      )}
    </div>
  );
}
