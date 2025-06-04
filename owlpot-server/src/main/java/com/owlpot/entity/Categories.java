package com.owlpot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 分类表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-04
 */
@Getter
@Setter
@TableName("categories")
public class Categories implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("order_number")
    private Integer orderNumber;

    @TableField("name")
    private String name;

    /**
     * 0是菜品，1是套餐
     */
    @TableField("type")
    private String type;

    /**
     * 1为启用，0为禁用
     */
    @TableField("status")
    private String status;

    @TableField("create_time")
    private Date createTime;

    @TableField("update_time")
    private Date updateTime;

    /**
     * 1为删除
     */
    @TableField("deleted")
    @TableLogic
    private String deleted;
}
