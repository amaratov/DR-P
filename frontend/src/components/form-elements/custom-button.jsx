import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LinkIcon from '@mui/icons-material/Link';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CustomButtonWrapper } from './form-elements-styled';
import { BUTTON_ICON, BUTTON_STYLE } from '../../utils/constants/constants';
import {
  DivButtonIcon,
  DivButtonWrapper,
  MiniOutlinedDivButtonIcon,
  MiniOutlinedDivButtonText,
  MiniOutlinedDivButtonWrapper,
  OutlinedDivButtonIcon,
  OutlinedDivButtonText,
  OutlinedDivButtonWrapper,
  RoundedLightDivButton,
  RoundedLightDivButtonText,
  DiscoverRegionAddCloudsRemoveButtonWrapper,
  DiscoverRegionAddCloudsRemoveButtonIcon,
  DiscoverRegionAddCloudsRemoveButtonText,
  DivStyleTextButtonWrapper,
  DivStyleTextButtonText,
  DivStyleTextButtonTextAlt,
} from './custom-button-styled';

const ContainedButton = styled(Button)(({ customMinWidth, customMinHeight }) => ({
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  color: '#ffffff',
  backgroundColor: '#646464',
  borderColor: '#646464',
  justifyContent: 'space-between',
  '&:hover': {
    borderColor: '#646464',
    backgroundColor: '#646464',
    opacity: 0.8,
  },
}));

const CompanyContainedButton = styled(Button)(({ customMinWidth, customMinHeight, bgColor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '40px',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 18px -10px rgba(0, 0, 0, 0.3), 0 10px 40px -20px rgba(0, 0, 0, 0.4)',
  color: bgColor ? 'var(--color-la-luna)' : 'var(--color-homeworld)',
  backgroundColor: bgColor || 'var(--color-la-luna)',
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  textTransform: 'none',
  '&:hover': {
    borderColor: 'var(--color-cathedral)',
    backgroundColor: 'var(--color-cathedral)',
    color: '#ffffff',
    opacity: '0.6,',
  },
}));

const UseCaseContainedButton = styled(Button)(({ customMinWidth, customMinHeight }) => ({
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  color: '#646464',
  backgroundColor: 'rgb(245, 245, 245)',
  borderColor: '#646464',
  justifyContent: 'space-between',
  '&:hover': {
    borderColor: '#646464',
    backgroundColor: '#646464',
    color: '#ffffff',
  },
}));

const IndustryVerticalContainedButton = styled(Button)(({ customMinWidth, customMinHeight }) => ({
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  color: '#646464',
  backgroundColor: 'rgb(245, 245, 245)',
  borderColor: '#646464',
  justifyContent: 'space-between',
  '&:hover': {
    borderColor: '#646464',
    backgroundColor: '#646464',
    color: '#ffffff',
  },
}));

const BorderlessIconButton = styled(Button)(({ customMinWidth, customMinHeight }) => ({
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  color: '#646464',
  border: 'unset',
  padding: '3px',
  justifyContent: 'space-between',
  alignItems: 'center',
  textTransform: 'none',
  '&:hover': {
    border: 'unset',
    backgroundColor: 'unset',
    opacity: 0.8,
  },
  span: {
    marginRight: '4px',
  },
}));

const BorderlessStartIconButton = styled(Button)(({ customMinWidth, customMinHeight, useColor, showIndicator }) => ({
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '24px',
  color: useColor || 'var(--color-homeworld)',
  border: 'unset',
  padding: '3px',
  justifyContent: 'start',
  alignItems: 'center',
  textTransform: 'none',
  '&:hover': {
    border: 'unset',
    backgroundColor: 'unset',
    opacity: 0.8,
  },
  '&:disabled': {
    border: '0px',
  },
  span: {
    marginRight: '4px',
    '&:before': {
      position: 'absolute',
      top: '4px',
      left: '8px',
      content: showIndicator ? '""' : 'unset',
      width: '4px',
      height: '4px',
      border: '3px solid #e9ebff',
      borderRadius: '50%',
      backgroundColor: 'red',
    },
  },
}));

const RoundedButton = styled(Button)(({ customMinWidth, customMinHeight, marginTop, marginBottom, bgColor }) => ({
  border: 'unset',
  borderRadius: '40px',
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  marginTop,
  marginBottom,
  color: '#ffffff',
  backgroundColor: bgColor || 'var(--color-homeworld)',
  justifyContent: 'center',
  textTransform: 'capitalize',
  fontSize: '16px',
  '&:hover': {
    opacity: 0.8,
  },
}));

const RoundedButtonLight = styled(Button)(({ customMinWidth, customMinHeight, marginTop, marginBottom, bgColor }) => ({
  border: 'unset',
  borderRadius: '40px',
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  marginTop,
  marginBottom,
  color: bgColor ? 'var(--color-la-luna)' : 'var(--color-homeworld)',
  backgroundColor: bgColor || 'var(--color-la-luna)',
  boxShadow: '0 8px 18px -10px rgba(0, 0, 0, 0.3), 0 10px 40px -20px rgba(0, 0, 0, 0.4)',
  justifyContent: 'center',
  textTransform: 'none',
  fontSize: '16px',
  '&:hover': {
    borderColor: 'var(--color-cathedral)',
    backgroundColor: 'var(--color-cathedral)',
    color: '#ffffff',
    opacity: '0.6',
  },
}));

const BorderlessEndIconTextButton = styled(Button)(({ customMinWidth, customMinHeight }) => ({
  minWidth: customMinWidth,
  minHeight: customMinHeight,
  color: 'var(--color-batman)',
  fontFamily: '"Inter, san-serif"',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: '16px',
  lineHeight: '24px',
  justifyContent: 'space-between',
  padding: 0,
  textTransform: 'capitalize',
  '&:hover': {
    opacity: 0.8,
  },
  svg: {
    color: '#C8C8C8',
  },
}));

function CustomButton({
  buttonStyle,
  icon,
  type,
  buttonText,
  marginTop,
  marginBottom,
  padding,
  customMinWidth,
  customMinHeight,
  customMarginTop,
  customMarginLeft,
  onClickFunc,
  bgColor,
  disabled,
  disableButton,
  useColor,
  borderRadius,
  showIndicator,
  altText,
}) {
  const renderButtonIcon = () => {
    switch (icon) {
      case BUTTON_ICON.ARROW:
        return <ArrowCircleRightOutlinedIcon />;
      case BUTTON_ICON.SAVE:
        return <SaveOutlinedIcon />;
      case BUTTON_ICON.ADD:
        return <AddCircleIcon />;
      case BUTTON_ICON.ADD_BORDERLESS:
        return <AddIcon />;
      case BUTTON_ICON.SEARCH:
        return <SearchIcon />;
      case BUTTON_ICON.FILTER:
        return <FilterAltIcon />;
      case BUTTON_ICON.FILTER_OUTLINED:
        return <FilterAltOutlinedIcon />;
      case BUTTON_ICON.EDIT:
        return <EditIcon />;
      case BUTTON_ICON.CANCEL:
        return <CloseIcon />;
      case BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON:
        return <RemoveCircleOutlinedIcon />;
      case BUTTON_ICON.ADD_OUTLINED:
        return <AddCircleOutlineOutlinedIcon />;
      case BUTTON_ICON.REMOVE:
        return <RemoveIcon />;
      case BUTTON_ICON.LINK:
        return <LinkIcon />;
      case BUTTON_ICON.CLOUD_UPLOAD_ICON:
        return <CloudUploadOutlinedIcon />;
      case BUTTON_ICON.KEYBOARD_ARROW_UP:
        return <KeyboardArrowUpIcon />;
      case BUTTON_ICON.KEYBOARD_ARROW_DOWN:
        return <KeyboardArrowDownIcon />;
      case BUTTON_ICON.LIGHTBULB:
        return <LightbulbOutlinedIcon />;
      case BUTTON_ICON.DOWNLOAD:
      case BUTTON_ICON.FILE_DOWNLOAD:
        return <FileDownloadOutlinedIcon />;
      case BUTTON_ICON.KEYBOARD_ARROW_RIGHT:
        return <KeyboardArrowRightIcon />;
      default:
        return null;
    }
  };

  const renderContainedButton = () => {
    return (
      <ContainedButton
        type={type}
        variant="contained"
        endIcon={renderButtonIcon()}
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        disabled={disableButton}>
        {buttonText}
      </ContainedButton>
    );
  };

  const renderRoundedButton = () => {
    return (
      <RoundedButton
        type={type}
        variant="contained"
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        marginTop={marginTop}
        marginBottom={marginBottom}
        bgColor={bgColor}
        disabled={disabled || disableButton}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}>
        {buttonText}
      </RoundedButton>
    );
  };

  const renderRoundedButtonLight = () => {
    return (
      <RoundedButtonLight
        type={type}
        variant="contained"
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        marginTop={marginTop}
        marginBottom={marginBottom}
        bgColor={bgColor}
        disabled={disabled || disableButton}>
        {buttonText}
      </RoundedButtonLight>
    );
  };

  const renderCompanyContainedButton = () => {
    return (
      <CompanyContainedButton
        type={type}
        variant="contained"
        endIcon={renderButtonIcon()}
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        bgColor={bgColor}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        disabled={disableButton}>
        {buttonText}
      </CompanyContainedButton>
    );
  };

  const renderUseCaseContainedButton = () => {
    return (
      <UseCaseContainedButton
        type={type}
        variant="contained"
        endIcon={renderButtonIcon()}
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        disabled={disableButton}>
        {buttonText}
      </UseCaseContainedButton>
    );
  };

  const renderIndustryVerticalContainedButton = () => {
    return (
      <IndustryVerticalContainedButton
        type={type}
        variant="contained"
        endIcon={renderButtonIcon()}
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        disabled={disableButton}>
        {buttonText}
      </IndustryVerticalContainedButton>
    );
  };

  const renderDiscoverRegionsRemove = () => {
    return (
      <DiscoverRegionAddCloudsRemoveButtonWrapper
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        customMarginTop={customMarginTop}
        customMarginLeft={customMarginLeft}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        disabled={disableButton}
        borderRadius={borderRadius}
        bgColor={bgColor}
        useColor={useColor}>
        <DiscoverRegionAddCloudsRemoveButtonIcon onClick={onClickFunc} useColor={useColor}>
          {renderButtonIcon()}
        </DiscoverRegionAddCloudsRemoveButtonIcon>
        <DiscoverRegionAddCloudsRemoveButtonText useColor={useColor}>{buttonText}</DiscoverRegionAddCloudsRemoveButtonText>
      </DiscoverRegionAddCloudsRemoveButtonWrapper>
    );
  };

  const renderDiscoverRegionsAddCloudRemove = () => {
    return (
      <DiscoverRegionAddCloudsRemoveButtonWrapper
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        disabled={disableButton}
        borderRadius={borderRadius}
        bgColor={bgColor}
        useColor={useColor}>
        <DiscoverRegionAddCloudsRemoveButtonIcon onClick={onClickFunc} useColor={useColor}>
          {renderButtonIcon()}
        </DiscoverRegionAddCloudsRemoveButtonIcon>
      </DiscoverRegionAddCloudsRemoveButtonWrapper>
    );
  };

  const renderBorderlessStartIconButton = () => {
    return (
      <BorderlessStartIconButton
        disableFocusRipple
        useColor={useColor}
        type={type}
        variant="outlined"
        startIcon={renderButtonIcon()}
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        onClick={onClickFunc}
        showIndicator={showIndicator}
        disabled={disableButton}>
        {buttonText}
      </BorderlessStartIconButton>
    );
  };

  // bypass react hook form
  const renderPureDivButton = () => {
    return (
      <DivButtonWrapper
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        disabled={disableButton}>
        {buttonText}
        <DivButtonIcon>{renderButtonIcon()}</DivButtonIcon>
      </DivButtonWrapper>
    );
  };

  const renderOutlinedBorderlessDivButton = () => {
    return (
      <OutlinedDivButtonWrapper
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        disabled={disableButton}>
        <OutlinedDivButtonIcon>{renderButtonIcon()}</OutlinedDivButtonIcon>
        <OutlinedDivButtonText>{buttonText}</OutlinedDivButtonText>
      </OutlinedDivButtonWrapper>
    );
  };

  const renderRoundedLightDivButton = () => {
    return (
      <RoundedLightDivButton
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        bgColor={bgColor}
        disabled={disableButton}>
        <RoundedLightDivButtonText>{buttonText}</RoundedLightDivButtonText>
      </RoundedLightDivButton>
    );
  };

  const renderOutlinedDivButton = () => {
    return (
      <OutlinedDivButtonWrapper
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        disabled={disableButton}
        borderRadius={borderRadius}
        bgColor={bgColor}
        useColor={useColor}>
        <OutlinedDivButtonIcon useColor={useColor}>{renderButtonIcon()}</OutlinedDivButtonIcon>
        <OutlinedDivButtonText useColor={useColor}>{buttonText}</OutlinedDivButtonText>
      </OutlinedDivButtonWrapper>
    );
  };

  const renderMiniOutlinedDivButton = () => {
    return (
      <MiniOutlinedDivButtonWrapper customMinWidth={customMinWidth} customMinHeight={customMinHeight} onClick={onClickFunc} onKeyDown={onClickFunc}>
        <MiniOutlinedDivButtonIcon>{renderButtonIcon()}</MiniOutlinedDivButtonIcon>
        <MiniOutlinedDivButtonText>{buttonText}</MiniOutlinedDivButtonText>
      </MiniOutlinedDivButtonWrapper>
    );
  };

  const renderIconButton = () => {
    return (
      <IconButton aria-label={icon} onClick={onClickFunc} disabled={disableButton}>
        {renderButtonIcon()}
      </IconButton>
    );
  };

  const renderBorderlessIconButton = () => {
    return (
      <IconButton aria-label={icon} onClick={onClickFunc} disabled={disableButton}>
        {renderButtonIcon()}
      </IconButton>
    );
  };

  const renderDivStyleTextButton = () => {
    return (
      <DivStyleTextButtonWrapper
        disabled={disableButton}
        onClick={onClickFunc}
        onKeyDown={onClickFunc}
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        useColor={useColor}>
        {!altText && <DivStyleTextButtonText>{buttonText}</DivStyleTextButtonText>}
        {altText && <DivStyleTextButtonTextAlt>{buttonText}</DivStyleTextButtonTextAlt>}
      </DivStyleTextButtonWrapper>
    );
  };

  const renderBorderlessEndIconTextButton = () => {
    return (
      <BorderlessEndIconTextButton
        type={type}
        endIcon={renderButtonIcon()}
        customMinWidth={customMinWidth}
        customMinHeight={customMinHeight}
        disabled={disableButton}
        onClick={onClickFunc}>
        {buttonText}
      </BorderlessEndIconTextButton>
    );
  };

  return (
    <CustomButtonWrapper marginTop={marginTop} marginBottom={marginBottom} padding={padding}>
      {buttonStyle === BUTTON_STYLE.CONTAINED_STYLE && renderContainedButton()}
      {buttonStyle === BUTTON_STYLE.ROUNDED_STYLE && renderRoundedButton()}
      {buttonStyle === BUTTON_STYLE.ROUNDED_LIGHT_STYLE && renderRoundedButtonLight()}
      {buttonStyle === BUTTON_STYLE.BORDERLESS_ICON_STYLE && renderBorderlessIconButton()}
      {buttonStyle === BUTTON_STYLE.BORDERLESS_START_ICON_STYLE && renderBorderlessStartIconButton()}
      {buttonStyle === BUTTON_STYLE.DIV_STYLE && renderPureDivButton()}
      {buttonStyle === BUTTON_STYLE.OUTLINED_DIV_STYLE && renderOutlinedDivButton()}
      {buttonStyle === BUTTON_STYLE.MINI_OUTLINED_DIV_STYLE && renderMiniOutlinedDivButton()}
      {buttonStyle === BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE && renderRoundedLightDivButton()}
      {buttonStyle === BUTTON_STYLE.ICON_BUTTON && renderIconButton()}
      {buttonStyle === BUTTON_STYLE.DISCOVER_REGION_REMOVE_STYLE && renderDiscoverRegionsRemove()}
      {buttonStyle === BUTTON_STYLE.DISCOVER_REGION_ADD_CLOUDS_REMOVE_STYLE && renderDiscoverRegionsAddCloudRemove()}
      {buttonStyle === BUTTON_STYLE.USE_CASE_STYLE && renderUseCaseContainedButton()}
      {buttonStyle === BUTTON_STYLE.COMPANY_STYLE && renderCompanyContainedButton()}
      {buttonStyle === BUTTON_STYLE.INDUSTRY_VERTICAL_STYLE && renderIndustryVerticalContainedButton()}
      {buttonStyle === BUTTON_STYLE.DIV_STYLE_TEXT_BUTTON && renderDivStyleTextButton()}
      {buttonStyle === BUTTON_STYLE.BORDERLESS_END_ICON_TEXT_BUTTON && renderBorderlessEndIconTextButton()}
    </CustomButtonWrapper>
  );
}

CustomButton.propTypes = {
  buttonStyle: PropTypes.string,
  icon: PropTypes.string,
  buttonText: PropTypes.string,
  type: PropTypes.string,
  marginTop: PropTypes.string,
  marginBottom: PropTypes.string,
  padding: PropTypes.string,
  customMinWidth: PropTypes.string,
  customMinHeight: PropTypes.string,
  customMarginTop: PropTypes.string,
  customMarginLeft: PropTypes.string,
  bgColor: PropTypes.string,
  useColor: PropTypes.string,
  onClickFunc: PropTypes.func,
  disableButton: PropTypes.bool,
  disabled: PropTypes.bool,
  borderRadius: PropTypes.string,
  showIndicator: PropTypes.bool,
  altText: PropTypes.bool,
};

CustomButton.defaultProps = {
  buttonStyle: 'contained_style',
  icon: '',
  buttonText: '',
  type: 'button',
  marginTop: '',
  marginBottom: '',
  bgColor: '',
  padding: '0',
  customMinWidth: 'unset',
  customMinHeight: 'unset',
  customMarginTop: '10px',
  customMarginLeft: '110px',
  useColor: '',
  onClickFunc: () => {},
  disableButton: false,
  disabled: false,
  borderRadius: '',
  showIndicator: false,
  altText: false,
};

export default CustomButton;
