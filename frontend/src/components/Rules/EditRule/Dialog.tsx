import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { RuleModel } from '../../../store/models';
import { useTranslation } from 'react-i18next';
import { RuleForm } from '../Form';

export type EditRuleDialog = RouteComponentProps & {rule: RuleModel};

export const EditRuleDialog: React.FC<EditRuleDialog> = ({history, rule}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    history.push(`/rules/${rule.id}`);
  }, [history, rule]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('environment:edit')}</DialogTitle>
      <DialogContent>
        <RuleForm rule={rule} onSubmit={onClose} onCancel={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default EditRuleDialog;
