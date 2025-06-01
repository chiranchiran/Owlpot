import React, { useState } from 'react';
import Pagination from '../common/Pagination'; // 假设分页组件路径如此，根据实际情况调整
import './index.css'; // 新建对应的样式文件

// 模拟员工数据
const mockEmployees = [
  {
    id: 1,
    name: '管理员',
    account: 'admin',
    phone: '13812312312',
    status: '启用',
    lastOperateTime: '2022-02-17 09:16'
  },
  // 可添加更多员工数据
];

const Employee = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchName, setSearchName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // 处理搜索
  const handleSearch = () => {
    if (searchName) {
      const filteredEmployees = mockEmployees.filter(employee => employee.name.includes(searchName));
      setEmployees(filteredEmployees);
    } else {
      setEmployees(mockEmployees);
    }
  };

  // 处理分页
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentEmployees = employees.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="employee-management">
      <div className="search-bar">
        <div className="search seacher">
          <label htmlFor="search" className="seacher">员工姓名:</label>
          <input
            type="text"
            id="search"
            className="seacher"
            placeholder="请输入员工姓名"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button className="search-button seacher" onClick={handleSearch}>查询</button>
        </div>

        <button className="add-button">+ 添加员工</button>
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>员工姓名</th>
            <th>账号</th>
            <th>手机号</th>
            <th>账号状态</th>
            <th>最后操作时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>{employee.account}</td>
              <td>{employee.phone}</td>
              <td>
                {employee.status === '启用' ? (
                  <span className="status-enabled">● 启用</span>
                ) : (
                  <span className="status-disabled">● 禁用</span>
                )}
              </td>
              <td>{employee.lastOperateTime}</td>
              <td>
                <span className="operation">修改</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <span className="operation">禁用</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={employees.length}
        itemsPerPage={ordersPerPage}
        initialPage={currentPage}
        onPageChange={setCurrentPage}
        className="my-custom-pagination"
        activeClassName="my-active-page"
      />
    </div>
  );
};

export default Employee;