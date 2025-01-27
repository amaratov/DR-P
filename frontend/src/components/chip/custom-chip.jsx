import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function CustomChip({ label, isHollow, isSelected, showGreyColor, onClickFunc }) {
  const getChipColor = () => {
    switch (label) {
      case 'customer':
        return '#fc8a49';
      case 'archived':
        return '#646464';
      case 'solutions architect':
        return 'var(--color-homeworld)';
      case 'sales':
        return '#9f48c9';
      case 'solutions engineer':
        return '#66109f';
      default:
        return '#fc8a49';
    }
  };
  if (isHollow) {
    return (
      <Stack direction="row" spacing={1}>
        <Chip
          label={label}
          sx={{
            border: isSelected ? '1px solid var(--color-homeworld)' : '1px solid #646464',
            backgroundColor: 'inherit',
            color: isSelected ? 'var(--color-homeworld)' : 'var(--color-carbon)',
            textTransform: 'capitalize',
            maxHeight: '30px',
            fontSize: '13px',
            lineHeight: '19px',
            fontWeight: '400',
            marginLeft: '5px',
            marginRight: '5px',
            cursor: 'pointer',
          }}
          onClick={() => onClickFunc(label)}
        />
      </Stack>
    );
  }
  if (showGreyColor) {
    return (
      <Stack direction="row" spacing={1}>
        <Chip
          label={label}
          sx={{
            backgroundColor: 'var(--color-aluminium)',
            color: '#ffffff',
            textTransform: 'capitalize',
            maxHeight: '25px',
            fontSize: '10px',
            lineHeight: '18px',
            fontWeight: '700',
          }}
        />
      </Stack>
    );
  }
  return (
    <Stack direction="row" spacing={1}>
      <Chip
        label={label}
        sx={{
          backgroundColor: getChipColor(),
          color: '#ffffff',
          textTransform: 'uppercase',
          maxHeight: '30px',
          fontSize: '10px',
          lineHeight: '18px',
          fontWeight: '700',
        }}
      />
    </Stack>
  );
}

CustomChip.propTypes = {
  label: PropTypes.string.isRequired,
  isHollow: PropTypes.bool,
  isSelected: PropTypes.bool,
  showGreyColor: PropTypes.bool,
  onClickFunc: PropTypes.func,
};

CustomChip.defaultProps = {
  isHollow: false,
  isSelected: false,
  showGreyColor: false,
  onClickFunc: () => {},
};

export default CustomChip;
