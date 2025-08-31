import { Switch, SwitchProps } from '@jezvejs/react';

import './SwitchField.css';

export type SwitchFieldProps = Partial<SwitchProps>;

export const SwitchField = (props: SwitchFieldProps) => {
  const { id, ...rest } = props;

  return (
    <div id={id} className="switch-field">
      <Switch {...rest} />
    </div>
  );
};
