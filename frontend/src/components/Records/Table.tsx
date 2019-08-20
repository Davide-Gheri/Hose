import React, { useCallback, useEffect, useMemo } from 'react';
import { getRecords, makeGetByEnvSelector } from '../../store/records';
import { useSelector } from 'react-redux';
import { AppState, useThunkDispatch } from '../../store';
import { getLoading } from '../../store/selectors';
import { Loading } from '../Loading';
import { createStyles, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { format } from 'date-fns';
import clsx from 'clsx';
import { EnvironmentModel, RecordModel } from '../../store/models';
import { useTranslation } from 'react-i18next';

export interface RecordsTableProps {
  environment: EnvironmentModel;
  take?: number;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({environment, take}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const getByEnv = useMemo(makeGetByEnvSelector, []);

  const records = useSelector((state: AppState) => getByEnv(state, environment.id));
  const loading = useSelector(getLoading('records'));
  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(getRecords(environment.id, {take})).catch(console.error);
  }, [environment.id]);

  const isError = useCallback((record: RecordModel) => {
    return record.record <= environment.rule.minHumidity;
  }, [environment.rule.minHumidity]);

  if (loading) {
    return <Loading/>;
  }

  return (
    <div className={classes.root}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('record:time')}</TableCell>
            <TableCell align="right">{t('record:reading')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map(record => {
            const errored = isError(record);
            return (
              <TableRow key={`record-${environment.id}-${record.time}`} hover>
                <TableCell
                  className={clsx({
                    [classes.errorCell]: errored,
                  })}
                  color="error" component="th" scope="row">{format(record.time, 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell
                  className={clsx({
                    [classes.errorCell]: errored,
                  })}
                  color="inherit" align="right">{record.record}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    width: '100%',
  },
  table: {},
  errorCell: {
    color: theme.palette.error.main,
  },
}));
