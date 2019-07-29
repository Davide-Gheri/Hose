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
import { EnvironmentModel, RecordModel } from '../../store/models';
import { getRecords, makeGetByEnvSelector } from '../../store/records';
import { AppState } from '../../store';
import { getLoading } from '../../store/selectors';
import { Loading } from '../Loading';

export interface RecordsChartProps {
  environment: EnvironmentModel;
  take?: number;
}

export const RecordsChart: React.FC<RecordsChartProps> = ({environment, take}) => {
  const getByEnv = useMemo(makeGetByEnvSelector, []);

  const records = useSelector((state: AppState) => getByEnv(state, environment.id));
  const loading = useSelector(getLoading('records'));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRecords(environment.id, {take}));
  }, [environment.id]);

  const isError = useCallback((record: RecordModel) => {
    return record.record <= environment.rule.minHumidity;
  }, [environment.rule.minHumidity]);

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
        <Line dataKey="record"/>
        <ReferenceLine y={environment.rule.minHumidity} stroke="red"/>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
      </LineChart>
    </ResponsiveContainer>
  );
};
