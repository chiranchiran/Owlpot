// src/hooks/useEmployee.js
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import {
  getEmployees,
  getEmployeeById,
  deleteEmployee,
  addEmployee,
  updateEmployee
} from '../api/employee';

export const useEmployees = (params = {}) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => getEmployees(params).then(res => res.data.data),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取员工列表失败: ${error.message}`, 'error');
    }
  });
};

export const useEmployee = (id) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id).then(res => res.data.data),
    enabled: !!id,
    onError: (error) => {
      showNotification(`获取员工详情失败: ${error.message}`, 'error');
    }
  });
};

export const useAddEmployee = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      showNotification('员工添加成功', 'success');
    },
    onError: (error) => {
      showNotification(`添加员工失败: ${error.message}`, 'error');
    }
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({ id, employeeData }) => updateEmployee(id, employeeData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.setQueryData(['employee', variables.id], data.data);
      showNotification('员工信息更新成功', 'success');
    },
    onError: (error) => {
      showNotification(`更新员工信息失败: ${error.message}`, 'error');
    }
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      showNotification('员工删除成功', 'success');
    },
    onError: (error) => {
      showNotification(`删除员工失败: ${error.message}`, 'error');
    }
  });
};