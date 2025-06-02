// src/hooks/useReport.js
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import {
  getTodayData,
  getOrdersCount,
  getDishSetmealCount,
  getOrderStatistics,
  getTurnoverStatistics,
  getUserStatistics,
  getSalesStatistics
} from '../api/report';

export const useTodayData = () => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['todayData'],
    queryFn: () => getTodayData().then(res => res.data.data),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取今日数据失败: ${error.message}`, 'error');
    }
  });
};

export const useOrdersCount = () => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['ordersCount'],
    queryFn: () => getOrdersCount().then(res => res.data.data),
    staleTime: 10 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取订单数量失败: ${error.message}`, 'error');
    }
  });
};

export const useDishSetmealCount = () => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['dishSetmealCount'],
    queryFn: () => getDishSetmealCount().then(res => res.data.data),
    staleTime: 10 * 60 * 1000,
    onError: (error) => {
      showNotification(`获取菜品套餐数量失败: ${error.message}`, 'error');
    }
  });
};

export const useOrderStatistics = (timePeriod) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['orderStatistics', timePeriod],
    queryFn: () => getOrderStatistics(timePeriod).then(res => res.data.data),
    staleTime: 15 * 60 * 1000,
    enabled: !!timePeriod,
    onError: (error) => {
      showNotification(`获取订单统计失败: ${error.message}`, 'error');
    }
  });
};

export const useTurnoverStatistics = (timePeriod) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['turnoverStatistics', timePeriod],
    queryFn: () => getTurnoverStatistics(timePeriod).then(res => res.data.data),
    staleTime: 15 * 60 * 1000,
    enabled: !!timePeriod,
    onError: (error) => {
      showNotification(`获取营业额统计失败: ${error.message}`, 'error');
    }
  });
};

export const useUserStatistics = (timePeriod) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['userStatistics', timePeriod],
    queryFn: () => getUserStatistics(timePeriod).then(res => res.data.data),
    staleTime: 15 * 60 * 1000,
    enabled: !!timePeriod,
    onError: (error) => {
      showNotification(`获取用户统计失败: ${error.message}`, 'error');
    }
  });
};

export const useSalesStatistics = (timePeriod) => {
  const { showNotification } = useNotification();

  return useQuery({
    queryKey: ['salesStatistics', timePeriod],
    queryFn: () => getSalesStatistics(timePeriod).then(res => res.data.data),
    staleTime: 15 * 60 * 1000,
    enabled: !!timePeriod,
    onError: (error) => {
      showNotification(`获取销量统计失败: ${error.message}`, 'error');
    }
  });
};