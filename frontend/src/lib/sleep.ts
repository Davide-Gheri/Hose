
export const sleep = <T = any>(time: number = 0) => (...params: any[]): Promise<T> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(...params);
    }, time);
  });

export const minSleep = <T = any>(promise: Promise<T>, time: number = 0): Promise<T> =>
  Promise.all([promise, sleep(time)()]).then(arr => arr[0]);
