import React, { useCallback, useEffect, useMemo } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { EnvironmentModel } from '../../store/models';
import { getRecords, makeGetByEnvSelector } from '../../store/records';
import { AppState } from '../../store';
import { getLoading } from '../../store/selectors';
import { Loading } from '../Loading';
import { useTheme } from '@material-ui/core';

export interface RecordsChartProps {
  environment: EnvironmentModel;
  take?: number;
}

export const RecordsChart: React.FC<RecordsChartProps> = ({environment, take}) => {
  const getByEnv = useMemo(makeGetByEnvSelector, []);

  const records = useSelector((state: AppState) => getByEnv(state, environment.id));
  const loading = useSelector(getLoading('records'));
  const dispatch = useDispatch();

  const theme = useTheme();

  useEffect(() => {
    dispatch(getRecords(environment.id, {take}));
  }, [environment.id, take]);

  if (loading) {
    return <Loading/>;
  }

  const formattedRecords = records.map(record => ({
    name: format(record.time, 'dd/MM/yyyy HH:mm'),
    ...record,
  })).reverse();

  return (
    <ResponsiveContainer>
      <LineChart data={formattedRecords} margin={{left: 0, top: 20}}>
        <Line dataKey="record" stroke={theme.palette.primary.main}/>
        <ReferenceLine y={environment.rule.minHumidity} stroke={theme.palette.error.main}/>
        <CartesianGrid stroke={theme.palette.grey['700']} strokeDasharray="5 5"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
      </LineChart>
    </ResponsiveContainer>
  );
};
