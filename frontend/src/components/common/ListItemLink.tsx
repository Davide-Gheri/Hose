import React from 'react';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { Link, LinkProps } from 'react-router-dom';

export type ListItemLinkProps = ListItemProps<React.ElementType<LinkProps>, {button?: true}>;

export const ListItemLink: React.FC<ListItemLinkProps> = (props: any) => {
  return (
    <ListItem button component={Link} {...props}/>
  );
};
