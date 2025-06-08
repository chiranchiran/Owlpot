package com.owlpot.vo;

import com.owlpot.entity.DishFlavors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 菜品表
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishAddVO implements Serializable {
    private Long id;
    private String name;
    private Long categoryId;
    private BigDecimal price;
    private String image;
    private String description;
    private LocalDateTime updateTime;
    private List<DishFlavors> flavors;
}
