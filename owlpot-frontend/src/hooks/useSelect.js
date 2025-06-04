import { useNotification } from '@/hooks/useNotification';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
export const useSelect = (initialPage = 1, initialPageSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const { showNotification } = useNotification();

  const query = useQuery({
    queryKey: ['employees', page, pageSize],
    queryFn: async () => {
      const res = await getEmployees({ page, pageSize });

      if (res.code !== 0) {
        showNotification(`获取失败: ${res.msg || '未知错误'}`, 'error');
        throw new Error(res.msg || '获取失败');
      }

      showNotification('获取成功', 'success');

      // 计算分页元数据
      const total = res.data.total;
      const totalPages = Math.ceil(total / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        records: res.data.records,
        total,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage
      };
    },
    keepPreviousData: true,
    staleTime: 5000,
  });

  // 重置页码为1时设置页面大小
  const setPageSizeWithReset = (size) => {
    setPage(1);
    setPageSize(size);
  };

  return {
    ...query,
    page,
    setPage,
    pageSize,
    setPageSize: setPageSizeWithReset, // 使用重置页码的版本
    goToNextPage: () => {
      if (query.data?.hasNextPage) {
        setPage(p => p + 1);
      }
    },
    goToPrevPage: () => {
      if (query.data?.hasPrevPage) {
        setPage(p => p - 1);
      }
    },
    goToPage: (newPage) => {
      if (newPage >= 1 && newPage <= query.data?.totalPages) {
        setPage(newPage);
      }
    }
  };
};