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
 * 员工表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Getter
@Setter
@TableName("employees")
public class Employees implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 1为管理员，0为员工
     */
    @TableField("role")
    private Integer role;

    @TableField("username")
    private String username;

    @TableField("name")
    private String name;

    @TableField("password")
    private String password;

    @TableField("phone")
    private String phone;

    /**
     * 0为女，1为男
     */
    @TableField("gender")
    private Integer gender;

    @TableField("id_number")
    private String idNumber;

    /**
     * 1为启用，0为禁用
     */
    @TableField("status")
    private Integer status;

    @TableField("create_time")
    private Date createTime;

    @TableField("update_time")
    private Date updateTime;

    /**
     * 1为删除
     */
    @TableField("deleted")
    @TableLogic
    private Integer deleted;
}
