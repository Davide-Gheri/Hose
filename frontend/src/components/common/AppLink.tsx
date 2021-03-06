import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

export const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref as any} {...props} />
));
