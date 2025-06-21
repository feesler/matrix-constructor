import { RangeInputField, type RangeInputFieldProps } from 'components/RangeInputField/RangeInputField.tsx';

export interface RangeInputFieldsListProps {
  fields: RangeInputFieldProps[];
}

export const RangeInputFieldsList = ({ fields }: RangeInputFieldsListProps) => (
  <div>
    {fields.map(((field) => (
      <RangeInputField key={field.value} {...field} />
    )))}
  </div>
);

RangeInputFieldsList.displayName = 'RangeInputFieldsList';
