import styled from '@emotion/styled';

export const ModelPopupWrapper = styled.div`
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

export const ModelPopupContent = styled.div`
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
