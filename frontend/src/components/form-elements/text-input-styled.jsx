import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { isEmpty } from '../../utils/utils';

export const StandardTextField = styled(TextField)(props => ({
  label: {
    minWidth: '85px',
    minHeight: '20px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--color-cathedral)',
  },
  '.MuiInput-root': {
    minWidth: props.customWidth || '320px',
    minHeight: '50px',
  },
  '.MuiSelect-select': {
    borderBottom: props.error ? '1px solid red' : '1px solid #e6e6e6',
  },
  '.MuiInput-input': {
    borderBottom: props.error ? '1px solid red' : '1px solid #e6e6e6',
    minHeight: props.inputMinHeight || '50px',
  },
  input: {
    borderBottom: props.error ? '1px solid red' : '1px solid #e6e6e6',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export const LongScreenTextField = styled(TextField)(props => ({
  display: 'block',
  lineBreak: 'anywhere',
  label: {
    minWidth: '85px',
    minHeight: '20px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '-0.007em',
    color: 'var(--color-cathedral)',
  },
  '.MuiInput-root': {
    minWidth: '100%',
    minHeight: props.inputMinHeight || '50px',
    borderBottom: !isEmpty(props.error) ? '1px solid red' : '1px solid #e6e6e6',
  },
}));

export const SelectOptionHeader = styled.div`
  padding: 0 36px 10px 36px;
  font-weight: 600;
  font-size: 16px;
  color: #646464;
`;

export const LongScreenTextFieldWithControlledValue = styled(LongScreenTextField)``;
