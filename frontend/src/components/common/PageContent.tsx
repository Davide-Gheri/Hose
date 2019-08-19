import React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core';

export const PageContent: React.FC<{className?: any}> = ({className, ...rest}) => {
    const classes = useStyles();

    return <div className={clsx(classes.root, className)} {...rest}/>
}

const useStyles = makeStyles(theme => createStyles({
    root: {
        padding: theme.spacing(3),
    }
}))