package com.owlpot.interceptor;

import com.owlpot.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
/**
 * jwt令牌校验的拦截器
 */
@Component
@Slf4j
public class CheckJwtInterceptor implements HandlerInterceptor {
    /**
     * 校验jwt
     */
    @Autowired
    private JwtUtils jwtUtils;
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断当前拦截到的是Controller的方法还是其他资源
        if (!(handler instanceof HandlerMethod)) {
            //当前拦截到的不是动态方法，直接放行
            return true;
        }
        //1、从请求头中获取令牌
        String token = request.getHeader("token");
        //2、校验令牌
        boolean flag = jwtUtils.checkToken(token);
        if (flag) {
            log.info("jwt校验通过");
            return true;
        }else{
            log.info("jwt校验失败");
            response.setStatus(401);
            return false;
        }
    }
}
