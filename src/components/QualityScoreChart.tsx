'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface QualityScoreChartProps {
    scores: {
        safety: number;
        healthcare: number;
        internet: number;
        environment: number;
    };
}

export default function QualityScoreChart({ scores }: QualityScoreChartProps) {
    const data = [
        { subject: 'Safety', A: scores.safety, fullMark: 100 },
        { subject: 'Healthcare', A: scores.healthcare || 70, fullMark: 100 },
        { subject: 'Internet', A: scores.internet, fullMark: 100 },
        { subject: 'Environment', A: scores.environment || 65, fullMark: 100 },
    ];

    return (
        <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Radar
                        name="Quality"
                        dataKey="A"
                        stroke="#556B2F"
                        fill="#556B2F"
                        fillOpacity={0.6}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
