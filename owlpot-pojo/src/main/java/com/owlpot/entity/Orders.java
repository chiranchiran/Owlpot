package com.owlpot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 订单表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Getter
@Setter
@TableName("orders")
public class Orders implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("number")
    private String number;

    @TableField("user_id")
    private Long userId;

    @TableField("address_book_id")
    private Long addressBookId;

    /**
     * 1待付款，2待接单，3已接单，4派送中，5已完成，6已取消
     */
    @TableField("status")
    private String status;

    @TableField("order_time")
    private Date orderTime;

    /**
     * 0已支付，1未付款，2付款失败，3退款完成，4退款失败
     */
    @TableField("pay_status")
    private String payStatus;

    @TableField("pay_time")
    private Date payTime;

    /**
     * 1为微信支付
     */
    @TableField("pay_method")
    private Long payMethod;

    @TableField("price")
    private BigDecimal price;

    @TableField("remark")
    private String remark;

    @TableField("cancel_reason")
    private String cancelReason;

    @TableField("cancel_time")
    private Date cancelTime;

    @TableField("reject_reason")
    private String rejectReason;

    @TableField("expected_time")
    private Date expectedTime;

    /**
     * 1为立即送出，0为选择具体时间
     */
    @TableField("delivery_status")
    private String deliveryStatus;

    @TableField("delivery_time")
    private Date deliveryTime;

    @TableField("packing_fee")
    private BigDecimal packingFee;

    @TableField("delivery_fee")
    private BigDecimal deliveryFee;

    /**
     * 1按餐量提供，0选具体数量
     */
    @TableField("tableware_status")
    private String tablewareStatus;

    @TableField("tableware_number")
    private Integer tablewareNumber;

    /**
     * 1为删除
     */
    @TableField("deleted")
    @TableLogic
    private String deleted;
}
