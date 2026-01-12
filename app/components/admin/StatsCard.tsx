interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  percentage?: number;
  description?: string;
}

export default function StatsCard({
  title,
  value,
  change = 0,
  percentage,
  description,
}: StatsCardProps) {
  const isPositive = change >= 0;
  const isPercentage = typeof percentage === "number";

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        {isPercentage && (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 text-blue-200">
            {percentage}%
          </span>
        )}
      </div>

      <div className="flex items-baseline">
        <p className="text-3xl font-bold text-gray-100">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        {change !== 0 && (
          <span
            className={`ml-2 text-sm font-semibold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      )}

      {isPercentage && (
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
