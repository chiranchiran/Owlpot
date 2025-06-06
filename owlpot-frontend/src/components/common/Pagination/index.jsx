import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Pagination = ({
  total,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  maxVisiblePages = 5
}) => {
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 当没有数据时，不显示分页
  if (total === 0 || total === undefined) {
    return null;
  }

  // 生成要显示的页码数组
  const getVisiblePages = () => {
    // 总页数少于等于最大显示页数，显示全部页码
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage, endPage;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // 左侧边界情况
    if (currentPage <= halfVisible + 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    }
    // 右侧边界情况
    else if (currentPage >= totalPages - halfVisible) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    }
    // 中间情况
    else {
      startPage = currentPage - halfVisible;
      endPage = currentPage + halfVisible;
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    // 添加省略号
    if (startPage > 1) {
      if (startPage > 2) {
        pages.unshift('...');
      }
      pages.unshift(1);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  // 处理页码变化
  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // 处理上一页
  const goToPrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // 处理下一页
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // 处理首页
  const goToFirstPage = () => {
    handlePageChange(1);
  };

  // 处理尾页
  const goToLastPage = () => {
    handlePageChange(totalPages);
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        共 {total} 条记录 • 第 {currentPage} 页 / 共 {totalPages} 页
      </div>

      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={goToFirstPage}
          className="pagination-btn pagination-first"
          title="首页"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 5v14l-1-1v-12zm1 6l6 6v-12l-6 6zm8-6v12l6-6-6-6z" />
          </svg>
        </button>

        <button
          disabled={currentPage === 1}
          onClick={goToPrevPage}
          className="pagination-btn pagination-prev"
          title="上一页"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </button>

        <div className="pagination-pages">
          {getVisiblePages().map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
              <button
                key={pageNum}
                className={`pagination-btn ${currentPage === pageNum ? 'active ' : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={goToNextPage}
          className="pagination-btn pagination-next"
          title="下一页"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={goToLastPage}
          className="pagination-btn pagination-last"
          title="尾页"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18V6h1v12zm3-6l6-6v12l-6-6zm8 6V6h1v12z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  maxVisiblePages: PropTypes.number
};

export default Pagination;
// import './index.css'; // 确保你有相应的CSS样式文件
// // 分页控件组件
// // src/components/Pagination.js
// import React from 'react';

// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   className = ""
// }) => {
//   // 生成页码按钮
//   const renderPageButtons = () => {
//     const buttons = [];
//     const maxVisibleButtons = 5;
//     let startPage, endPage;

//     if (totalPages <= maxVisibleButtons) {
//       // 总页数小于等于5，显示所有页码
//       startPage = 1;
//       endPage = totalPages;
//     } else {
//       // 计算页码范围
//       const halfVisible = Math.floor(maxVisibleButtons / 2);

//       if (currentPage <= halfVisible + 1) {
//         // 当前页在开头部分
//         startPage = 1;
//         endPage = maxVisibleButtons;
//       } else if (currentPage >= totalPages - halfVisible) {
//         // 当前页在结尾部分
//         startPage = totalPages - maxVisibleButtons + 1;
//         endPage = totalPages;
//       } else {
//         // 当前页在中间部分
//         startPage = currentPage - halfVisible;
//         endPage = currentPage + halfVisible;
//       }
//     }

//     // 添加页码按钮
//     for (let i = startPage; i <= endPage; i++) {
//       buttons.push(
//         <button
//           key={i}
//           onClick={() => onPageChange(i)}
//           className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentPage === i
//             ? 'bg-blue-600 text-white shadow-md'
//             : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
//             }`}
//         >
//           {i}
//         </button>
//       );
//     }

//     return buttons;
//   };

//   return (
//     <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
//       <div className="text-sm text-gray-600">
//         第 <span className="font-semibold">{currentPage}</span> 页 / 共 <span className="font-semibold">{totalPages}</span> 页
//       </div>

//       <div className="flex items-center space-x-2">
//         <button
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//           className={`px-4 py-2 rounded-lg flex items-center ${currentPage === 1
//             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//             : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-200'
//             }`}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//           </svg>
//           首页
//         </button>

//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className={`px-4 py-2 rounded-lg flex items-center ${currentPage === 1
//             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//             : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-200'
//             }`}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           上一页
//         </button>

//         <div className="flex space-x-1">
//           {renderPageButtons()}
//         </div>

//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className={`px-4 py-2 rounded-lg flex items-center ${currentPage === totalPages
//             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//             : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-200'
//             }`}
//         >
//           下一页
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </button>

//         <button
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           className={`px-4 py-2 rounded-lg flex items-center ${currentPage === totalPages
//             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//             : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-200'
//             }`}
//         >
//           尾页
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;  