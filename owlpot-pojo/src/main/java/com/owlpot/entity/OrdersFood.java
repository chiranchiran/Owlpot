package com.owlpot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 订单菜品关联表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Getter
@Setter
@TableName("orders_food")
public class OrdersFood implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("order_id")
    private Long orderId;

    @TableField("dish_id")
    private Long dishId;

    @TableField("setmeal_id")
    private Long setmealId;

    @TableField("count")
    private Integer count;

    @TableField("flavors")
    private String flavors;

    /**
     * 1为删除
     */
    @TableField("deleted")
    @TableLogic
    private Integer deleted;
}
