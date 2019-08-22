import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EnvironmentModel } from '../../store/models';
import { Widget } from '../Dashboard/Widget';
import { InfiniteWateringTable } from './InfiniteTable';
import { getWaterings, makeGetByEnvSelector } from '../../store/waterings';
import { useSelector } from 'react-redux';
import { AppState, useThunkDispatch } from '../../store';
import { useTranslation } from 'react-i18next';

export interface WateringsWidgets {
  environment: EnvironmentModel;
}

const take = 10;

export const WateringsWidgets: React.FC<WateringsWidgets> = ({environment}) => {
  const getByEnv = useMemo(makeGetByEnvSelector, []);
  const { t } = useTranslation();
  const [skip, setSkip] = useState(0);

  const waterings = useSelector((state: AppState) => getByEnv(state, environment.id));
  const dispatch = useThunkDispatch();
  const loadMore = useCallback(() => {
    return dispatch(getWaterings(environment.id, {take, skip}))
    .then(() => {
      setSkip(take + skip);
    }).catch(console.error);
  }, [skip, setSkip, environment.id]);

  useEffect(() => {
    loadMore();
  }, []); // eslint-disable-line

  return (
    <>
      <Widget title={t('watering:watering', {count: 100})} sm={6}>
        <div style={{height: 300}}>
          <InfiniteWateringTable waterings={waterings.reverse()} onLoadMore={loadMore}/>
        </div>
      </Widget>
    </>
  )
};
