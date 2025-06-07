package com.owlpot.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class DishPageQueryDTO implements Serializable {

    private String name;
    private Integer type;
    private Integer status;
    private int currentPage;
    //每页显示记录数
    private int pageSize;

}
