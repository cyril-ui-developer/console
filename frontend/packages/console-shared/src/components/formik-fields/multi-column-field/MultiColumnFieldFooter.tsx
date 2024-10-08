import * as React from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { useTranslation } from 'react-i18next';

export interface MultiColumnFieldFooterProps {
  addLabel?: string;
  disableAddRow?: boolean;
  hideAddRow?: boolean;
  tooltipAddRow?: string;
  onAdd: () => void;
}

const MultiColumnFieldFooter: React.FC<MultiColumnFieldFooterProps> = ({
  addLabel,
  disableAddRow = false,
  tooltipAddRow,
  hideAddRow = false,
  onAdd,
}) => {
  const { t } = useTranslation();
  const button = (
    <Button
      data-test={'add-action'}
      variant="link"
      isAriaDisabled={disableAddRow}
      onClick={!disableAddRow ? onAdd : undefined}
      icon={<PlusCircleIcon />}
      isInline
    >
      {addLabel || t('console-shared~Add values')}
    </Button>
  );
  return (
    !hideAddRow && (tooltipAddRow ? <Tooltip content={tooltipAddRow}>{button}</Tooltip> : button)
  );
};

export default MultiColumnFieldFooter;
