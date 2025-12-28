import React, { useState } from 'react'
import { Dropdown, Space, Table } from 'antd';
import Loading from '../../components/LoadingComponent/Loading';

const TableComponent = (props) => {
    const {selectionType='checkbox', data = [], isLoading = false, columns = [], handleDeleteMany} = props;
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    setRowSelectedKeys(selectedRowKeys);
  },
  // getCheckboxProps: (record) => ({
  //   disabled: record.name === 'Disabled User',

  //   name: record.name,
  // }),
};

// const items = [
//   {
//     key: '1',
//     label: (
//       <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
//         1st menu item
//       </a>
//     ),
//   },
//   {
//     key: '2',
//     label: (
//       <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
//         2nd menu item (disabled)
//       </a>
//     ),
//     disabled: true,
//   },
//   {
//     key: '3',
//     label: (
//       <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
//         3rd menu item (disabled)
//       </a>
//     ),
//     disabled: true,
//   },
//   {
//     key: '4',
//     danger: true,
//     label: 'a danger item',
//   },
// ];

const handleDeleteAll = () => {
  handleDeleteMany(rowSelectedKeys);
}
  return (
    <Loading isLoading={isLoading}>
      {rowSelectedKeys.length > 0 && (
      <div style={{ background: '#1677FF', color: '#fff', fontWeight: 'bold', padding: '10px', cursor: 'pointer'
       }}
               onClick={handleDeleteAll}>
        {/* <Dropdown
    menu={{
      items,
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown> */}
  Xóa tất cả
  </div>
      )}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  )
}

export default TableComponent
