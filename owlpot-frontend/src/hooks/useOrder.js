// src/hooks/useOrder.js
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import {
  getMerchantOrders,
  getUserOrders,
  getMerchantOrderById,
  getUserOrderById,
  updateOrder,
  createOrder
} from '../api/order';
import { useNavigate } from 'react-router-dom';

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await getOrderById(id)
      if (res.code === 0) {
        throw new Error(res.msg || '获取订单数据失败');
      }
      return res.data
    }
  });
};

// export const useAddOrder = () => {
//   const queryClient = useQueryClient();
//   const { showNotification } = useNotification();
//   return useMutation({
//     mutationFn: addOrder,
//     onSuccess: (data) => {
//       if (data.code === 0) {
//         throw new Error(data.msg || '添加订单失败');
//       }
//       queryClient.invalidateQueries({ queryKey: ['orders'] });
//       showNotification('订单添加成功', 'success');
//     },
//   });
// };

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const navigate = useNavigate()
  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (data, variables) => {
      if (data.code === 0) {
        throw new Error(data.msg || '修改订单信息失败');
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.setQueryData(['order', variables.id], data.data);
      if (data.data !== null) {
        showNotification('修改订单信息成功', 'success');
        navigate('/order')
      }
    }
  });
};

// export const useDeleteOrder = () => {
//   const queryClient = useQueryClient();
//   const { showNotification } = useNotification();

//   return useMutation({
//     mutationFn: deleteOrder,
//     onSuccess: (data, id) => {
//       if (data.code === 0) {
//         throw new Error(data.msg || '删除订单失败');
//       }
//       queryClient.invalidateQueries({ queryKey: ['orders'] });
//       showNotification('订单删除成功', 'success');
//     }
//   });
// };