export * from './querystring-builder';

/**
 * Resolve promise after n milliseconds
 * @param time
 */
export function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
