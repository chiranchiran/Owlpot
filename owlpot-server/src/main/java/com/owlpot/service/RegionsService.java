package com.owlpot.service;

import com.owlpot.entity.Regions;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 地区表 服务类
 * </p>
 *
 * @author 池苒
 * @since 2025-06-02
 */
public interface RegionsService extends IService<Regions> {

    List<Regions> getProvinces();

    List<Regions> getCities(String code);

    List<Regions> getDistricts(String code);
}
