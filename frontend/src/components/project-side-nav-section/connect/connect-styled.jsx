import styled from '@emotion/styled';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export const SubPanelListSubHeader = styled(ListSubheader)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
  background-color: inherit;
  padding: 0;
`;

export const SubPanelListItem = styled(ListItem)`
  padding: 0;
  &:hover {
    cursor: pointer;
  }
`;

export const SubPanelListItemStateIcon = styled.div`
  //span {
  //  max-width: 18px;
  //  max-height: 18px;
  //}
`;
export const SubPanelListItemText = styled(ListItemText)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
  padding-left: 10px;
`;

export const SubPanelHeaderCloseBtn = styled.div`
  padding-right: 8px;
  &:hover {
    cursor: pointer;
  }
`;

export const SubPanelArrowRight = styled.div`
  svg {
    color: var(--color-aluminium);
  }
`;

export const ConnectionMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ConnectionCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background: rgba(255, 255, 255, 0.98);
  opacity: 0.8;
  border: ${({ highlighted }) => (highlighted ? '1px solid rgba(62, 83, 193, 0.7)' : '1px solid rgba(255, 255, 255, 0.7)')};
  box-shadow: ${({ highlighted }) =>
    highlighted ? '0 4px 10px rgba(62, 83, 193, 0.4), 0 10px 20px rgba(62, 83, 193, 0.4)' : '0 4px 10px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04)'};
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 16px;
`;

export const ConnectionCardTitle = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-cathedral);
  margin-bottom: 21px;
`;

export const ConnectionCardItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  min-height: 80px;
`;

export const ConnectionCardItemAvatar = styled.div`
  width: 35%;
`;

export const ConnectionCardItemAvatarImage = styled.div`
  border: 1px solid var(--color-aluminium);
  background-color: #fff;
  border-radius: 50%;
  width: 90%;
  height: 90%;
  max-width: 80px;
  max-height: 80px;
  ${({ previewUrl }) =>
    previewUrl &&
    `
  background-image:    url(${previewUrl});
  background-size:     cover;
  background-repeat:   no-repeat;
  background-position: center center;
  `}
`;

export const ConnectionCardItemInfo = styled.div`
  width: 55%;
`;

export const ConnectionCardItemMainText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
`;
export const ConnectionCardItemSubText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-cathedral);
  ${({ useCapitalize }) => useCapitalize && 'text-transform: capitalize;'}
`;
export const ConnectionCardItemOtherInfo = styled.div``;

export const ConnectionCardItemAction = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #dc4b4a;
  &:hover {
    cursor: pointer;
  }
`;

export const ConnectionCardItemFooterAction = styled.div`
  button {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--color-homeworld);
  }
  svg {
    max-width: 16px;
    max-height: 16px;
    color: var(--color-homeworld);
  }
`;

export const ConnectionSubmitBtn = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-homeworld);
  margin-top: 12px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  ${({ disableBtn }) =>
    disableBtn &&
    `   
    pointer-events: none;
    color: var(--color-cathedral);
  `};
`;

export const ConnectionExistingDividerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  margin: 16px 0;
`;

export const ConnectionVerticalDashLine = styled.div`
  position: absolute;
  top: -11px;
  left: 38px;
  width: 1px;
  height: 50px;
  border-left: 2px dashed var(--color-aluminium);
`;

export const ConnectionEditExistingBtn = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-homeworld);
  margin-top: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const ConnectionPopupWrapper = styled.div`
  z-index: 1350;
  position: fixed;
  height: 100%;
  left: 0;
  top: 0;
  line-height: 2rem;
  display: flex;
  flex-direction: column;
  //flex: 1 0 auto;
  color: white;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const ConnectionPopupContent = styled.div`
  display: flex;
  background: #ffffff;
  color: #000000;
  text-align: center;
  align-items: center;
  flex-direction: column;
  width: 24rem;
  padding: 2rem 3rem 3rem 3rem;
  border-radius: 30px;
  border: 10px solid #3e53c1bf;
  line-height: 1.75rem;
`;

export const ConnectNoteViewArea = styled.div`
  max-width: 450px;
  padding: 16px 20px;
  border-radius: 12px;
  background-color: var(--color-la-luna);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04);
  text-align: left;
  word-break: normal;
`;

export const ConnectNoteEditContainer = styled.div`
  .MuiTextField-root {
    max-width: 450px;
    padding: 16px 20px;
    background-color: var(--color-la-luna);
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04);
  }
  .MuiInput-root {
    border-bottom: unset;
  }
`;
