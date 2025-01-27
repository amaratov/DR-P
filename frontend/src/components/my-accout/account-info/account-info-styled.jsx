import styled from '@emotion/styled';

export const AccountFlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const AccountInfoWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 30px;
  padding: 16px 32px 24px 32px;
`;

export const LabelContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 10px;
  &:hover {
    cursor: pointer;
  }
`;

export const LabelText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-homeworld);
`;

export const LabelTextAltColor = styled(LabelText)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: ${({ disabledEdit }) => (disabledEdit ? '10' : '14')}px;
  line-height: ${({ disabledEdit }) => (disabledEdit ? '8' : '20')}px;
  color: var(--color-cathedral);
  padding-bottom: 12px;
`;

export const SubLabelText = styled(LabelText)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: var(--color-batman);
  padding-bottom: 6px;
`;

export const LabelIcon = styled.div`
  svg {
    color: var(--color-homeworld);
    max-height: 12px;
  }
`;

export const AccountInfoSubHeader = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  color: var(--color-batman);
`;

export const ValueText = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-cathedral);
`;

export const ValueTextAlt = styled(ValueText)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-cathedral);
  padding-bottom: 5px;
  border-bottom: 1px solid var(--color-cathedral);
  ${({ disabledEdit }) =>
    disabledEdit &&
    `
    padding-top: 12px;
    padding-bottom: 18px;
    border-color: rgb(230, 230, 230);
`}
`;

export const RoleText = styled.div`
  display: flex;
  align-items: center;
  min-width: 300px;
  min-height: 50px;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  background-color: #fafafa;
`;

export const FilledValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  min-height: 50px;
`;

export const FilledValueWrapperWithLShape = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 0.2fr 1fr 1fr;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  min-height: 50px;
`;

export const FilledDetailedWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  margin-bottom: 10px;
`;

export const FilledValueText = styled.div`
  max-width: 268px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
  flex-grow: ${({ flexGrow }) => flexGrow};
`;

export const FilledValueRemoveIcon = styled.div`
  button {
    color: var(--color-homeworld);
  }
`;

export const FilledValueRemoveIconWithLShape = styled.div`
  justify-self: right;
  button {
    color: var(--color-homeworld);
  }
`;
