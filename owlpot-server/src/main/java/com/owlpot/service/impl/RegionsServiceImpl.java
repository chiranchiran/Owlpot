package com.owlpot.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.owlpot.entity.Regions;
import com.owlpot.mapper.RegionsMapper;
import com.owlpot.service.RegionsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 地区表 服务实现类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
@Service
public class RegionsServiceImpl extends ServiceImpl<RegionsMapper, Regions> implements RegionsService {
@Autowired
private RegionsMapper regionsMapper;
    @Override
    public List<Regions> getProvinces() {
        QueryWrapper<Regions> q = new QueryWrapper<Regions>()
                .select("code", "name","id")
                .eq("level", 1);
        List<Regions> regions = regionsMapper.selectList(q);
        return regions;
    }

    @Override
    public List<Regions> getCities(String code) {
        QueryWrapper<Regions> q = new QueryWrapper<Regions>()
                .select("code", "name","id")
                .eq("parent_code", code)
                .eq("level", 2)
                .orderByAsc("code");

        List<Regions> regions = regionsMapper.selectList(q);
        return regions;
    }

    @Override
    public List<Regions> getDistricts(String code) {
        QueryWrapper<Regions> q = new QueryWrapper<Regions>()
                .select("code", "name","id")
                .eq("parent_code", code)
                .eq("level", 3)
                .orderByAsc("code");;
        List<Regions> regions = regionsMapper.selectList(q);
        return regions;
    }
}
