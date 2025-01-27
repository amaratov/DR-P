import styled from '@emotion/styled';

export const MarketingFilterPanelContainer = styled.div`
  z-index: 105;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MarketingFilterPanelWrapper = styled.div`
  overflow: auto;
  background: #ffffff;
  color: #000000;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 30rem;
  height: 40rem;
  padding: 2rem 3rem 3rem 3rem;
  border-radius: 30px;
  border: 10px solid #f1f1f8;
  line-height: 1.75rem;
`;

export const MarketingFilterPanelHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
  width: 100%;
  h1 {
    justify-self: left;
  }
  div {
    justify-self: right;
  }
`;

export const MarketingFilterPanelFilterSectionWrapper = styled.div`
  display: grid;
  width: 100%;
  margin-top: 1rem;
  h2 {
    font-size: 20px;
    justify-self: left;
  }
`;

export const MarketingFilterPanelFilterValues = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: left;
`;

export const MarketingFilterPanelFilterCheckboxRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
`;
