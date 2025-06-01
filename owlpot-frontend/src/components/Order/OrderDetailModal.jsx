import React from 'react';

const OrderDetailModal = ({ order, onClose }) => {
  return (
    <div className="order-detail-modal">
      <div className="modal-header">
        <h3>订单信息</h3>
        <span className="close-button" onClick={onClose}>×</span>
      </div>
      <div className="modal-body">
        <div className="order-info">
          <div className="info-item">
            <label>订单号:</label>
            <span>{order.orderNumber}</span>
          </div>
          <div className="info-item">
            <label>下单时间:</label>
            <span>{order.orderTime}</span>
          </div>
          <div className="info-item">
            <label>用户名:</label>
            <span>{order.username}</span>
          </div>
          <div className="info-item">
            <label>手机号:</label>
            <span>{order.phone}</span>
          </div>
          <div className="info-item">
            <label>地址:</label>
            <span>{order.address}</span>
          </div>
          <div className="info-item">
            <label>备注:</label>
            <span className="remark">2sfdklfbnkhfkj</span>
          </div>
        </div>
        <div className="order-items">
          <label>菜品</label>
          <div className="item">
            <label>菜品小计</label>
            <span>¥15.00</span>
          </div>
        </div>
        <div className="order-costs">
          <label>费用</label>
          <div className="cost-item">
            <label>菜品小计:</label>
            <span>¥15</span>
          </div>
          <div className="cost-item">
            <label>派送费:</label>
            <span>¥6</span>
          </div>
          <div className="cost-item">
            <label>打包费:</label>
            <span>¥2</span>
          </div>
          <div className="cost-item">
            <label>合计:</label>
            <span className="total">¥23</span>
          </div>
          <div className="cost-item">
            <label>支付渠道:</label>
            <span>微信支付</span>
          </div>
          <div className="cost-item">
            <label>支付时间:</label>
            <span></span>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="return-button" onClick={onClose}>返回</button>
        {order.status === '待付款' && (
          <button className="cancel-order-button" onClick={() => { }}>取消订单</button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;