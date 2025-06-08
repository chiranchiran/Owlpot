package com.owlpot.dto;

import com.baomidou.mybatisplus.annotation.*;
import com.owlpot.entity.DishFlavors;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 菜品表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Data
public class DishAddDTO implements Serializable {
    private Long id;
    private String name;
    private Long categoryId;
    private BigDecimal price;
    private Integer status;
    private String image;
    private String description;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private List<DishFlavors> flavors;
    private Integer deleted;
}
