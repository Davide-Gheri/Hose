
export function isEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

export function isNil(value: any) {
  return !value || value === null || value === undefined || value === '';
}

export function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export function removeTrailingSlash(str: string) {
  return str.replace(/\/+$/, '');
}

export const runPipes = (pipes: Function[]) => async (res: any) => {
  let newRes = res;
  for (const pipe of pipes) {
    newRes = await pipe(newRes);
  }
  return newRes;
};
