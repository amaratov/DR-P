import styled from '@emotion/styled';

export const FocusHubContainer = styled.div`
  display: flex;
  background: #f7f7f7;
  z-index: 101;
  position: relative;
  flex-flow: column;
  max-width: 20rem;
  width: 18rem;
  float: right;
  margin-right: 2rem;
  margin-top: 2rem;
  padding: 1rem 1rem;
  border-radius: 40px;
`;

export const UsageFocusContainer = styled.div`
  display: flex;
  background: var(--color-la-luna);
  flex-flow: column;
  border-radius: 25px;
  display: block;
  box-shadow: 4px 4px 10px #0000003b;
  padding-bottom: 1rem;
  padding-top: 0.25rem;
  .usage-title-box {
    display: block;
    text-align: center;
    border: 1px solid var(--color-aluminium);
    margin: 8px;
    border-radius: 20px;
    .usage-title-image {
      background: var(--color-la-luna);
      max-width: 7rem;
      max-height: 4rem;
      padding: 1rem 1rem;
      position: relative;
      vertical-align: middle;
      align-self: center;
    }
  }
  .usage-focus-exapnd {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 0.1fr;
    padding: 0rem 1rem;
    font-size: 16px;
  }
`;

export const UsageFocusValueContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 0.5fr 1fr;
  align-items: center;
  font-size: 14px;
  padding: 0rem 1rem;
  grid-gap: 2rem;
`;

export const UsageFocusIncreaseDecreaseContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  padding-right: 1rem;
  justify-items: center;
  align-items: center;
  font-size: 16px;
`;

export const FocusUsageIconsContainer = styled.div`
  display: grid;
  padding-top: 1rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
`;

export const FocusUsageIcons = styled.div`
  max-width: 24px;
  max-height: 24px;
  display: flex;
  padding: 1rem;
  background: var(--color-la-luna);
  border-radius: 40px;
  box-shadow: 2px 6px 11px #0000003b;
  justify-content: center;
  align-items: center;
  a {
    display: flex;
  }
  img {
    max-width: 24px;
    max-height: 24px;
    align-self: center;
  }
`;
