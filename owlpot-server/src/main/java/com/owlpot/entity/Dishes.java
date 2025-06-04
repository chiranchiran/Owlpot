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
 * 菜品表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-04
 */
@Getter
@Setter
@TableName("dishes")
public class Dishes implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("name")
    private String name;

    @TableField("category_id")
    private Long categoryId;

    @TableField("price")
    private BigDecimal price;

    @TableField("image")
    private String image;

    @TableField("description")
    private String description;

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
