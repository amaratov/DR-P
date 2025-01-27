import styled from '@emotion/styled';

export const DiscoverProjectDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 12px;
  margin-top: 30px;
  padding: 20px;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  background-color: var(--color-la-luna);
  min-height: 255px;
`;

export const DiscoverProjectDetailHeader = styled.div`
  margin-bottom: 30px;
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  color: var(--color-batman);
`;

export const DiscoverProjectDetailSubHeader = styled.div`
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #c8c8c8;
`;

export const DiscoverProjectDetailFileUploadWrapper = styled.div`
  margin-bottom: 24px;
`;

export const DiscoverProjectDetailAssociatedFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(30, 25, 245, 0.04);
  color: var(--color-homeworld);
  min-height: 50px;
  padding: 5px 10px;
  border-radius: 12px;
`;

export const DiscoverProjectDetailAssociatedFileItemLeft = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

export const DiscoverProjectDetailAssociatedFileItemRight = styled.div``;

export const DiscoverProjectDetailAssociatedFileItemIcon = styled.div``;

export const DiscoverProjectDetailAssociatedFileItemText = styled.div`
  padding-left: 5px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: var(--color-homeworld);
`;

export const DiscoverProjectDetailInputWrapper = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
  width: 100%;
  align-self: flex-end;
`;

export const DiscoverProjectDetailInputLabel = styled.div`
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-cathedral);
`;

export const DiscoverProjectDetailInputField = styled.input`
  border: unset;
  border-bottom: 1px solid var(--color-aluminium);
  width: 100%;
  min-height: 24px;

  font-size: 16px;
  line-height: 24px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  padding: 0 0 12px;

  &:focus {
    outline: 0;
  }
  &::placeholder {
    color: var(--color-aluminium);
    opacity: 1;
  }
  &:-ms-input-placeholder {
    color: var(--color-aluminium);
  }

  &::-ms-input-placeholder {
    color: var(--color-aluminium);
  }
`;
