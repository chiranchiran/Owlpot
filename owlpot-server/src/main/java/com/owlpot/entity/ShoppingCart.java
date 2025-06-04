package com.owlpot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 购物车
 * </p>
 *
 * @author 池苒
 * @since 2025-06-04
 */
@Getter
@Setter
@TableName("shopping_cart")
public class ShoppingCart implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("dish_id")
    private Long dishId;

    @TableField("setmeal_id")
    private Long setmealId;

    @TableField("count")
    private Integer count;

    @TableField("update_time")
    private Date updateTime;

    @TableField("flavors")
    private String flavors;
}
