'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CostMetrics {
    rent: number;
    food: number;
    transport: number;
    utilities: number;
}

interface CostBreakdownChartProps {
    metrics: CostMetrics;
}

export default function CostBreakdownChart({ metrics }: CostBreakdownChartProps) {
    const data = [
        { name: 'Rent', value: metrics.rent },
        { name: 'Food', value: metrics.food },
        { name: 'Transport', value: metrics.transport },
        { name: 'Utilities', value: metrics.utilities },
    ];

    return (
        <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                        cursor={{ fill: 'rgba(62, 180, 137, 0.05)' }}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" fill="#3EB489" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
