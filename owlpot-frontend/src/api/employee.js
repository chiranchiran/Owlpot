import http from '../utils/http';

// 查询员工列表
export const getEmployees = (params = {}) => {
  return http.get('/employees', { params });
};

// 查询单个员工
export const getEmployeeById = (id) => {
  return http.get(`/employees/${id}`);
};

// 删除员工
export const deleteEmployee = (id) => {
  return http.delete(`/employee/${id}`);
};

// 添加员工
export const addEmployee = (employeeData) => {
  return http.post('/employees', employeeData);
};

// 更新员工信息
export const updateEmployee = (id, employeeData) => {
  return http.put(`/employees/${id}`, employeeData);
}