import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  VisualizerWrapper,
  VisualizerMain,
  VisualizerPanel,
  SimpleLogoIcon,
  CloseIcon,
  VisualizerIcon,
  VisualizerDiscover,
  VisualizerDiscoverTitle,
  VisualizerDiscoverOptions,
} from './visualizer-styled';

import Logo from '../../../images/Digital_Realty_Logo_Simple.svg';
import Discover from '../../../images/discover_icon.svg';
import Model from '../../../images/model_icon.svg';
import Generate from '../../../images/generate_icon.svg';
import Close from '../../../images/close_icon.svg';
import VisualizerWorld from '../../../images/Digital_Realty_World.png';

function Visualizer() {
  const showRegions = true;
  const regions = ['North America', 'LATAM', 'Europe', 'Africa', 'Asia Pacific'];

  return (
    <VisualizerWrapper>
      <VisualizerPanel>
        <SimpleLogoIcon src={Logo} alt="logo" />
        <VisualizerIcon>
          <img src={Discover} alt="discover" />
          Discover
        </VisualizerIcon>
        <VisualizerIcon>
          <img src={Model} alt="model" />
          Model
        </VisualizerIcon>
        <VisualizerIcon>
          <img src={Generate} alt="generate" />
          Generate
        </VisualizerIcon>
        <CloseIcon src={Close} alt="close" />
      </VisualizerPanel>
      <VisualizerMain background={VisualizerWorld} />
      {showRegions && (
        <VisualizerDiscover>
          <VisualizerDiscoverTitle>Choose a region to get started</VisualizerDiscoverTitle>
          {regions?.length > 0 &&
            regions?.map(region => (
              <VisualizerDiscoverOptions>
                <span>{region}</span>
                <KeyboardArrowRightIcon sx={{ verticalAlign: 'middle;', float: 'right;', color: '#C8C8C8;' }} />
              </VisualizerDiscoverOptions>
            ))}
        </VisualizerDiscover>
      )}
    </VisualizerWrapper>
  );
}

export default Visualizer;
