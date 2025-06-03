-- ----------------------------
-- Table: employees
-- ----------------------------
CREATE TABLE employees (
                           id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                           role ENUM('0','1') NOT NULL COMMENT '1为管理员，0为员工',
                           username VARCHAR(16) UNIQUE NOT NULL,
                           name VARCHAR(12) NOT NULL,
                           password VARCHAR(255) NOT NULL,
                           phone CHAR(11) NOT NULL,
                           gender ENUM('0','1') NOT NULL COMMENT '0为女，1为男',
                           id_number CHAR(18) UNIQUE,
                           status ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为启用，0为禁用',
                           create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           deleted ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为删除'
) COMMENT '员工表';

-- 索引
CREATE INDEX idx_emp ON employees (name(6), update_time, id, status, username, phone);
CREATE INDEX idx_emp_login ON employees (username, password);
CREATE INDEX idx_emp_changePwd ON employees (password);

-- ----------------------------
-- Table: orders
-- ----------------------------
CREATE TABLE orders (
                        id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                        number CHAR(13) NOT NULL UNIQUE,
                        user_id BIGINT UNSIGNED NOT NULL,
                        address_book_id BIGINT UNSIGNED NOT NULL,
                        status ENUM('0','1','2','3','4','5','6') NOT NULL COMMENT '1待付款，2待接单，3已接单，4派送中，5已完成，6已取消',
                        order_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        pay_status ENUM('0','1','2','3','4') NOT NULL COMMENT '0已支付，1未付款，2付款失败，3退款完成，4退款失败',
                        pay_time DATETIME,
                        pay_method BIGINT UNSIGNED DEFAULT 1 COMMENT '1为微信支付',
                        price DECIMAL(10,2) NOT NULL,
                        remark VARCHAR(100),
                        cancel_reason VARCHAR(20),
                        cancel_time DATETIME,
                        reject_reason VARCHAR(20),
                        expected_time DATETIME,
                        delivery_status ENUM('0','1') NOT NULL COMMENT '1为立即送出，0为选择具体时间',
                        delivery_time DATETIME,
                        packing_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                        delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                        tableware_status ENUM('0','1') NOT NULL DEFAULT '1' COMMENT '1按餐量提供，0选具体数量',
                        tableware_number INT UNSIGNED,
                        deleted ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为删除',

                        FOREIGN KEY (user_id) REFERENCES users(id),
                        FOREIGN KEY (address_book_id) REFERENCES address_book(id),
                        FOREIGN KEY (pay_method) REFERENCES pay_methods(id)
) COMMENT '订单表';

-- 索引
CREATE INDEX idx_order_status ON orders (status, order_time, id, number, pay_status, price);
CREATE INDEX idx_order_number ON orders (number, order_time, status, id, pay_status, price);
CREATE INDEX idx_order_time ON orders (order_time,status, id, pay_status, price, number);

-- ----------------------------
-- Table: orders_food
-- ----------------------------
CREATE TABLE orders_food (
                             id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                             order_id BIGINT UNSIGNED NOT NULL,
                             dish_id BIGINT UNSIGNED,
                             setmeal_id BIGINT UNSIGNED,
                             count INT UNSIGNED NOT NULL,
                             flavors VARCHAR(50) NOT NULL,
                             deleted ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为删除',

                             FOREIGN KEY (order_id) REFERENCES orders(id),
                             FOREIGN KEY (dish_id) REFERENCES dishes(id),
                             FOREIGN KEY (setmeal_id) REFERENCES setmeals(id),
                             CONSTRAINT chk_single CHECK (dish_id IS NOT NULL OR setmeal_id IS NOT NULL)
) COMMENT '订单菜品关联表';

-- 索引
CREATE INDEX idx_orders_food ON orders_food (id, order_id, dish_id, setmeal_id, count, flavors(10));

-- ----------------------------
-- Table: dishes
-- ----------------------------
CREATE TABLE dishes (
                        id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(20) NOT NULL UNIQUE,
                        category_id BIGINT UNSIGNED NOT NULL,
                        price DECIMAL(10,2) NOT NULL,
                        image VARCHAR(255) NOT NULL,
                        description VARCHAR(200),
                        status ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为启用，0为禁用',
                        create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        deleted ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为删除',

                        FOREIGN KEY (category_id) REFERENCES categories(id)
) COMMENT '菜品表';

-- 索引
CREATE INDEX idx_dish_category ON dishes (category_id, update_time, status, name(8), id, price,image(8));
CREATE INDEX idx_dish_status ON dishes (status, update_time, category_id, name(8), id, price,image(8));
CREATE INDEX idx_dish_name ON dishes (name(8), update_time, category_id, status, id, price,image(8));

-- ----------------------------
-- Table: dish_flavors
-- ----------------------------
CREATE TABLE dish_flavors (
                              id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                              dish_id BIGINT UNSIGNED NOT NULL,
                              name VARCHAR(3) NOT NULL,
                              value VARCHAR(5) NOT NULL,
                              deleted ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为删除',

                              FOREIGN KEY (dish_id) REFERENCES dishes(id)
) COMMENT '菜品口味表';

-- ----------------------------
-- Table: categories
-- ----------------------------
CREATE TABLE categories (
                            id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                            order_number INT UNSIGNED NOT NULL,
                            name VARCHAR(20) NOT NULL UNIQUE,
                            type ENUM('0','1') NOT NULL COMMENT '0是菜品，1是套餐',
                            status ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为启用，0为禁用',
                            create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            deleted ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为删除'
) COMMENT '分类表';

-- 索引
CREATE INDEX idx_cat_type ON categories (type, order_number, update_time, id, name, status);
CREATE INDEX idx_cat_name ON categories (name(6), order_number, update_time, type, status, id);

-- ----------------------------
-- Table: setmeals
-- ----------------------------
CREATE TABLE setmeals (
                          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                          name VARCHAR(20) NOT NULL UNIQUE,
                          category_id BIGINT UNSIGNED NOT NULL,
                          price DECIMAL(10,2) NOT NULL,
                          image VARCHAR(255) NOT NULL,
                          description VARCHAR(200),
                          status ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '0停售，1启售',
                          create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          deleted ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为删除',

                          FOREIGN KEY (category_id) REFERENCES categories(id)
) COMMENT '套餐表';

-- 索引
CREATE INDEX idx_set_name ON setmeals (name, id, category_id, price, status,image(8));
CREATE INDEX idx_set_category ON setmeals (category_id, name, id, price, status,image(8));
CREATE INDEX idx_set_status ON setmeals (status, name, id, category_id, price,image(8));

-- ----------------------------
-- Table: setmeal_dish
-- ----------------------------
CREATE TABLE setmeal_dish (
                              id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                              setmeal_id BIGINT UNSIGNED NOT NULL,
                              dish_id BIGINT UNSIGNED NOT NULL,
                              count TINYINT UNSIGNED NOT NULL DEFAULT 1,
                              deleted ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1为删除',

                              FOREIGN KEY (setmeal_id) REFERENCES setmeals(id),
                              FOREIGN KEY (dish_id) REFERENCES dishes(id)
) COMMENT '套餐菜品关联表';

-- ----------------------------
-- Table: users
-- ----------------------------
CREATE TABLE users (
                       id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                       openid VARCHAR(45) UNIQUE COMMENT '微信用户唯一标志',
                       name VARCHAR(32) NOT NULL,
                       gender ENUM('0','1') NOT NULL COMMENT '0为女，1为男',
                       phone CHAR(11) NOT NULL,
                       id_number CHAR(18) UNIQUE NOT NULL,
                       avatar VARCHAR(500) NOT NULL COMMENT '微信头像路径',
                       create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT '用户表';

-- 索引
CREATE INDEX idx_users_openid ON users (openid, id, name, gender, phone(8),avatar(8));

-- ----------------------------
-- Table: address_book
-- ----------------------------
CREATE TABLE address_book (
                              id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                              user_id BIGINT UNSIGNED NOT NULL,
                              name VARCHAR(12) NOT NULL,
                              gender ENUM('0','1') NOT NULL COMMENT '0为女，1为男',
                              phone CHAR(11) NOT NULL,
                              province_code CHAR(6) NOT NULL,
                              city_code CHAR(6) NOT NULL,
                              district_code CHAR(6) NOT NULL,
                              address VARCHAR(50) NOT NULL,
                              tag ENUM('0','1','2') NOT NULL DEFAULT '0' COMMENT '0公司，1家，2学校',
                              create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              is_default ENUM('0','1') NOT NULL DEFAULT '0' COMMENT '1代表默认地址',

                              FOREIGN KEY (user_id) REFERENCES users(id),
                              FOREIGN KEY (province_code) REFERENCES regions(code),
                              FOREIGN KEY (city_code) REFERENCES regions(code),
                              FOREIGN KEY (district_code) REFERENCES regions(code)
) COMMENT '地址簿';

-- 索引
CREATE INDEX idx_addr_user ON address_book (user_id, is_default, create_time, id, name, gender, phone(6));

-- ----------------------------
-- Table: shopping_cart
-- ----------------------------
CREATE TABLE shopping_cart (
                               id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                               user_id BIGINT UNSIGNED NOT NULL,
                               dish_id BIGINT UNSIGNED,
                               setmeal_id BIGINT UNSIGNED,
                               count INT UNSIGNED NOT NULL,
                               update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               flavors VARCHAR(50) NOT NULL,

                               FOREIGN KEY (user_id) REFERENCES users(id),
                               FOREIGN KEY (dish_id) REFERENCES dishes(id),
                               FOREIGN KEY (setmeal_id) REFERENCES setmeals(id),
                               CONSTRAINT chk_cart CHECK (dish_id IS NOT NULL OR setmeal_id IS NOT NULL)
) COMMENT '购物车';

-- 索引
CREATE INDEX idx_cart_user ON shopping_cart (user_id, update_time, id, dish_id, setmeal_id, count);

-- ----------------------------
-- Table: regions
-- ----------------------------
CREATE TABLE regions (
                         id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                         code CHAR(6) NOT NULL UNIQUE,
                         name VARCHAR(20) NOT NULL UNIQUE,
                         parent_code CHAR(6) NOT NULL DEFAULT '0',
                         level ENUM('1','2','3') NOT NULL COMMENT '1省2市3区'
) COMMENT '地区表';

-- ----------------------------
-- Table: pay_methods
-- ----------------------------
CREATE TABLE pay_methods (
                             id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                             name VARCHAR(10) NOT NULL UNIQUE,
                             icon_url VARCHAR(200) NOT NULL UNIQUE,
                             is_active ENUM('0','1') NOT NULL COMMENT '1为启用'
) COMMENT '支付方式表';


-- 1. 支付方式表 (pay_methods)
-- ----------------------------
INSERT INTO pay_methods (name, icon_url, is_active) VALUES
                                                        ('微信支付', 'https://pay.weixin.com/icon', '1'),
                                                        ('支付宝', 'https://alipay.com/icon', '1'),
                                                        ('云闪付', 'https://unionpay.com/icon', '1'),
                                                        ('Apple Pay', 'https://apple.com/pay/icon', '1'),
                                                        ('银行卡', 'https://bank.com/icon', '0');
-- ----------------------------
-- 3. 用户表 (users)
-- ----------------------------
INSERT INTO users (openid, name, gender, phone, id_number, avatar) VALUES
                                                                       ('wx1234567890abcdef', '张三', '1', '13800138000', '110101199001011234', 'https://avatar.com/zhangsan'),
                                                                       ('wx234567890abcdef1', '李四', '0', '13900139000', '310101199002022345', 'https://avatar.com/lisi'),
                                                                       ('wx34567890abcdef12', '王五', '1', '13700137000', '440301199003033456', 'https://avatar.com/wangwu'),
                                                                       ('wx4567890abcdef123', '赵六', '0', '13600136000', '510104199004044567', 'https://avatar.com/zhaoliu'),
                                                                       ('wx567890abcdef1234', '钱七', '1', '13500135000', '330102199005055678', 'https://avatar.com/qianqi');

-- ----------------------------
-- 4. 员工表 (employees)
-- ----------------------------
INSERT INTO employees (role, username, name, password, phone, gender, id_number, status) VALUES
                                                                                             ('1', 'admin', '系统管理员', '$2a$10$ABC123', '15000150001', '1', '110101198001011111', '1'),
                                                                                             ('0', 'emp001', '服务员张三', '$2a$10$DEF456', '15000150002', '1', '110101198002022222', '1'),
                                                                                             ('0', 'emp002', '服务员李四', '$2a$10$GHI789', '15000150003', '0', '110101198003033333', '1'),
                                                                                             ('0', 'emp003', '厨师王五', '$2a$10$JKL012', '15000150004', '1', '110101198004044444', '0'),
                                                                                             ('0', 'emp004', '配送员赵六', '$2a$10$MNO345', '15000150005', '1', '110101198005055555', '1');

-- ----------------------------
-- 5. 分类表 (categories)
-- ----------------------------
INSERT INTO categories (order_number, name, type, status) VALUES
                                                              (1, '热销菜品', '0', '1'),
                                                              (2, '主食', '0', '1'),
                                                              (3, '饮品', '0', '1'),
                                                              (4, '商务套餐', '1', '1'),
                                                              (5, '家庭套餐', '1', '0');

-- ----------------------------
-- 6. 菜品表 (dishes)
-- ----------------------------
INSERT INTO dishes (name, category_id, price, image, description, status) VALUES
                                                                              ('宫保鸡丁', 1, 38.00, 'https://food.com/dish1.jpg', '经典川菜', '1'),
                                                                              ('鱼香肉丝', 1, 36.00, 'https://food.com/dish2.jpg', '微辣口味', '1'),
                                                                              ('扬州炒饭', 2, 28.00, 'https://food.com/dish3.jpg', '粒粒分明', '1'),
                                                                              ('酸梅汤', 3, 12.00, 'https://food.com/dish4.jpg', '冰镇饮品', '1'),
                                                                              ('清炒时蔬', 1, 22.00, 'https://food.com/dish5.jpg', '时令蔬菜', '0');

-- ----------------------------
-- 7. 菜品口味表 (dish_flavors)
-- ----------------------------
INSERT INTO dish_flavors (dish_id, name, value) VALUES
                                                    (1, '辣度', '微辣'),
                                                    (2, '甜度', '少糖'),
                                                    (3, '辣度', '中辣'),
                                                    (4, '咸度', '正常'),
                                                    (5, '冰度', '正常冰');

-- ----------------------------
-- 8. 套餐表 (setmeals)
-- ----------------------------
INSERT INTO setmeals (name, category_id, price, image, description, status) VALUES
                                                                                ('商务套餐A', 4, 68.00, 'https://food.com/set1.jpg', '一荤一素一汤', '1'),
                                                                                ('商务套餐B', 1, 88.00, 'https://food.com/set2.jpg', '两荤一素一汤', '1'),
                                                                                ('家庭套餐4人', 5, 168.00, 'https://food.com/set3.jpg', '四荤三素一汤', '0'),
                                                                                ('儿童套餐', 2, 38.00, 'https://food.com/set4.jpg', '卡通造型', '1'),
                                                                                ('轻食套餐', 4, 58.00, 'https://food.com/set5.jpg', '低卡路里', '1');

-- ----------------------------
-- 9. 套餐菜品关联表 (setmeal_dish)
-- ----------------------------
INSERT INTO setmeal_dish (setmeal_id, dish_id, count) VALUES
                                                          (1, 1, 1),
                                                          (1, 5, 1),
                                                          (2, 1, 1),
                                                          (2, 2, 1),
                                                          (2, 5, 1);

-- ----------------------------
-- 10. 地址簿表 (address_book)
-- ----------------------------
INSERT INTO address_book (user_id, name, gender, phone, province_code, city_code, district_code, address, tag, is_default) VALUES
                                                                                                                               (1, '张三', '1', '13800138000', '110000', '110100', '110101', '东长安街1号', '0', '1'),
                                                                                                                               (1, '张三公司', '1', '13800138000', '110000', '110100', '110102', '建国门大厦801', '0', '0'),
                                                                                                                               (2, '李四', '0', '13900139000', '110000', '110100', '110102', '黄浦区南京东路100号', '1', '1'),
                                                                                                                               (3, '王五', '1', '13700137000', '130000', '130100', '110102', '长安区科技园南区', '2', '1'),
                                                                                                                               (4, '赵六', '0', '13600136000', '130000', '130100', '110102', '桥西区春熙路88号', '0', '1');

-- ----------------------------
-- 11. 购物车表 (shopping_cart)
-- ----------------------------
INSERT INTO shopping_cart (user_id, dish_id, setmeal_id, count, flavors) VALUES
                                                                             (1, 1, NULL, 2, '辣度:微辣'),
                                                                             (2, 3, NULL, 1, '咸度:少盐'),
                                                                             (3, NULL, 2, 1, ''),
                                                                             (4, 4, NULL, 3, '冰度:少冰');

-- ----------------------------
-- 12. 订单表 (orders)
-- ----------------------------
INSERT INTO orders (
    number, user_id, address_book_id, status, pay_status,
    price, remark, delivery_status, packing_fee, delivery_fee
) VALUES
      ('ORDER20230601', 1, 1, '5', '0', 98.00, '不要香菜', '1', 2.00, 5.00),
      ('ORDER20230603',1 , 2, '3', '0', 68.00, '尽快送达', '0', 1.00, 6.00),
      ('ORDER20230604', 1, 2, '1', '1', 128.00, '发票抬头：公司', '1', 2.00, 8.00),
      ('ORDER20230605', 1, 1, '4', '0', 58.00, '放门口', '1', 0.00, 4.00),
      ('ORDER20230606', 1, 2, '2', '3', 88.00, '已取消', '0', 1.50, 5.50);

-- 更新订单时间（模拟不同时间）
UPDATE orders SET order_time = '2023-06-01 12:30:00' WHERE id = 1;
UPDATE orders SET order_time = '2023-06-01 18:45:00' WHERE id = 2;
UPDATE orders SET order_time = '2023-06-02 11:20:00' WHERE id = 3;
UPDATE orders SET order_time = '2023-06-02 13:15:00' WHERE id = 4;
UPDATE orders SET order_time = '2023-06-03 09:10:00' WHERE id = 5;

-- ----------------------------
-- 13. 订单菜品关联表 (orders_food)
-- ----------------------------
INSERT INTO orders_food (order_id, dish_id, setmeal_id, count, flavors) VALUES
                                                                            (1, 3, NULL, 2, '辣度:中辣'),
                                                                            (2, NULL, 1, 1, ''),
                                                                            (3, NULL, 2, 1, ''),
                                                                            (4, 5, NULL, 1, '少油'),
                                                                            (5, 2, NULL, 2, '辣度:微辣');

-- 插入省级数据
INSERT INTO regions (code, name, parent_code, level) VALUES
                                                         ('110000', '北京市', '0', '1'),
                                                         ('120000', '天津市', '0', '1'),
                                                         ('130000', '河北省', '0', '1'),
                                                         ('140000', '山西省', '0', '1'),
                                                         ('150000', '内蒙古自治区', '0', '1'),
                                                         ('210000', '辽宁省', '0', '1'),
                                                         ('220000', '吉林省', '0', '1'),
                                                         ('230000', '黑龙江省', '0', '1'),
                                                         ('310000', '上海市', '0', '1'),
                                                         ('320000', '江苏省', '0', '1'),
                                                         ('330000', '浙江省', '0', '1'),
                                                         ('340000', '安徽省', '0', '1'),
                                                         ('350000', '福建省', '0', '1'),
                                                         ('360000', '江西省', '0', '1'),
                                                         ('370000', '山东省', '0', '1'),
                                                         ('410000', '河南省', '0', '1'),
                                                         ('420000', '湖北省', '0', '1'),
                                                         ('430000', '湖南省', '0', '1'),
                                                         ('440000', '广东省', '0', '1'),
                                                         ('450000', '广西壮族自治区', '0', '1'),
                                                         ('460000', '海南省', '0', '1'),
                                                         ('500000', '重庆市', '0', '1'),
                                                         ('510000', '四川省', '0', '1'),
                                                         ('520000', '贵州省', '0', '1'),
                                                         ('530000', '云南省', '0', '1'),
                                                         ('540000', '西藏自治区', '0', '1'),
                                                         ('610000', '陕西省', '0', '1'),
                                                         ('620000', '甘肃省', '0', '1'),
                                                         ('630000', '青海省', '0', '1'),
                                                         ('640000', '宁夏回族自治区', '0', '1'),
                                                         ('650000', '新疆维吾尔自治区', '0', '1'),
                                                         ('710000', '台湾省', '0', '1'),
                                                         ('810000', '香港特别行政区', '0', '1'),
                                                         ('820000', '澳门特别行政区', '0', '1');

-- 由于篇幅限制，这里仅展示部分地市级和县级数据示例
-- 完整数据需要包含全国333个地级市和2844个县级单位

-- 北京市下辖的地市级单位（实际上北京市直接管辖县级单位）
INSERT INTO regions (code, name, parent_code, level) VALUES
                                                         ('110100', '市辖区', '110000', '2'),
                                                         ('110200', '县', '110000', '2');

-- 北京市辖区下辖的县级单位示例
INSERT INTO regions (code, name, parent_code, level) VALUES
                                                         ('110101', '东城区', '110100', '3'),
                                                         ('110102', '西城区', '110100', '3'),
                                                         ('110105', '朝阳区', '110100', '3'),
                                                         ('110106', '丰台区', '110100', '3'),
                                                         ('110107', '石景山区', '110100', '3'),
                                                         ('110108', '海淀区', '110100', '3'),
                                                         ('110109', '门头沟区', '110100', '3'),
                                                         ('110111', '房山区', '110100', '3'),
                                                         ('110112', '通州区', '110100', '3'),
                                                         ('110113', '顺义区', '110100', '3'),
                                                         ('110114', '昌平区', '110100', '3'),
                                                         ('110115', '大兴区', '110100', '3'),
                                                         ('110116', '怀柔区', '110100', '3'),
                                                         ('110117', '平谷区', '110100', '3'),
                                                         ('110118', '密云区', '110100', '3'),
                                                         ('110119', '延庆区', '110100', '3');

-- 河北省示例（包含部分地级市和区县）
INSERT INTO regions (code, name, parent_code, level) VALUES
                                                         ('130100', '石家庄市', '130000', '2'),
                                                         ('130200', '唐山市', '130000', '2'),
                                                         ('130300', '秦皇岛市', '130000', '2');

-- 石家庄市下辖的区县示例
INSERT INTO regions (code, name, parent_code, level) VALUES
                                                         ('130102', '长安区', '130100', '3'),
                                                         ('130104', '桥西区', '130100', '3'),
                                                         ('130105', '新华区', '130100', '3'),
                                                         ('130107', '井陉矿区', '130100', '3'),
                                                         ('130108', '裕华区', '130100', '3'),
                                                         ('130109', '藁城区', '130100', '3'),
                                                         ('130110', '鹿泉区', '130100', '3'),
                                                         ('130111', '栾城区', '130100', '3');

-- 提交事务
COMMIT;