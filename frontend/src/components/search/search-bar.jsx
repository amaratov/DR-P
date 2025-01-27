import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { PanelSearchBarWrapper, SearchBarWrapper } from './search-bar-styled';
import { SEARCH_DEBOUNCE_TIME, TABS } from '../../utils/constants/constants';
import { backendService } from '../../services/backend';
import { usePrevious } from '../../utils/utils';
import { getSortOrder, getSortOrderBy } from '../../features/selectors/ui';

function SearchBar({ searchBarOpen, searchText, setSearchText, activeTab, isOnUsersPanel, handleFilterFunc }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // ref
  const searchTextRef = useRef(null);

  // prev
  const prevTab = usePrevious(activeTab);

  // func
  const handleChange = debounce(e => {
    setSearchText(e.target.value);
    switch (activeTab) {
      case TABS.ALL_COMPANIES: {
        const params = {
          name: `%${e.target.value}%`,
          includeProject: true,
          archived: false,
        };
        dispatch(backendService.searchCompaniesAndProjects(params));
        break;
      }
      case TABS.ARCHIVED_COMPANIES: {
        const params = {
          name: `%${e.target.value}%`,
          includeProject: true,
          archived: true,
        };
        dispatch(backendService.searchCompaniesAndProjects(params));
        break;
      }
      case TABS.MARKETING: {
        const params = {
          docName: `%${e.target.value}%`,
          archived: false,
          order: [[orderBy, order]],
        };
        dispatch(backendService.searchMarketings(params));
        break;
      }
      case TABS.PROJECT_BRIEFCASE: {
        const params = {
          docName: `%${e.target.value}%`,
          archived: false,
        };
        dispatch(backendService.searchMarketings(params));
        break;
      }
      case TABS.REFERENCE_ARCHITECTURE: {
        const params = {
          docName: `%${e.target.value}%`,
          archived: false,
        };
        dispatch(backendService.searchReferenceArchitecture(params));
        break;
      }
      case TABS.ICONS: {
        const params = {
          iconName: `%${e.target.value}%`,
          archived: false,
        };
        dispatch(backendService.searchIcons(params));
        break;
      }
      case TABS.DR_TEAM:
      case TABS.ACTIVE_USER: {
        const params = {
          name: `%${e.target.value}%`,
          archived: false,
        };
        dispatch(backendService.searchUserByName(params));
        break;
      }
      default:
        break;
    }
  }, SEARCH_DEBOUNCE_TIME);

  const handleSearchIconClick = e => {
    if (e.target.value !== searchText) setSearchText(e.target.value);
  };
  const handleClear = useCallback(() => {
    searchTextRef.current.value = '';
    setSearchText('');
  }, [setSearchText]);

  // effect
  useEffect(() => {
    if (prevTab && prevTab !== activeTab) handleClear();
  }, [prevTab, activeTab, handleClear]);

  useEffect(() => {
    if (!searchBarOpen && searchText) {
      handleClear();
    }
  }, [searchBarOpen, searchText, handleClear]);

  if (isOnUsersPanel) {
    return (
      <PanelSearchBarWrapper component="div" searchBarOpen={searchBarOpen}>
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <SearchIcon onClick={handleSearchIconClick} />
        </IconButton>
        <InputBase inputRef={searchTextRef} sx={{ ml: 1, flex: 1 }} placeholder="Search" inputProps={{ 'aria-label': 'search' }} onChange={handleChange} />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <FilterAltOutlinedIcon color="primary" onClick={handleFilterFunc} />
        </IconButton>
      </PanelSearchBarWrapper>
    );
  }
  return (
    <SearchBarWrapper component="div" searchBarOpen={searchBarOpen}>
      <IconButton sx={{ p: '10px', color: 'var(--color-homeworld)' }} aria-label="menu">
        <SearchIcon onClick={handleSearchIconClick} />
      </IconButton>
      <InputBase inputRef={searchTextRef} sx={{ ml: 1, flex: 1 }} placeholder="Search" inputProps={{ 'aria-label': 'search' }} onChange={handleChange} />
      <IconButton type="button" sx={{ p: '10px', maxWidth: '22px', maxHeight: '22px', backgroundColor: '#dadefa', borderRadius: '50%' }} aria-label="search">
        <CloseIcon onClick={handleClear} sx={{ color: 'var(--color-homeworld)', maxWidth: '12px', maxHeight: '12px' }} />
      </IconButton>
    </SearchBarWrapper>
  );
}

SearchBar.propTypes = {
  searchBarOpen: PropTypes.bool,
  isOnUsersPanel: PropTypes.bool,
  searchText: PropTypes.string,
  activeTab: PropTypes.string,
  setSearchText: PropTypes.func,
  handleFilterFunc: PropTypes.func,
};

SearchBar.defaultProps = {
  searchBarOpen: false,
  isOnUsersPanel: false,
  searchText: '',
  activeTab: '',
  setSearchText: () => {},
  handleFilterFunc: () => {},
};

export default SearchBar;
