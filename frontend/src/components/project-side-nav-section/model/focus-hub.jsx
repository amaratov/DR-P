import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import {
  FocusHubContainer,
  UsageFocusContainer,
  UsageFocusValueContainer,
  UsageFocusIncreaseDecreaseContainer,
  FocusUsageIconsContainer,
  FocusUsageIcons,
} from './focus-hub-styled';
import { FOCUS_HUB_VALUE_LABELS } from '../../../utils/constants/constants';

function FocusHub({ titleImage, alternateImageText, iconValues, network, compute, storage }) {
  //state
  const [expand, setExpand] = useState(true);
  const [networkValue, setNetworkValue] = useState(network);
  const [computeValue, setComputeValue] = useState(compute);
  const [storageValue, setStorageValue] = useState(storage);

  //func
  const incrementValue = useCallback(
    label => {
      if (label === FOCUS_HUB_VALUE_LABELS.NETWORK) {
        setNetworkValue(networkValue + 1);
      } else if (label === FOCUS_HUB_VALUE_LABELS.COMPUTE) {
        setComputeValue(computeValue + 1);
      } else if (label === FOCUS_HUB_VALUE_LABELS.STORAGE) {
        setStorageValue(storageValue + 1);
      }
    },
    [setNetworkValue, setComputeValue, setStorageValue, networkValue, computeValue, storageValue]
  );
  const decrementValue = useCallback(
    label => {
      if (label === FOCUS_HUB_VALUE_LABELS.NETWORK) {
        setNetworkValue(networkValue - 1 >= 0 ? networkValue - 1 : 0);
      } else if (label === FOCUS_HUB_VALUE_LABELS.COMPUTE) {
        setComputeValue(computeValue - 1 >= 0 ? computeValue - 1 : 0);
      } else if (label === FOCUS_HUB_VALUE_LABELS.STORAGE) {
        setStorageValue(storageValue - 1 >= 0 ? storageValue - 1 : 0);
      }
    },
    [setNetworkValue, setComputeValue, setStorageValue, networkValue, computeValue, storageValue]
  );

  return (
    <FocusHubContainer>
      <UsageFocusContainer>
        <div className="usage-title-box">
          <img className="usage-title-image" src={titleImage} alt={alternateImageText} />
        </div>
        <div className="usage-focus-exapnd">
          <p>Usage focus</p>
          <IconButton aria-label="expand row" size="small" onClick={() => setExpand(!expand)} sx={{ color: 'var(--color-aluminium)' }}>
            {expand ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </IconButton>
        </div>
        {expand && (
          <div>
            <UsageFocusValueContainer>
              <div>Network</div>
              <UsageFocusIncreaseDecreaseContainer>
                <IconButton
                  disabled={networkValue === 0}
                  aria-label="expand row"
                  size="small"
                  onClick={() => decrementValue(FOCUS_HUB_VALUE_LABELS.NETWORK)}
                  sx={{ color: 'var(--color-homeworld)', height: '2rem', boxShadow: '0px 2px 6px #00000021' }}>
                  <RemoveIcon />
                </IconButton>
                <p>{networkValue}</p>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => incrementValue(FOCUS_HUB_VALUE_LABELS.NETWORK)}
                  sx={{ color: 'var(--color-homeworld)', height: '2rem', boxShadow: '0px 2px 6px #00000021' }}>
                  <AddIcon />
                </IconButton>
              </UsageFocusIncreaseDecreaseContainer>
            </UsageFocusValueContainer>
            <UsageFocusValueContainer>
              <div>Compute</div>
              <UsageFocusIncreaseDecreaseContainer>
                <IconButton
                  disabled={computeValue === 0}
                  aria-label="expand row"
                  size="small"
                  onClick={() => decrementValue(FOCUS_HUB_VALUE_LABELS.COMPUTE)}
                  sx={{ color: 'var(--color-homeworld)', height: '2rem', boxShadow: '0px 2px 6px #00000021' }}>
                  <RemoveIcon />
                </IconButton>
                <p>{computeValue}</p>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => incrementValue(FOCUS_HUB_VALUE_LABELS.COMPUTE)}
                  sx={{ color: 'var(--color-homeworld)', height: '2rem', boxShadow: '0px 2px 6px #00000021' }}>
                  <AddIcon />
                </IconButton>
              </UsageFocusIncreaseDecreaseContainer>
            </UsageFocusValueContainer>
            <UsageFocusValueContainer>
              <div>Storage</div>
              <UsageFocusIncreaseDecreaseContainer>
                <IconButton
                  disabled={storageValue === 0}
                  aria-label="expand row"
                  size="small"
                  onClick={() => decrementValue(FOCUS_HUB_VALUE_LABELS.STORAGE)}
                  sx={{ color: 'var(--color-homeworld)', height: '2rem', boxShadow: '0px 2px 6px #00000021' }}>
                  <RemoveIcon />
                </IconButton>
                <p>{storageValue}</p>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => incrementValue(FOCUS_HUB_VALUE_LABELS.STORAGE)}
                  sx={{ color: 'var(--color-homeworld)', height: '2rem', boxShadow: '0px 2px 6px #00000021' }}>
                  <AddIcon />
                </IconButton>
              </UsageFocusIncreaseDecreaseContainer>
            </UsageFocusValueContainer>
          </div>
        )}
      </UsageFocusContainer>
      {iconValues?.length > 0 && (
        <FocusUsageIconsContainer>
          {iconValues.map(icon => {
            return (
              <FocusUsageIcons key={icon?.id}>
                <a href={icon?.href}>
                  <img src={icon?.src} alt={icon?.alt} />
                </a>
              </FocusUsageIcons>
            );
          })}
        </FocusUsageIconsContainer>
      )}
    </FocusHubContainer>
  );
}

FocusHub.propTypes = {
  titleImage: PropTypes.string.isRequired,
  alternateImageText: PropTypes.string,
  iconValues: PropTypes.arrayOf(PropTypes.shape({})),
  network: PropTypes.number.isRequired,
  compute: PropTypes.number.isRequired,
  storage: PropTypes.number.isRequired,
};

FocusHub.defaultProps = {
  alternateImageText: 'alt',
  iconValues: [],
};

export default FocusHub;
