export * from './querystring-builder';

export function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
