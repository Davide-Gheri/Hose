import React, { useEffect, useCallback } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Button, IconButton } from '@material-ui/core';
import { DeleteForever } from "@material-ui/icons";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { asArray, deleteRule, getRules } from '../../store/rules';
import { getLoadingError } from '../../store/selectors';
import { useThunkDispatch } from '../../store';
import { useErrorHandler } from '../../hooks';
import { Loading } from '../Loading';
import { Error } from '../Error';
import { AppLink, ListItemLink, ConfirmButton, DisabledDeleteButton } from '../common';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';

export interface RuleListProps {
  take?: number;
}

export const RuleList: React.FC<RuleListProps> = ({take}) => {
  const { t } = useTranslation();
  const rules = useSelector(asArray);
  const {loading, error} = useSelector(getLoadingError('rules'));
  const dispatch = useThunkDispatch();

  const {openNotification} = useNotifications();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    dispatch(getRules({take})).catch(errorHandler);
  }, [dispatch, take]);

  const onDelete = useCallback((id: string) => {
    dispatch(deleteRule(id))
      .then(() => {
        openNotification({
          ...commonNotificationOpts,
          text: t('rule:deleted'),
        });
      }).catch(errorHandler);
  }, [t, dispatch, openNotification]);

  if (loading) {
    return <Loading minHeight={100}/>;
  }

  if (error) {
    return <Error />;
  }

  return (
    <List dense>
      {rules.length === 0 && (
        <ListItem>
          <ListItemText primary={t("rule:no_rules_set")} />
          <ListItemSecondaryAction>
            <Button color="primary" component={AppLink} to="/rules/new">
              {t("common:create_new")}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )}
      {rules.map((rule, i) => (
        <ListItemLink key={rule.id} to={`/rules/${rule.id}`} divider={i < rules.length - 1}>
          <ListItemText primary={rule.title} />
          <ListItemSecondaryAction>
            {rule.environmentIds.length > 0 ? (
              <DisabledDeleteButton text={t('rule:cannot_delete')}/>
            ) : (
              <ConfirmButton
                size="small"
                renderButton={props => <IconButton {...props} />}
                onClick={() => onDelete(rule.id)}
              >
                <DeleteForever />
              </ConfirmButton>
            )}
          </ListItemSecondaryAction>
        </ListItemLink>
      ))}
    </List>
  );
};
