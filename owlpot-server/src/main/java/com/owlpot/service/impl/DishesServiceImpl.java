package com.owlpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.owlpot.constant.MessageConstant;
import com.owlpot.constant.StatusConstant;
import com.owlpot.dto.DishPageQueryDTO;
import com.owlpot.entity.Dishes;
import com.owlpot.entity.Dishes;
import com.owlpot.entity.SetmealDish;
import com.owlpot.entity.Setmeals;
import com.owlpot.mapper.DishesMapper;
import com.owlpot.mapper.DishesMapper;
import com.owlpot.mapper.SetmealDishMapper;
import com.owlpot.mapper.SetmealsMapper;
import com.owlpot.result.PageResult;
import com.owlpot.service.DishesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.owlpot.service.SetmealsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 菜品表 服务实现类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Slf4j
@Service
public class DishesServiceImpl extends ServiceImpl<DishesMapper, Dishes> implements DishesService {
    @Autowired
    private DishesMapper dishesMapper;
    @Autowired
    private SetmealDishMapper setmealDishMapper;

    @Override
    public PageResult pageQuery(DishPageQueryDTO cate) {
        Page<Dishes> page = new Page<>(cate.getCurrentPage(), cate.getPageSize());  // 第1页，每页10条
        QueryWrapper<Dishes> wrapper = new QueryWrapper<>();
        wrapper.like(null != cate.getName(), "name", cate.getName())
                .eq(null != cate.getType(), "type", cate.getType())
                .eq(null!= cate.getStatus(), "status", cate.getStatus())
                .orderByDesc("create_time");
        Page<Dishes> pages = dishesMapper.selectPage(page, wrapper);
        List<Dishes> records = pages.getRecords();  // 当前页数据
        long total = pages.getTotal();
        log.info("查询成功：{}", total);
        return new PageResult(total, records);
    }

    @Override
    public void saveDish(Dishes dish) {
        Dishes cate = getByName(dish.getName());
        if (cate != null) {
            throw new RuntimeException(MessageConstant.ALREADY_EXISTS);
        }
        //设置账号的状态，默认正常状态 1表示正常 0表示锁定
        dish.setStatus(StatusConstant.DISABLE);
        dishesMapper.insert(dish);
    }

    public Dishes getByName(String name) {
        QueryWrapper<Dishes> wrapper = new QueryWrapper<>();
        wrapper.eq("name", name);
        return dishesMapper.selectOne(wrapper);
    }

    @Override
    public void removeById(Long id) {
        boolean flag = checkDish(id);
        if (flag) {
            throw new RuntimeException(MessageConstant.DISH_BE_RELATED_BY_SETMEAL);
        }
        log.info("删除菜品：{}", id);
        dishesMapper.deleteById(id);
    }

    @Override
    public void removeByIds(List<Long> ids) {
        for (Long id : ids) {
            boolean flag = checkDish(id);
            if (flag) {
                throw new RuntimeException(MessageConstant.DISH_BE_RELATED_BY_SETMEAL);
            }
        }
        log.info("删除菜品：{}", ids);
        dishesMapper.deleteBatchIds(ids);
    }

    public boolean checkDish(Long id) {
        QueryWrapper<SetmealDish> qd = new QueryWrapper<SetmealDish>()
                .eq("dish_id", id);
        SetmealDish s = setmealDishMapper.selectOne(qd);
        if (s!= null) {
            return true;
        }
        return false;
    }
}
