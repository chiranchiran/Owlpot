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
import { Navigate, useNavigate } from 'react-router-dom';

// export const useEmployees = () => {
//   const { showNotification } = useNotification();
//   return useQuery({
//     queryKey: ['employees', { page: currentPage, pageSize }],
//     queryFn: async ({ queryKey }) => {
//       const { page, pageSize } = queryKey[1];
//       const res = await getEmployees({ page, pageSize });

//       if (res.code !== 0) {
//         throw new Error(res.msg || '获取员工列表失败');
//       }

//       // 不需要在这里设置缓存，useQuery 会自动处理
//       showNotification('员工列表获取成功', 'success');
//       return res.data;
//     },
//     getNextPage: (lastPage) => {
//       // 根据实际接口返回的数据结构判断是否有下一页
//       // 这里假设接口返回 totalPages 或 hasNextPage 字段
//       const nextPage = currentPage + 1;
//       return lastPage.totalPages >= nextPage ? nextPage : undefined;
//     },
//     keepPreviousData: true, // 防止翻页时UI闪烁
//   });
// };

export const useEmployee = (id) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const res = await getEmployeeById(id)
      if (res.code === 0) {
        throw new Error(res.msg || '获取员工数据失败');
      }
      return res.data
    }
  });
};

export const useAddEmployee = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  return useMutation({
    mutationFn: addEmployee,
    onSuccess: (data) => {
      if (data.code === 0) {
        throw new Error(data.msg || '添加员工失败');
      }
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      showNotification('员工添加成功', 'success');
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const navigate = useNavigate()
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (data, variables) => {
      if (data.code === 0) {
        throw new Error(data.msg || '修改员工信息失败');
      }
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.setQueryData(['employee', variables.id], data.data);
      if (data.data !== null) {
        showNotification('修改员工信息成功', 'success');
        navigate('/employee')
      }
    }
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (data, id) => {
      if (data.code === 0) {
        throw new Error(data.msg || '删除员工失败');
      }
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      showNotification('员工删除成功', 'success');
    }
  });
};