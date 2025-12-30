import styled from 'styled-components';

export const WrapperContainer = styled.div`
  max-width: 1270px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 100px);
`;

export const WrapperHeader = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: rgb(36, 36, 36);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgb(26, 148, 255);
`;

export const WrapperOrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WrapperOrderCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
`;

export const WrapperOrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: rgb(120, 120, 120);

  strong {
    color: rgb(36, 36, 36);
    margin-right: 6px;
  }
`;

export const WrapperOrderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const WrapperProductItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 6px;
`;

export const WrapperProductImage = styled.div`
  flex-shrink: 0;
`;

export const WrapperProductInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const WrapperProductDetails = styled.div`
  flex: 1;
`;

export const WrapperProductName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgb(36, 36, 36);
  margin-bottom: 6px;
  line-height: 1.4;
`;

export const WrapperProductPrice = styled.div`
  font-size: 13px;
  color: rgb(120, 120, 120);
`;

export const WrapperOrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

export const WrapperOrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const WrapperStatus = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
        switch (props.status) {
            case 'delivered':
                return '#52c41a';
            case 'processing':
                return '#faad14';
            default:
                return '#d9d9d9';
        }
    }};
  color: #fff;
`;

export const WrapperPaymentStatus = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => {
        switch (props.status) {
            case 'paid':
                return '#52c41a';
            case 'unpaid':
                return '#ff4d4f';
            default:
                return '#d9d9d9';
        }
    }};
  color: #fff;
`;

export const WrapperOrderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const WrapperEmptyOrders = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
`;
