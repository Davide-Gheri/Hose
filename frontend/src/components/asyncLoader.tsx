import React, { lazy, Suspense } from 'react';

const Loader: React.FC = () => {
  return <div>Loading...</div>
};

export function asyncLoader(importFn: () => Promise<any>, loader = Loader) {
  const Comp = lazy(importFn);
  const Loading = loader;
  return (props: any) => (
    <Suspense fallback={<Loading/>}>
      <Comp {...props}/>
    </Suspense>
  )
}
