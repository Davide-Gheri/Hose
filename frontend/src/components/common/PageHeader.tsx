import React from 'react';
import { AppBar, Toolbar, makeStyles, createStyles, Typography } from '@material-ui/core';

export interface PageHeaderProps {
    title: string | JSX.Element;
}

export const PageHeader: React.FC<PageHeaderProps> = ({title, children}) => {
    const classes = useStyles();
    
    return (
        <AppBar
            className={classes.secondaryBar}
            component="div"
            color="primary"
            position="static"
            elevation={0}
        >
            <Toolbar>
                <Typography variant="h5" component="h1">{title}</Typography>
                <div className={classes.rightChildren}>{children}</div>
            </Toolbar>
        </AppBar>
    )
};

const useStyles = makeStyles(theme => createStyles({
    secondaryBar: {
        zIndex: 0,
    },
    rightChildren: {
        marginLeft: 'auto',
    },
}))