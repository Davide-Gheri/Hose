import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { EnvironmentModel } from '../../store/models';
import { Widget } from '../Dashboard/Widget';
import { RecordsChart } from './Chart';
import { createStyles, makeStyles, Slider } from '@material-ui/core';
import { Loading } from '../Loading';
import { InfiniteRecordTable } from './InfiniteTable';
import { getRecords, makeGetByEnvSelector } from '../../store/records';
import { useSelector } from 'react-redux';
import { AppState, useThunkDispatch } from '../../store';
import { getLoading } from '../../store/selectors';
import { useTranslation } from 'react-i18next';

export interface RecordsWidgetsProps {
  environment: EnvironmentModel;
}

const take = 50;

export const RecordsWidget: React.FC<RecordsWidgetsProps> = ({environment}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const getByEnv = useMemo(makeGetByEnvSelector, []);

  const [skip, setSkip] = useState(0);
  const [chartShow, setChartShow] = useState(10);

  const records = useSelector((state: AppState) => getByEnv(state, environment.id));
  const loading = useSelector(getLoading('records'));
  const dispatch = useThunkDispatch();

  const loadMore = useCallback(() => {
    return dispatch(getRecords(environment.id, {take, skip}))
    .then(() => {
      setSkip(take + skip);
    }).catch(console.error);
  }, [take, skip, setSkip, environment.id, dispatch]);

  const onSliderChange = useCallback((e: ChangeEvent<{}>, value: any) => {
    setChartShow(value as number);
    console.log('onSliderChange')
    if (value >= records.length - 10) {
      loadMore();
    }
  }, [setChartShow, records, loadMore]);

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <>
      <Widget title={t('record:last_records')} sm={12}>
        <>
          <div className={classes.chartContainer}>
            {loading ? <Loading/> : <RecordsChart
              records={records.slice(0, chartShow)}
              limit={environment.rule.minHumidity}
            />}
          </div>
          <div className={classes.sliderContainer}>
            <Slider
              defaultValue={chartShow}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={5}
              max={100}
              onChangeCommitted={onSliderChange}
            />
          </div>
        </>
      </Widget>
      <Widget title={t('record:record', {count: 100})} sm={6}>
        <div style={{height: 300}}>
          <InfiniteRecordTable records={records} onLoadMore={loadMore}/>
        </div>
      </Widget>
    </>
  )
};

const useStyles = makeStyles(theme => createStyles({
  chartContainer: {
    height: 300,
    padding: theme.spacing(2),
  },
  sliderContainer: {
    padding: theme.spacing(1, 2),
  },
}));
