import { useNotification } from '../components/common/NotificationContext';
// 错误代码映射表
const ERROR_CODES = {
  12000: '用户不存在，请重新输入！',
  12001: '密码错误，请重新输入！',
  11003: '登录失败次数过多，请1小时后重试！',
  12006: '找不到相关信息',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '资源未找到',
  500: '服务器发生错误',
  503: '服务不可用',
};

/**
 * 处理 API 错误
 * @param {Error} error 错误对象
 * @returns {string} 用户友好的错误消息
 */
export const handleApiError = (error) => {
  // 业务错误处理（API 返回的错误代码）
  if (error.response?.data?.code) {
    const { code, msg } = error.response.data;
    return ERROR_CODES[code] || msg || `业务错误: ${code}`;
  }

  // HTTP 状态码错误
  if (error.response?.status) {
    const status = error.response.status;
    return ERROR_CODES[status] || `HTTP 错误: ${status}`;
  }

  // 请求超时错误
  if (error.code === 'ECONNABORTED') {
    return '请求超时，请检查网络连接或稍后再试';
  }

  // 网络连接错误
  if (error.message === 'Network Error') {
    return '网络连接失败，请检查您的网络设置';
  }

  // 默认错误处理
  return error.message || '发生未知错误，请稍后再试';
};

// 导出错误类型常量
export const ERROR_TYPES = {
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
};


// export const handleError = () => {
//   const { showNotification } = useNotification();

//   const handleError = (error) => {
//     const message = handleApiError(error);
//     return showNotification(message, 'error');
//   };

//   return handleError;
// };