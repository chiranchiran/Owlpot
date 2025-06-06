package com.owlpot.service;

import com.owlpot.dto.CategoryPageQueryDTO;
import com.owlpot.entity.Categories;
import com.baomidou.mybatisplus.extension.service.IService;
import com.owlpot.result.PageResult;

/**
 * <p>
 * 分类表 服务类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
public interface CategoriesService extends IService<Categories> {

    PageResult pageQuery(CategoryPageQueryDTO categoryPageQueryDTO);
    void saveCate(Categories category);
    void removeById(Long id);
}
