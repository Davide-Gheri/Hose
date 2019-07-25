import React from 'react';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { Link, LinkProps } from 'react-router-dom';

export type ListItemLinkProps = ListItemProps<React.ElementType<LinkProps>>;

export const ListItemLink: React.FC<ListItemLinkProps> = ({button, ...rest}: any) => {
  return (
    <ListItem {...rest} button component={Link}/>
  );
};
