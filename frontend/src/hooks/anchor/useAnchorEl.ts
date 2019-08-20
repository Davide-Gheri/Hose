import React, { useCallback, useState } from "react";

export const useAnchorEl = (initialValue: HTMLElement | null = null) => {
  const [anchorEl, _setAnchorEl] = useState<typeof initialValue>(initialValue);

  const setAnchorEl = useCallback((e: React.MouseEvent<HTMLElement>) => {
    _setAnchorEl(e.currentTarget);
  }, []);

  const removeAnchorEl = useCallback(() => {
    _setAnchorEl(null);
  }, []);

  return {
    anchorEl,
    setAnchorEl,
    removeAnchorEl
  };
};
