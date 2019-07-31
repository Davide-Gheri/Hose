import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EnvironmentModel } from '../../store/models';
import { Widget } from '../Dashboard/Widget';
import { InfiniteWateringTable } from './InfiniteTable';
import { getWaterings, makeGetByEnvSelector } from '../../store/waterings';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, PayloadAction } from '../../store';
import { getLoading } from '../../store/selectors';
import { ThunkDispatch } from 'redux-thunk';

export interface WateringsWidgets {
  environment: EnvironmentModel;
}

const take = 10;

export const WateringsWidgets: React.FC<WateringsWidgets> = ({environment}) => {
  const getByEnv = useMemo(makeGetByEnvSelector, []);
  const [skip, setSkip] = useState(0);

  const waterings = useSelector((state: AppState) => getByEnv(state, environment.id));
  const loading = useSelector(getLoading('waterings'));
  const dispatch = useDispatch<ThunkDispatch<{}, {}, PayloadAction<any>>>();
  const loadMore = useCallback(() => {
    return dispatch(getWaterings(environment.id, {take, skip}))
    .then(() => {
      setSkip(take + skip);
    });
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
