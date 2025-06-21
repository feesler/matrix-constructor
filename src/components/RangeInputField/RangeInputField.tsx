import { fixFloat } from '@jezvejs/number';
import {
  RangeSlider,
  type RangeSliderProps,
  type RangeSliderValue,
  DecimalInput,
} from '@jezvejs/react';
import { useCallback, useEffect, useState } from 'react';

import './RangeInputField.css';

export type RangeInputFieldProps = Omit<Partial<RangeSliderProps>, 'value' | 'onChange'> & {
  title?: string;
  value?: number;
  precision?: number;
  additional?: string;
  onChange: (value: number) => void,
};

const PRECISION = 6;

const formatValue = (value: number) => (
  parseFloat(value.toFixed(PRECISION)).toLocaleString()
);

export const RangeInputField = (props: RangeInputFieldProps) => {
  const { onChange } = props;

  const [state, setState] = useState({
    ...props,
    value: props.value ?? 0,
    strValue: formatValue(props.value ?? 0),
  });

  const setValue = (value: number) => {
    setState((prev) => (
      (value === prev.value)
        ? prev
        : {
          ...prev,
          value,
          strValue: formatValue(value),
        }
    ));
  };

  const setStrValue = (strValue: string) => {
    setState((prev) => ({ ...prev, strValue }));
  };

  const onChangeCallback = useCallback((value: RangeSliderValue) => {
    if (typeof value !== 'number') {
      return;
    }

    setValue(value);
    onChange?.(value);
  }, [onChange]);

  useEffect(() => {
    setValue(props.value ?? 0);
  }, [props.value]);

  const handleInputValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value ?? '';
    setStrValue(value);

    const fixed = fixFloat(value);
    if (fixed === null) {
      return;
    }
    const newValue = parseFloat(fixed);
    const floatVal = state.value;
    if (newValue === floatVal) {
      return;
    }

    setValue(newValue);
    onChangeCallback?.(newValue);
  }, [state.value, onChangeCallback]);

  return (
    <div id={props.id} className="range-input-field">
      <div className="range-input-field__main">
        <label>{state.title}</label>
        <div className="range-input">
          <DecimalInput
            className="range-input__value"
            value={state.strValue}
            onChange={handleInputValue}
            disabled={props.disabled}
          />
        </div>
      </div>
      <RangeSlider
        {...props}
        id={props.id ?? ''}
        value={state.value}
        onChange={onChangeCallback}
      />
      {!!props.additional && (
        <div className="range-input-field__additional">{props.additional}</div>
      )}
    </div>
  );
};
