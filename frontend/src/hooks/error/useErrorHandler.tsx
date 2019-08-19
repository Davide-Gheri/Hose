import React, { useCallback } from 'react';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { makeLogger } from '../../lib/logger';
import { FetchError } from '../../lib/fetcher';

const logger = makeLogger('errors');

export const useErrorHandler = () => {
  const {openNotification} = useNotifications();

  return useCallback((error: FetchError) => {
    logger.debug(error);

    let message: React.ReactNode;
    if (error.message) {
      message = (
        <>
          <span>An error occurred</span>
          <br/>
          <span>{error.message}</span>
        </>
      );
    } else {
      message = 'An error occurred';
    }

    openNotification({
      ...commonNotificationOpts,
      autoHide: 4000,
      text: message,
    })
  }, [openNotification]);
};
