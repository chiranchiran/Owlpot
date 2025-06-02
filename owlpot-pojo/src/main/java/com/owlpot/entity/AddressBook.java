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
 * 地址簿
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Getter
@Setter
@TableName("address_book")
public class AddressBook implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private Long userId;

    @TableField("name")
    private String name;

    /**
     * 0为女，1为男
     */
    @TableField("gender")
    private String gender;

    @TableField("phone")
    private String phone;

    @TableField("province_code")
    private String provinceCode;

    @TableField("city_code")
    private String cityCode;

    @TableField("district_code")
    private String districtCode;

    @TableField("address")
    private String address;

    /**
     * 0公司，1家，2学校
     */
    @TableField("tag")
    private String tag;

    @TableField("create_time")
    private Date createTime;

    /**
     * 1代表默认地址
     */
    @TableField("is_default")
    private String isDefault;
}
