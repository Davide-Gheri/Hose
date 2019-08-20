import React, { useCallback } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { Language } from '@material-ui/icons';
import { useAnchorEl } from '../../hooks';
import { useTranslation } from 'react-i18next';

const availableLanguages = [
  {
    key: "en",
    label: "English"
  },
  {
    key: "it",
    label: "Italiano"
  }
];

export const LanguageSwitch: React.FC = () => {
    const {setAnchorEl, removeAnchorEl, anchorEl} = useAnchorEl();
    const { i18n } = useTranslation();

    const changeLanguage = useCallback((key: string) => {
        i18n.changeLanguage(key);
        removeAnchorEl();
    }, [i18n.language]);

    return (
      <>
        <IconButton color="inherit" onClick={setAnchorEl}>
          <Language />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={removeAnchorEl}
        >
          {availableLanguages.map(l => (
            <MenuItem key={l.key} onClick={() => changeLanguage(l.key)}>
              {l.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
}