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

// 商家订单列表
export const useMerchantOrders = (params = {}) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['merchantOrders', params],
    queryFn: () => getMerchantOrders(params).then(res => res.data.data),
    staleTime: 2 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取商家订单失败: ${error.message}`, 'error');
    }
  });
};

// 用户订单列表
export const useUserOrders = (params = {}) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['userOrders', params],
    queryFn: () => getUserOrders(params).then(res => res.data.data),
    staleTime: 2 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取用户订单失败: ${error.message}`, 'error');
    }
  });
};

// 商家订单详情
export const useMerchantOrder = (id) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['merchantOrder', id],
    queryFn: () => getMerchantOrderById(id).then(res => res.data.data),
    enabled: !!id,
    onError: (error) => {
      showNotification(`获取商家订单详情失败: ${error.message}`, 'error');
    }
  });
};

// 用户订单详情
export const useUserOrder = (id) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['userOrder', id],
    queryFn: () => getUserOrderById(id).then(res => res.data.data),
    enabled: !!id,
    onError: (error) => {
      showNotification(`获取用户订单详情失败: ${error.message}`, 'error');
    }
  });
};

// 创建订单
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['merchantOrders'] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      showNotification('订单创建成功', 'success');
      return data;
    },
    onError: (error) => {
      showNotification(`创建订单失败: ${error.message}`, 'error');
    }
  });
};

// 更新订单
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({ id, orderData }) => updateOrder(id, orderData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['merchantOrders'] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      queryClient.setQueryData(['merchantOrder', variables.id], data.data);
      queryClient.setQueryData(['userOrder', variables.id], data.data);
      showNotification('订单更新成功', 'success');
    },
    onError: (error) => {
      showNotification(`更新订单失败: ${error.message}`, 'error');
    }
  });
};