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

export const useEmployees = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['employees', { page: pageParam, pageSize }],
    queryFn: async ({ queryKey }) => {
      const { page, pageSize } = queryKey[1];
      const res = await getEmployees({ page, pageSize });

      if (res.code !== 0) {
        throw new Error(res.msg || '获取员工列表失败');
      }

      // 不需要在这里设置缓存，useQuery 会自动处理
      showNotification('员工列表获取成功', 'success');
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      // 根据实际接口返回的数据结构判断是否有下一页
      // 这里假设接口返回 totalPages 或 hasNextPage 字段
      const nextPage = pageParam + 1;
      return lastPage.totalPages >= nextPage ? nextPage : undefined;
    },
    keepPreviousData: true, // 防止翻页时UI闪烁
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