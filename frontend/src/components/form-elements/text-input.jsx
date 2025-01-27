import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { isEmail, isNumeric } from 'validator';
import { TextInputWrapper } from './form-elements-styled';
import CustomChip from '../chip/custom-chip';
import { LongScreenTextField, LongScreenTextFieldWithControlledValue, SelectOptionHeader, StandardTextField } from './text-input-styled';
import { isEmpty } from '../../utils/utils';

function TextInput({
  id,
  label,
  defaultValue,
  value,
  select,
  longScreen,
  placeholder,
  variant,
  error,
  type,
  required,
  register,
  options,
  disabled,
  customWidth,
  onChange,
  maxLength,
  onMouseDown,
  forceAutoFocus,
  gridColumn,
  onBlur,
  positiveNumber,
  multiline,
  inputMinHeight,
  usesValue,
}) {
  const selectProps = {
    MenuProps: {
      sx: {
        marginLeft: '200px',
        zIndex: 9999,
      },
      anchorOrigin: {
        vertical: 'center',
        horizontal: 'center',
      },
      transformOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
    },
  };

  const handleRegister = id => {
    if (positiveNumber) {
      return register(id, {
        validate: value => isNumeric(value, { no_symbols: true }) || 'Please enter a positive number',
      });
    }

    const useMaxLength = maxLength || 60;
    switch (id) {
      case 'email':
        return register(id, {
          required: 'Please enter valid email address',
          validate: value => isEmail(value) || 'Please enter valid email address',
        });
      case 'role':
        return register(id, { required: 'Please select user role' });
      case 'firstName':
      case 'lastName':
      case 'password':
      case 'newpassword':
      case 'confirmpassword':
      case 'title':
      case 'name':
      case 'country':
      case 'stateProvince':
      case 'city':
      case 'officeName':
        return register(id, {
          required: 'This is a required field',
          maxLength: {
            value: useMaxLength,
            message: `Text should be less than ${useMaxLength} characters`,
          },
          validate: value => !isEmpty(value) || 'This is a required field',
          setValueAs: value => value?.trim(),
        });
      case 'generalNotes':
      case 'notes':
        return register(id, {
          maxLength: {
            value: useMaxLength,
            message: `Text should be less than ${useMaxLength} characters`,
          },
          setValueAs: value => value?.trim(),
        });
      case 'phone':
        return register(id, {
          pattern: { value: /^[+]?(1-|1\s|1|\d{3}-|\d{3}\s|)?((\(\d{3}\))|\d{3})(-|\s)?(\d{3})(-|\s)?(\d{4})$/g, message: 'Invalid Phone Number' },
        });
      default:
        break;
    }

    if (maxLength) {
      return register(id, {
        maxLength: {
          value: maxLength,
          message: `Text should be less than ${maxLength} characters`,
        },
        setValueAs: value => value?.trim(),
      });
    }
    return register(id);
  };

  if (usesValue) {
    return (
      <TextInputWrapper gridColumn={gridColumn} onChange={text => onChange(text)} style={customWidth ? { width: '100%' } : {}}>
        <LongScreenTextFieldWithControlledValue
          id={id}
          className="form-text-input"
          label={label}
          defaultValue={defaultValue}
          placeholder={placeholder}
          helperText={error?.message || ''}
          type={type}
          error={!isEmpty(error)}
          required={required}
          variant={variant}
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          InputProps={{ disableUnderline: true, autoFocus: false, onBlur }}
          onChange={text => onChange(text)}
          onMouseDown={onMouseDown}
          inputMinHeight={inputMinHeight}
          multiline={multiline}
          onBlur={onBlur}
          value={value}
          {...handleRegister(id)}
          style={customWidth ? { width: '100%' } : {}}
        />
      </TextInputWrapper>
    );
  }

  if (select) {
    return (
      <TextInputWrapper gridColumn={gridColumn}>
        <StandardTextField
          id={id}
          select
          className="form-text-input"
          customWidth={customWidth}
          label={label}
          helperText={error?.message || ''}
          defaultValue={defaultValue}
          type={type}
          error={!isEmpty(error)}
          variant={variant}
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          InputProps={{ disableUnderline: true, autoFocus: false }}
          inputMinHeight={inputMinHeight}
          SelectProps={{
            ...selectProps,
            onChange,
          }}
          onMouseDown={onMouseDown}
          value={value}
          {...handleRegister(id)}>
          <SelectOptionHeader>Select User Role</SelectOptionHeader>
          {options.map(option => (
            <MenuItem key={option.id} value={option.id} sx={{ padding: '10px 36px' }}>
              <CustomChip label={option.name} />
            </MenuItem>
          ))}
        </StandardTextField>
      </TextInputWrapper>
    );
  }

  if (longScreen) {
    if (positiveNumber) {
      return (
        <TextInputWrapper gridColumn={gridColumn} onChange={text => onChange(text)}>
          <LongScreenTextField
            id={id}
            className="form-text-input"
            label={label}
            defaultValue={defaultValue}
            placeholder={placeholder}
            helperText={error?.message || ''}
            type="number"
            error={!isEmpty(error)}
            required={required}
            variant={variant}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            onChange={text => onChange(text)}
            onMouseDown={onMouseDown}
            multiline={multiline}
            {...handleRegister(id)}
          />
        </TextInputWrapper>
      );
    }
    return (
      <TextInputWrapper gridColumn={gridColumn} onChange={text => onChange(text)}>
        <LongScreenTextField
          id={id}
          className="form-text-input"
          label={label}
          defaultValue={defaultValue}
          placeholder={placeholder}
          helperText={error?.message || ''}
          type={type}
          error={!isEmpty(error)}
          required={required}
          variant={variant}
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          InputProps={{ disableUnderline: true, autoFocus: forceAutoFocus, onBlur }}
          onChange={text => onChange(text)}
          onMouseDown={onMouseDown}
          inputMinHeight={inputMinHeight}
          multiline={multiline}
          onBlur={onBlur}
          {...handleRegister(id)}
        />
      </TextInputWrapper>
    );
  }
  if (value) {
    return (
      <TextInputWrapper gridColumn={gridColumn}>
        <StandardTextField
          id={id}
          className="form-text-input"
          customWidth={customWidth}
          label={label}
          value={value}
          onChange={text => onChange(text)}
          onMouseDown={onMouseDown}
          onBlur={onBlur}
          placeholder={placeholder}
          helperText={error?.message || ''}
          defaultValue={defaultValue}
          type={type}
          error={!isEmpty(error)}
          required={required}
          variant={variant}
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
          InputProps={{ disableUnderline: true, autoFocus: false }}
          inputMinHeight={inputMinHeight}
          multiline={multiline}
          {...handleRegister(id)}
        />
      </TextInputWrapper>
    );
  }
  return (
    <TextInputWrapper gridColumn={gridColumn}>
      <StandardTextField
        id={id}
        className="form-text-input"
        customWidth={customWidth}
        inputMinHeight={inputMinHeight}
        label={label}
        defaultValue={defaultValue}
        placeholder={placeholder}
        helperText={error?.message || ''}
        type={type}
        error={!isEmpty(error)}
        variant={variant}
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        InputProps={{ disableUnderline: true, autoFocus: false, onBlur }}
        onChange={text => onChange(text)}
        onMouseDown={onMouseDown}
        multiline={multiline}
        {...handleRegister(id)}
      />
    </TextInputWrapper>
  );
}

TextInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  variant: PropTypes.string,
  type: PropTypes.string,
  customWidth: PropTypes.string,
  error: PropTypes.shape({}),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  select: PropTypes.bool,
  longScreen: PropTypes.bool,
  register: PropTypes.func,
  onChange: PropTypes.func,
  onMouseDown: PropTypes.func,
  onBlur: PropTypes.func,
  maxLength: PropTypes.number,
  forceAutoFocus: PropTypes.bool,
  gridColumn: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
  multiline: PropTypes.bool,
  inputMinHeight: PropTypes.string,
  usesValue: PropTypes.bool,
};

TextInput.defaultProps = {
  id: '',
  label: '',
  defaultValue: '',
  value: '',
  placeholder: '',
  variant: 'standard',
  type: 'text',
  customWidth: '',
  error: {},
  required: false,
  select: false,
  longScreen: false,
  disabled: false,
  register: () => {},
  onChange: () => {},
  onMouseDown: () => {},
  onBlur: () => {},
  maxLength: 0,
  forceAutoFocus: false,
  gridColumn: null,
  options: [],
  multiline: false,
  inputMinHeight: '50px',
  usesValue: false,
};

export default TextInput;
