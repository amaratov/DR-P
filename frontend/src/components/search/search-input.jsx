import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { SearchBarWrapper } from './search-bar-styled';

const SearchInput = forwardRef(function ({ open, onSearchText, placeholder }, searchInputRef) {
  const handleSearchIconClick = useCallback(() => {
    onSearchText(searchInputRef?.current?.value || null);
  }, [onSearchText]);

  const handleClear = useCallback(() => {
    if (searchInputRef) searchInputRef.current.value = null;
    onSearchText(null);
  }, [onSearchText]);

  const onChange = useCallback(
    event => {
      onSearchText(event.target.value || null);
    },
    [onSearchText]
  );

  useEffect(() => {
    if (!open) handleClear();
  }, [open, handleClear]);

  // For cleanup when component is destroyed and informs the parent
  useEffect(() => {
    return () => {
      onSearchText(null);
    };
  }, [onSearchText]);

  return (
    <SearchBarWrapper component="div" searchBarOpen={open} sx={{ boxSizing: 'border-box', marginLeft: '-15px', marginRight: '-3px', width: 'auto !important' }}>
      <IconButton sx={{ p: '10px', color: 'var(--color-homeworld)' }} aria-label="menu">
        <SearchIcon onClick={handleSearchIconClick} />
      </IconButton>
      <InputBase inputRef={searchInputRef} sx={{ ml: 1, flex: 1 }} placeholder={placeholder} inputProps={{ 'aria-label': 'search' }} onChange={onChange} />
      <IconButton type="button" sx={{ p: '10px', maxWidth: '22px', maxHeight: '22px', backgroundColor: '#dadefa', borderRadius: '50%' }} aria-label="search">
        <CloseIcon onClick={handleClear} sx={{ color: 'var(--color-homeworld)', maxWidth: '12px', maxHeight: '12px' }} />
      </IconButton>
    </SearchBarWrapper>
  );
});

SearchInput.propTypes = {
  open: PropTypes.bool,
  onSearchText: PropTypes.func,
  placeholder: PropTypes.string,
};

SearchInput.defaultProps = {
  open: true,
  onSearchText: () => {},
  placeholder: 'Search',
};

export default SearchInput;
