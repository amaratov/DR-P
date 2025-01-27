import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, ClickAwayListener, Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import {
  SidePanelAddOrRemoveIcon,
  SidePanelContentWrapper,
  SidePanelDrawerWrapper,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
} from '../../side-panel/side-panel-styled';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { DRDivider } from '../../app/app-styled';
import { isEmpty } from '../../../utils/utils';
import CustomTablePagination from '../../table-pagination/custom-table-pagination';
import { getNumPagesForUseCases } from '../../../features/selectors/useCase';
import { backendService } from '../../../services/backend';

function DefaultContent({ createNew, foundOptions, hasValue, onClickFunc, search }) {
  return (
    <>
      {search}
      <List sx={{ padding: '8px 0' }}>
        {foundOptions?.map(iv => (
          <>
            <ListItem key={`${iv?.id}${iv?.name}`} sx={{ paddingLeft: '2px' }}>
              <ListItemText
                primary={iv?.name || ''}
                primaryTypographyProps={{ style: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' } }}
              />
              <SidePanelAddOrRemoveIcon>
                <CustomButton
                  buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                  icon={hasValue(iv) ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON : BUTTON_ICON.ADD_OUTLINED}
                  type="button"
                  onClickFunc={event => onClickFunc(iv)}
                />
              </SidePanelAddOrRemoveIcon>
            </ListItem>
            <DRDivider component="li" />
          </>
        ))}
        {createNew}
      </List>
    </>
  );
}

function GetNumPages({ isUseCase = false }) {
  const numberUseCasePages = useSelector(getNumPagesForUseCases);
  if (isUseCase) {
    return numberUseCasePages;
  }

  return 1;
}

function SelectionPanel({
  renderSearchComponent,
  renderCreateNewComponent,
  renderContentSection,
  options,
  openIndustry,
  setOpenIndustry,
  additionalValues,
  handleClick,
  isApplication,
  isCloud,
  isDataCenter,
  isUseCase,
  isTag,
  isType,
  isPartner,
  isTechnologies,
  isHub,
  isDiscoveryModel,
  isOtherTags,
  isSelectFromLibrary,
  specialCase,
  leftPositionDrawerContainer,
}) {
  const openWidth = openIndustry ? '500px' : '0';
  let fieldName = isUseCase ? 'useCases' : 'industryVertical';
  fieldName = isApplication ? 'applications' : fieldName;
  fieldName = isCloud ? 'clouds' : fieldName;
  fieldName = isDataCenter ? 'datacenters' : fieldName;
  fieldName = isType ? 'types' : fieldName;
  fieldName = isPartner ? 'partners' : fieldName;
  fieldName = isTechnologies ? 'technologies' : fieldName;
  fieldName = isHub ? 'hub' : fieldName;
  fieldName = isDiscoveryModel ? 'tag' : fieldName;
  fieldName = isOtherTags ? 'otherTags' : fieldName;
  fieldName = isSelectFromLibrary ? 'defaultIcon' : fieldName;
  let header = isUseCase ? 'Add Use Case' : 'Add Industry Vertical';
  header = isApplication ? 'Choose applications' : header;
  header = isCloud ? 'Choose hosting location' : header;
  header = isDataCenter ? 'Choose hosting location' : header;
  header = isType ? 'Add Type' : header;
  header = isPartner ? 'Add Partner' : header;
  header = isTechnologies ? 'Add Technologies' : header;
  header = isHub ? 'Add Hub' : header;
  header = isDiscoveryModel ? 'Add Discover/Modeling Tag' : header;
  header = isOtherTags ? 'Add Other Tags' : header;
  header = isSelectFromLibrary ? 'Select Icon from Library' : header;
  const localOptions = (isType || isPartner || isTechnologies || isHub) && !specialCase;

  // dispatch
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState(null);
  const [page, setPage] = useState(0);

  const numPages = isUseCase ? GetNumPages({ isUseCase }) : 1;

  const isPagination = numPages > 1;

  // func
  const hasValue = useCallback(
    val => {
      if (isUseCase) {
        const value = localOptions ? val.name : val.id;
        return additionalValues?.[fieldName]?.includes(value);
      }
      const value = localOptions ? val.name : val.id;
      return additionalValues?.[fieldName]?.includes(value);
    },
    [additionalValues, fieldName, localOptions]
  );

  const handleSelection = useCallback(
    val => {
      const value = localOptions ? val.name : val.id;
      handleClick(value, fieldName);
    },
    [handleClick, localOptions, fieldName]
  );

  const updatePage = useCallback(
    val => {
      const pageNum = val - 1 < 0 ? 0 : val - 1;
      setPage(val - 1);
      if (isUseCase) {
        dispatch(backendService.getUseCasesByParams({ archived: false, page: pageNum }));
      }
    },
    [dispatch, setPage, page]
  );

  const searchInputRef = useRef();

  const clearSearch = useCallback(() => {
    setSearchText(null);
    searchInputRef.current.value = null;
  }, [renderSearchComponent]);

  const onSearchText = useCallback(setSearchText, [renderSearchComponent]);

  const foundOptions = options?.filter(opt => searchText === null || opt.name.includes(searchText));

  const search = renderSearchComponent({ onSearchText }, searchInputRef);

  const createNew = isEmpty(foundOptions) && !isEmpty(searchText) ? renderCreateNewComponent({ clearSearch, searchText }) : null;

  useEffect(() => {
    if (page === 0 && isUseCase) {
      dispatch(backendService.getUseCasesByParams({ archived: false }));
    }
  }, []);

  return (
    <SidePanelDrawerWrapper
      disableEnforceFocus
      hideBackdrop
      anchor="left"
      leftPositionDrawerContainer={leftPositionDrawerContainer}
      open={openIndustry}
      openWidth={openWidth}
      onClose={() => setOpenIndustry(false)}
      PaperProps={{
        style: {
          marginLeft: `${leftPositionDrawerContainer}px`,
          backgroundColor: '#f0ecfc',
          borderTopRightRadius: '30px',
          borderBottomRightRadius: '30px',
          boxShadow: 'unset',
        },
      }}>
      <ClickAwayListener onClickAway={() => setOpenIndustry(false)}>
        <Box sx={{ minWidth: openWidth }}>
          <SidePanelMainWrapper id={`selection-panel-${fieldName}`} style={{ maxWidth: '450px' }}>
            <SidePanelHeaderWrapper
              style={{
                position: 'fixed',
                width: '450px',
                background: 'rgb(240, 236, 252)',
                zIndex: '500',
                paddingTop: '2rem',
                marginTop: '-2rem',
              }}>
              <SidePanelHeaderText>{header}</SidePanelHeaderText>
              <SidePanelHeaderCloseBtn>
                <CloseIcon onClick={() => setOpenIndustry(false)} />
              </SidePanelHeaderCloseBtn>
            </SidePanelHeaderWrapper>
            <Divider style={{ marginTop: '3rem' }} />
            <SidePanelContentWrapper key="selectionPanel">
              {renderContentSection ? renderContentSection({ createNew, foundOptions, hasValue, onClickFunc: handleSelection, search }) : null}
            </SidePanelContentWrapper>
          </SidePanelMainWrapper>
        </Box>
      </ClickAwayListener>
    </SidePanelDrawerWrapper>
  );
}

SelectionPanel.propTypes = {
  renderSearchComponent: PropTypes.func,
  renderCreateNewComponent: PropTypes.func,
  renderContentSection: PropTypes.func,
  options: PropTypes.shape([]).isRequired,
  openIndustry: PropTypes.bool.isRequired,
  setOpenIndustry: PropTypes.func.isRequired,
  additionalValues: PropTypes.shape({ industry_vertical: PropTypes.string }).isRequired,
  handleClick: PropTypes.func.isRequired,
  isApplication: PropTypes.bool,
  isCloud: PropTypes.bool,
  isDataCenter: PropTypes.bool,
  isUseCase: PropTypes.bool,
  isTag: PropTypes.bool,
  isType: PropTypes.bool,
  isPartner: PropTypes.bool,
  isTechnologies: PropTypes.bool,
  isHub: PropTypes.bool,
  isDiscoveryModel: PropTypes.bool,
  isOtherTags: PropTypes.bool,
  isSelectFromLibrary: PropTypes.bool,
  specialCase: PropTypes.bool,
  leftPositionDrawerContainer: PropTypes.number,
};

SelectionPanel.defaultProps = {
  renderSearchComponent: () => {},
  renderCreateNewComponent: () => {},
  renderContentSection: DefaultContent,
  isApplication: false,
  isCloud: false,
  isDataCenter: false,
  isUseCase: false,
  isTag: false,
  isType: false,
  isPartner: false,
  isTechnologies: false,
  isHub: false,
  isDiscoveryModel: false,
  isOtherTags: false,
  isSelectFromLibrary: false,
  specialCase: false,
  leftPositionDrawerContainer: undefined,
};

export default SelectionPanel;
