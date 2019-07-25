
export const sleep = <T = any>(time: number = 0) => (...params: any[]): Promise<T> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(...params);
    }, time);
  });
