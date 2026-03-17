'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonData {
    category: string;
    city1Value: number;
    city2Value: number;
    city1Name: string;
    city2Name: string;
}

interface SideBySideChartProps {
    data: ComparisonData[];
}

export default function SideBySideChart({ data }: SideBySideChartProps) {
    if (!data || data.length === 0) return null;

    const city1Name = data[0].city1Name;
    const city2Name = data[0].city2Name;

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 13, fontWeight: 700 }} width={140} />
                    <Tooltip
                        cursor={{ fill: 'rgba(62, 180, 137, 0.05)' }}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="city1Value" name={city1Name} fill="#3EB489" radius={[0, 4, 4, 0]} barSize={24} />
                    <Bar dataKey="city2Value" name={city2Name} fill="#FF8C42" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
