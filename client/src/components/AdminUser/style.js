import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
 color: #000;
    font-size: 14px;
`
export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
  }
  & .ant-upload-list {
    display: none;
  }
  & .ant-upload {
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
  }
`