package com.owlpot.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class CategoryPageQueryDTO implements Serializable {

    private String name;
    private Integer type;
    private int currentPage;
    //每页显示记录数
    private int pageSize;

}
