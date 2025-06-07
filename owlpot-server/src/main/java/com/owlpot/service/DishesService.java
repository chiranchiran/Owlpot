package com.owlpot.service;

import com.owlpot.dto.CategoryPageQueryDTO;
import com.owlpot.dto.DishPageQueryDTO;
import com.owlpot.entity.Categories;
import com.owlpot.entity.Dishes;
import com.baomidou.mybatisplus.extension.service.IService;
import com.owlpot.result.PageResult;

import java.util.List;

/**
 * <p>
 * 菜品表 服务类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
public interface DishesService extends IService<Dishes> {
    PageResult pageQuery(DishPageQueryDTO dishPageQueryDTO);
    void saveDish(Dishes dish);
    void removeById(Long id);
    void removeByIds(List<Long> ids);
}
