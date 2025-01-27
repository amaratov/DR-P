import styled from '@emotion/styled';

export const VisualizerPanel = styled.div`
  display: block;
  width: 120px;
  margin: 8px;
  background: #3c55c2;
  border: 8px solid white;
  border-radius: 30px;
  position: relative;
`;

export const SimpleLogoIcon = styled.img`
  background: #5569c2;
  padding: 34px;
  margin: 8px;
  border-radius: 16px;
`;

export const CloseIcon = styled.img`
  padding: 30px 40px;
  position: absolute;
  bottom: 0;
`;

export const VisualizerIcon = styled.div`
  padding: 10px 20px;
  color: white;
  text-align: center;
`;

export const VisualizerMain = styled.div`
  height: 100%;
  width: 100%;
  ${({ background }) => `background: url(${background})`};
  mix-blend-mode: screen;
  background-repeat: no-repeat;
  background-size: contain;
`;

export const VisualizerWrapper = styled.div`
  background-color: #e7eafb;
  height: 100vh;
  min-height: 475px;
  display: flex;
  position: relative;
`;

export const VisualizerDiscover = styled.div`
  position: absolute;
  bottom: 40px;
  left: 160px;
  width: 300px;
  border: 8px solid #e7eafb;
  background-color: white;
  border-radius: 30px;
  padding: 0 25px;
  size: 16px;
  line-height: 24px;
`;

export const VisualizerDiscoverTitle = styled.div`
  padding: 20px 0;
  font-weight: 800;
`;

export const VisualizerDiscoverOptions = styled.div`
  padding: 16px 0;
  border-top: 1px solid rgba(14, 14, 14, 0.06);
`;
