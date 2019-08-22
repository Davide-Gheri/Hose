import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

export const Spacer: React.FC<BoxProps> = (props) => {
  return <Box flex={1} {...props}/>
};
