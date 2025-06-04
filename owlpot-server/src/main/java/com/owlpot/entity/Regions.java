package com.owlpot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 地区表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-04
 */
@Getter
@Setter
@TableName("regions")
public class Regions implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("code")
    private String code;

    @TableField("name")
    private String name;

    @TableField("parent_code")
    private String parentCode;

    /**
     * 1省2市3区
     */
    @TableField("level")
    private String level;
}
