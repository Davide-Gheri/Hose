import * as io from 'socket.io-client';
import { runPipes, isAbsoluteUrl } from './util';
import { Config } from './Config';
import { makeLogger } from './logger';

export type SocketCallback = (payload: any, off: () => void) => void;

const baseWsUrl = Config.get<string>('io.wsUrl');

const logger = makeLogger('io', Config.get<boolean>('logger.loggers.io'));

export const modelIo = (namespace: string, pipes: Function[]) => {
  if (!isAbsoluteUrl(namespace)) {
    namespace = baseWsUrl + namespace;
  }
  const pipesCallback = runPipes(pipes);
  const socket = io.connect(namespace);

  socket.on('connect', () => {
    logger.debug(`${namespace} connected`);
    (window as any).socket = socket;
  });
  socket.on('disconnect', () => {
    logger.debug(`${namespace} disconnected`);
  });

  function off(event: string) {
    socket.off(event);
  }

  return {
    once: <T = any>(event: string): Promise<T> => new Promise((resolve, reject) => {
      socket.once(event, (pl: any) => {
        logger.log(pl);
        resolve(pl);
      });
    }).then(pipesCallback),
    on: <T = any>(event: string, cb: SocketCallback) => {
      socket.on(event, (pl: any) => {
        logger.log(pl);
        pipesCallback(pl)
          .then(data => {
            cb(data, () => off(event));
          });
      });
    },
    emit: <T = any>(event: string, payload?: any): Promise<T | null> => new Promise((resolve, reject) => {
      socket.emit(event, payload, resolve);
    }).then(pl => {
      if (pl) {
        logger.log(pl);
        return pipesCallback(pl);
      }
      return null;
    }),
  };
};
