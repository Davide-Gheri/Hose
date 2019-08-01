import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EnvironmentModel } from '../../store/models';
import { Widget } from '../Dashboard/Widget';
import { InfiniteWateringTable } from './InfiniteTable';
import { getWaterings, makeGetByEnvSelector } from '../../store/waterings';
import { useSelector } from 'react-redux';
import { AppState, useThunkDispatch } from '../../store';
import { getLoading } from '../../store/selectors';

export interface WateringsWidgets {
  environment: EnvironmentModel;
}

const take = 10;

export const WateringsWidgets: React.FC<WateringsWidgets> = ({environment}) => {
  const getByEnv = useMemo(makeGetByEnvSelector, []);
  const [skip, setSkip] = useState(0);

  const waterings = useSelector((state: AppState) => getByEnv(state, environment.id));
  const loading = useSelector(getLoading('waterings'));
  const dispatch = useThunkDispatch();
  const loadMore = useCallback(() => {
    return dispatch(getWaterings(environment.id, {take, skip}))
    .then(() => {
      setSkip(take + skip);
    }).catch(console.error);
  }, [take, skip, setSkip, environment.id]);

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <>
      <Widget title="Waterings" sm={6}>
        <div style={{height: 300}}>
          <InfiniteWateringTable waterings={waterings.reverse()} onLoadMore={loadMore}/>
        </div>
      </Widget>
    </>
  )
};
