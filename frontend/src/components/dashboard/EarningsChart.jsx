import React from 'react';
import Card from '../ui/Card';

export default function EarningsChart() {
    const chartData = [
        { month: 'Jan', earnings: 120 },
        { month: 'Feb', earnings: 210 },
        { month: 'Mar', earnings: 290 },
        { month: 'Apr', earnings: 200 },
        { month: 'May', earnings: 250 },
        { month: 'Jun', earnings: 300 }
    ];

    const maxEarnings = Math.max(...chartData.map(d => d.earnings));

    return (
        <Card>
            <h3 className="font-bold text-lg mb-4">Earnings Overview</h3>
            <div className="flex items-end gap-2 h-64">
                {chartData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-blue-500 rounded-t"
                            style={{ height: `${(data.earnings / maxEarnings) * 200}px` }}
                        ></div>
                        <span className="text-xs mt-2 text-gray-600">{data.month}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">Total Earnings: <span className="font-bold text-green-600">$1,370</span></p>
            </div>
        </Card>
    );
}
