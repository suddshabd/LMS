import React from 'react';
import Card from '../ui/Card';

export default function CreatorStats() {
    const stats = [
        { label: 'Total PDFs', value: '12', color: 'bg-blue-500' },
        { label: 'Total Sales', value: '$1,250', color: 'bg-green-500' },
        { label: 'Average Rating', value: '4.8', color: 'bg-yellow-500' },
        { label: 'Downloads', value: '542', color: 'bg-purple-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <Card key={idx}>
                    <div className={`${stat.color} text-white p-4 rounded mb-2`}>
                        <h3 className="text-sm font-semibold">{stat.label}</h3>
                    </div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                </Card>
            ))}
        </div>
    );
}
