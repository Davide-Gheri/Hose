import React, { lazy, Suspense } from 'react';
// import loadable from '@loadable/component';
import { Loading as Loader } from './Loading';

export function asyncLoader(importFn: () => Promise<any>, loader = Loader) {
  const Comp = lazy(importFn);
  const Loading = loader;
  return (props: any) => (
    <Suspense fallback={<Loading/>}>
      <Comp {...props}/>
    </Suspense>
  )
}

// export function asyncLoader(importFn: () => Promise<any>, loader = Loader) {
//   const Loading = loader;
//   return loadable<any>(importFn, {
//     fallback: <Loading/>,
//   });
// }
