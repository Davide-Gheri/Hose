import React, { useCallback } from 'react';
import { commonNotificationOpts, useNotifications } from '../../contexts/Notifications';
import { makeLogger } from '../../lib/logger';
import { FetchError } from '../../lib/fetcher';
import { useTranslation } from 'react-i18next';
import { useRouter } from '../router';

const logger = makeLogger('errors');

export const useErrorHandler = () => {
  const { history } = useRouter();
  const {openNotification} = useNotifications();
  const { t } = useTranslation();

  return useCallback((error: FetchError) => {
    logger.debug(error);

    if (error.statusCode === 404) {
      history.replace('/404');
      return;
    }

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
      message = t('error:generic_error');
    }

    openNotification({
      ...commonNotificationOpts,
      autoHide: 4000,
      text: message,
      action: {
        onClick: window.location.reload,
        text: t<string>('error:reload')
      },
    })
  }, [openNotification]);
};
