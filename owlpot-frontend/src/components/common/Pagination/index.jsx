import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.css'; // 确保你有相应的CSS样式文件
/**
 * 通用分页组件
 * @param {Object} props - 组件属性
 * @param {number} props.totalItems - 总项目数
 * @param {number} [props.itemsPerPage=10] - 每页显示的项目数
 * @param {number} [props.initialPage=1] - 初始页码
 * @param {number} [props.maxVisiblePages=5] - 最多显示的页码数
 * @param {function} [props.onPageChange] - 页码变化时的回调函数
 * @param {string} [props.className] - 自定义类名
 * @param {string} [props.activeClassName] - 活跃页码的自定义类名
 */
const Pagination = ({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
  maxVisiblePages = 5,
  onPageChange,
  className,
  activeClassName,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 生成要显示的页码数组
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      // 总页数少于等于最大显示页数，显示全部页码
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 计算当前可见页码范围
    let startPage, endPage;
    if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - Math.floor(maxVisiblePages / 2);
      endPage = currentPage + Math.floor(maxVisiblePages / 2);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // 处理页码变化
  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (onPageChange) {
        onPageChange(page);
      }
    }
  };

  return (
    <div className={`pagination ${className || ''}`}>
      {/* 上一页按钮 */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="pagination-btn"
      >
        上一页
      </button>

      {/* 页码按钮 */}
      {getVisiblePages().map((pageNum) => (
        <button
          key={pageNum}
          className={`pagination-btn ${currentPage === pageNum ? 'active ' + (activeClassName || '') : ''}`}
          onClick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      {/* 下一页按钮 */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="pagination-btn"
      >
        下一页
      </button>

      {/* 页码信息 */}
      <div className="page-info">
        第 {currentPage} 页 / 共 {totalPages} 页
      </div>
    </div>
  );
};

// 添加 propTypes 验证
Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  initialPage: PropTypes.number,
  maxVisiblePages: PropTypes.number,
  onPageChange: PropTypes.func,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
};

export default Pagination;