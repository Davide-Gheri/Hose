import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  asArray,
  getNewNotifications,
  getNotifications,
  readAllNotifications,
  readNotification
} from '../../store/notifications';
import { useThunkDispatch } from '../../store';
import {
  Badge,
  IconButton,
  List,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  ListItem,
  Button,
  ListSubheader, makeStyles, createStyles
} from '@material-ui/core';
import { Notifications, NotificationsNone } from '@material-ui/icons';
import { useAnchorEl } from '../../hooks/anchor';
import { NotificationModel } from '../../store/models/notification.model';
import { Config } from '../../lib/Config';
import { useTranslation } from 'react-i18next';

export const NotificationsTopBarWidget: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {setAnchorEl, removeAnchorEl, anchorEl} = useAnchorEl();
  const notifications = useSelector(asArray);

  const hasNewNotifications = notifications.filter(not => !not.read).length;

  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(getNotifications());
  }, []);

  useEffect(() => {
    let off: any;
    dispatch(getNewNotifications(((payload, offFn) => {
      off = offFn;
    })));
    return () => {
      if (off && typeof off === 'function') {
        off();
      }
    }
  }, []);

  useEffect(() => {
    if (hasNewNotifications) {
      document.title = `(${hasNewNotifications}) ${Config.get<string>('appName')}`;
    } else {
      document.title = Config.get<string>('appName');
    }
  }, [hasNewNotifications]);

  const onClick = useCallback((notification: NotificationModel & {read?: boolean}) => {
    if (!notification.read) {
      dispatch(readNotification(notification.id));
    }
  }, []);

  const onClear = useCallback(() => {
    dispatch(readAllNotifications());
    removeAnchorEl();
  }, []);

  return (
    <>
      {hasNewNotifications ? (
        <IconButton color="inherit" onClick={setAnchorEl}>
          <Badge variant="dot" color="secondary">
            <Notifications />
          </Badge>
        </IconButton>
      ) : (
        <IconButton color="inherit" onClick={setAnchorEl}>
          <Notifications />
        </IconButton>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={removeAnchorEl}
        MenuListProps={{
          dense: true,
          disablePadding: true
        }}
      >
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText secondary={t('notifications:empty')}/>
          </ListItem>
        ) : [
          <ListItem divider disableGutters key="notitficationsList">
            <List
              dense
              subheader={<ListSubheader className={classes.header}>{t('notifications:notification', {count: 100})}</ListSubheader>}
              className={classes.root}
            >
              {notifications.map((notification, i) => (
                <ListItem divider={i < notifications.length - 1} key={notification.id}>
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => onClick(notification)} edge="end" color="inherit">
                      {notification.read ? (
                        <NotificationsNone/>
                      ) : (
                        <Notifications/>
                      )}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </ListItem>,
          <ListItem key="notificationsClear">
            <ListItemText primary="&nbsp;"/>
            <ListItemSecondaryAction>
              <Button onClick={onClear} size="small" color="primary">{t('common:clear')}</Button>
            </ListItemSecondaryAction>
          </ListItem>
        ]}
      </Menu>
    </>
  )
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    maxHeight: 300,
    overflowY: 'scroll',
  },
  header: {
    background: theme.palette.background.paper,
  }
}));
