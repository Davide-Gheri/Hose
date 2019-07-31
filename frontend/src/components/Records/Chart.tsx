import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { format } from 'date-fns';
import { RecordModel } from '../../store/models';
import { useTheme } from '@material-ui/core';

export interface RecordsChartProps {
  records: RecordModel[];
  limit: number;
}

export const RecordsChart: React.FC<RecordsChartProps> = ({records, limit}) => {
  const theme = useTheme();

  const formattedRecords = records.map(record => ({
    name: format(record.time, 'dd/MM/yyyy HH:mm'),
    ...record,
  })).reverse();

  return (
    <ResponsiveContainer>
      <LineChart data={formattedRecords} margin={{left: 0, top: 20}}>
        <Line dataKey="record" stroke={theme.palette.primary.main}/>
        <ReferenceLine y={limit} stroke={theme.palette.error.main}/>
        <CartesianGrid stroke={theme.palette.grey['700']} strokeDasharray="5 5"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
      </LineChart>
    </ResponsiveContainer>
  );
};
