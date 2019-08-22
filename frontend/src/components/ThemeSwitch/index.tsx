import React, { useCallback } from 'react';
import { useAnchorEl } from '../../hooks/anchor';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { InvertColors } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { asNamesArray, setCurrentTheme } from '../../store/theme';
import { useThunkDispatch } from '../../store';

export const ThemeSwitch: React.FC = () => {
  const {setAnchorEl, removeAnchorEl, anchorEl} = useAnchorEl();
  const themeNames = useSelector(asNamesArray);
  const dispatch = useThunkDispatch();

  const changeTheme = useCallback((name: string) => {
    dispatch(setCurrentTheme(name));
    removeAnchorEl();
  }, [removeAnchorEl]);

  return (
    <>
      <IconButton color="inherit" onClick={setAnchorEl}>
        <InvertColors />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={removeAnchorEl}
      >
        <MenuItem onClick={() => changeTheme('_base_')}>
          Base
        </MenuItem>
        {themeNames.map(l => (
          <MenuItem key={l} onClick={() => changeTheme(l)}>
            {l}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
