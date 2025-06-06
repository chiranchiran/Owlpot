package com.owlpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.owlpot.constant.MessageConstant;
import com.owlpot.constant.StatusConstant;
import com.owlpot.dto.CategoryPageQueryDTO;
import com.owlpot.entity.Categories;
import com.owlpot.entity.Dishes;
import com.owlpot.entity.SetmealDish;
import com.owlpot.entity.Setmeals;
import com.owlpot.mapper.CategoriesMapper;
import com.owlpot.mapper.DishesMapper;
import com.owlpot.mapper.SetmealsMapper;
import com.owlpot.result.PageResult;
import com.owlpot.service.CategoriesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.owlpot.service.DishesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

/**
 * <p>
 * 分类表 服务实现类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Slf4j
@Service
public class CategoriesServiceImpl extends ServiceImpl<CategoriesMapper, Categories> implements CategoriesService {
    @Autowired
    private CategoriesMapper categoriesMapper;
    @Autowired
    private DishesMapper dishesMapper;
    @Autowired
    private SetmealsMapper setmealsMapper;

    @Override
    public PageResult pageQuery(CategoryPageQueryDTO cate) {
        Page<Categories> page = new Page<>(cate.getCurrentPage(), cate.getPageSize());  // 第1页，每页10条
        QueryWrapper<Categories> wrapper = new QueryWrapper<>();
        wrapper.like(null != cate.getName(), "name", cate.getName());
        wrapper.eq(null != cate.getType(), "type", cate.getType());
        wrapper.orderByAsc("order_number");
        wrapper.select("id", "order_number", "name", "type", "status", "update_time");
        Page<Categories> pages = categoriesMapper.selectPage(page, wrapper);
        List<Categories> records = pages.getRecords();  // 当前页数据
        long total = pages.getTotal();
        log.info("查询成功：{}", total);
        return new PageResult(total, records);
    }

    @Override
    public void saveCate(Categories category) {
        Categories cate = getByName(category.getName());
        if (cate != null) {
            throw new RuntimeException(MessageConstant.ALREADY_EXISTS);
        }
        //设置账号的状态，默认正常状态 1表示正常 0表示锁定
        category.setStatus(StatusConstant.ENABLE);
        categoriesMapper.insert(category);
    }

    public Categories getByName(String name) {
        QueryWrapper<Categories> wrapper = new QueryWrapper<>();
        wrapper.eq("name", name);
        return categoriesMapper.selectOne(wrapper);
    }

    @Override
    public void removeById(Long id) {
        int flag = checkCategory(id);
        if (flag==2) {
            throw new RuntimeException(MessageConstant.CATEGORY_BE_RELATED_BY_SETMEAL);
        }
        if (flag==1) {
            throw new RuntimeException(MessageConstant.CATEGORY_BE_RELATED_BY_DISH);
        }
        log.info("删除分类：{}", id);
        categoriesMapper.deleteById(id);
    }
    public int checkCategory(Long id) {
        QueryWrapper<Dishes> qd = new QueryWrapper<Dishes>()
                .eq("category_id", id);
        Dishes d = dishesMapper.selectOne(qd);
        if (d != null) {
            return 1;
        }
        QueryWrapper<Setmeals> qs = new QueryWrapper<Setmeals>()
                .eq("category_id", id);

        Setmeals s = setmealsMapper.selectOne(qs);
        if (s!= null) {
            return 2;
        }
        return 0;
    }
}
