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
 * 套餐菜品关联表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Getter
@Setter
@TableName("setmeal_dish")
public class SetmealDish implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("setmeal_id")
    private Long setmealId;

    @TableField("dish_id")
    private Long dishId;

    @TableField("count")
    private Integer count;

    /**
     * 1为删除
     */
    @TableField("deleted")
    @TableLogic
    private Integer deleted;
}
