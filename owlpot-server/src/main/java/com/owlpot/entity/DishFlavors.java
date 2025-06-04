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
 * 菜品口味表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-04
 */
@Getter
@Setter
@TableName("dish_flavors")
public class DishFlavors implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("dish_id")
    private Long dishId;

    @TableField("name")
    private String name;

    @TableField("value")
    private String value;

    /**
     * 1为删除
     */
    @TableField("deleted")
    @TableLogic
    private String deleted;
}
