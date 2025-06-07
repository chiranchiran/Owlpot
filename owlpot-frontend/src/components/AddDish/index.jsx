import React, { useState, useEffect } from 'react';
import { getCategories } from '../../api';
import { useSelect } from '../../hooks/useSelect';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddDish, useUpdateDish, useDish } from '../../hooks/useDish';
import ConfirmationModal from '../common/ConfirmationModal';
import { useNotification } from '../common/NotificationContext';
import { useUploadImage } from '../../hooks/useUpImage';

const AddDish = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // 用于存储图片文件对象
  const [imageUrl, setImageUrl] = useState(null); // 用于存储后端返回的图片 URL
  const [description, setDescription] = useState('');
  const mutation = useUploadImage()
  const tasty = ['辣度', '温度', '忌口', '甜度'];
  // 简化口味配置逻辑
  const [flavorConfigs, setFlavorConfigs] = useState([]);

  // 获取分类数据
  const categoriesQuery = useSelect("categories", getCategories);
  const categories = categoriesQuery.data?.records || [];
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { id } = useParams();
  const [andUp, setAndUp] = useState(false);
  const isEditMode = !!id;

  // 是否显示取消确认对话框
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpConfirm, setShowUpConfirm] = useState(false);
  // 表单原始数据（用于编辑模式下的重置）
  const [originalData, setOriginalData] = useState(null);

  // 查询单个菜品（编辑模式）
  const { data: dishData } = useDish(id);

  // 添加菜品 Mutation
  const addMutation = useAddDish();
  // 更新菜品 Mutation
  const updateMutation = useUpdateDish();

  // 当获取到菜品数据时填充表单
  useEffect(() => {
    if (isEditMode && dishData) {
      setName(dishData.name);
      setCategory(dishData.category);
      setPrice(dishData.price);
      setFlavorConfigs(dishData.flavors);
      setImageUrl(dishData.image); // 假设后端返回的是图片 URL，直接设置到 imageUrl 中
      setDescription(dishData.description);
      setOriginalData(dishData); // 保存原始数据用于重置
    } else {
      // 重置表单
      setName('');
      setCategory('');
      setPrice('');
      setFlavorConfigs([]);
      setImage(null);
      setImageUrl(null);
      setDescription('');
    }
  }, [dishData, isEditMode]);

  // 处理添加口味配置
  const handleAddFlavorConfig = () => {
    setFlavorConfigs([
      ...flavorConfigs,
      { type: '', values: [] }
    ]);
  };

  // 更新口味类型
  const handleFlavorTypeChange = (e, index) => {
    const updatedConfigs = [...flavorConfigs];
    updatedConfigs[index].type = e.target.value;
    setFlavorConfigs(updatedConfigs);
  };

  // 添加口味值
  const handleAddFlavorValue = (index, value) => {
    if (!value) return;

    const updatedConfigs = [...flavorConfigs];
    if (!updatedConfigs[index].values.includes(value)) {
      updatedConfigs[index].values = [...updatedConfigs[index].values, value];
      setFlavorConfigs(updatedConfigs);
    }
  };

  // 删除口味值
  const handleRemoveFlavorValue = (groupIndex, valueIndex) => {
    const updatedConfigs = [...flavorConfigs];
    updatedConfigs[groupIndex].values.splice(valueIndex, 1);
    setFlavorConfigs(updatedConfigs);
  };

  // 删除整个口味配置组
  const handleRemoveFlavorConfig = (index) => {
    const updatedConfigs = flavorConfigs.filter((_, i) => i !== index);
    setFlavorConfigs(updatedConfigs);
  };

  // 处理图片上传
  const handleImageUpload = (e) => {
    debugger
    const file = e.target.files[0];
    if (!file) return;
    const errors = checkImg(file);
    if (errors) {
      showNotification(Object.values(errors)[0], "error");
      return;
    }
    setImage(file);
    // 显示图片预览
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const checkImg = (file) => {
    const newErrors = {};
    // 验证文件大小
    if (file.size > 2 * 1024 * 1024) {
      newErrors.name = '图片过大，上传失败！';
    }
    // 验证文件类型
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      newErrors.name = '格式错误，上传失败';
    }
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = '菜品名称不能为空';
    if (!category) newErrors.category = '请选择菜品分类';
    if (!price) newErrors.price = '菜品价格不能为空';
    if (!image) newErrors.image = '请上传菜品图片';

    if (name && ! /^[\u4e00-\u9fa5a-zA-Z0-9]{2,20}$/.test(name))
      newErrors.name = '菜品名称输入不符';

    if (price && (! /^\d{1,8}(\.\d{1,2})?$/.test(price) || parseFloat(price) <= 0))
      newErrors.price = '菜品价格格式有误';

    if (description && ! /^[\u4e00-\u9fa5a-zA-Z0-9]{0,200}$/.test(description))
      newErrors.description = '菜品描述过长（最多200字）';

    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  // 处理表单提交
  const handleSave = (e, saveAndContinue = false) => {
    e.preventDefault();
    setShowUpConfirm(true);
    setAndUp(saveAndContinue);
  };

  const confirmSave = () => {
    setShowUpConfirm(false);
    const errors = validateForm();
    if (errors) {
      showNotification(Object.values(errors)[0], "error");
      return;
    }

    let formData = { name, category, price, description, flavors: flavorConfigs };
    if (image) {
      const formDataForImage = new FormData();
      formDataForImage.append('image', image);
      // 假设这里是上传图片的 API 接口，返回图片 URL
      mutation.mutate(formDataForImage, {
        onSuccess: (data) => {
          formData.image = data.data;
          if (isEditMode) {
            // 更新菜品
            updateMutation.mutate({ id, ...formData });
          } else {
            // 添加菜品
            addMutation.mutate({ formData }, {
              onSuccess: () => {
                if (andUp) {
                  // 保存并继续添加：清空表单
                  setName('');
                  setCategory('');
                  setPrice('');
                  setFlavorConfigs([]);
                  setImage(null);
                  setImageUrl(null);
                  setDescription('');
                } else {
                  navigate('/dish');
                }
              }
            });
          }
        }
      })
    };
  }
  // 确认取消
  const confirmCancel = () => {
    navigate('/dish');
  };

  // 重置表单（编辑模式下使用）
  const resetForm = () => {
    if (originalData) {
      setName(originalData.name);
      setCategory(originalData.category);
      setPrice(originalData.price);
      setFlavorConfigs(originalData.flavors);
      setImageUrl(originalData.image);
      setDescription(originalData.description);
    }
  };

  return (
    <div className="create-dish">
      <div className="add-employee-header">
        <h3>{isEditMode ? '编辑菜品信息' : '添加新菜品'}</h3>
      </div>
      <form>
        {/* 菜品名称 */}
        <div className="form-group">
          <label htmlFor="name">* 菜品名称</label>
          <input
            type="text"
            id="name"
            placeholder="请填写菜品名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 分类和价格 - 水平排列 */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">* 菜品分类</label>
            <select
              id="category"
              value={category}
              name='category'
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">请选择分类</option>
              {categories.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">* 菜品价格 (¥)</label>
            <input
              type="number"
              id="price"
              placeholder="请设置菜品价格"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        {/* 口味做法配置 */}
        <div className="form-group">
          <div className="section-header">
            <label>口味做法配置</label>
            <button
              type="button"
              className="add-button"
              onClick={handleAddFlavorConfig}
            >
              + 添加口味
            </button>
          </div>

          {flavorConfigs.map((config, index) => (
            <div key={index} className="flavor-config">
              <div className="flavor-header">
                <select
                  name="type"
                  value={config.type} // 绑定当前配置项的 type 值
                  onChange={(e) => handleFlavorTypeChange(e, index)} // 选择时触发
                >
                  <option value="">请选择口味</option>
                  {tasty.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="添加口味选项"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddFlavorValue(index, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      handleAddFlavorValue(index, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  maxLength={6}
                />
                <button
                  type="button"
                  className="remove-flavor"
                  onClick={() => handleRemoveFlavorConfig(index)}
                >
                  删除
                </button>
              </div>

              <div className="flavor-values">
                {config.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="flavor-tag">
                    {value}
                    <span
                      className="remove-tag"
                      onClick={() => handleRemoveFlavorValue(index, valueIndex)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 菜品图片 */}
        <div className="form-group">
          <label htmlFor="image">* 菜品图片</label>
          <div className="image-upload-container">
            <div className="upload-instructions">
              <p>图片大小不超过2M</p>
              <p>仅能上传 PNG/JPEG/JPG 类型图片</p>
              <p>建议上传 200×200 或 300×300 尺寸图片</p>
            </div>

            <div className="upload-area">
              {imageUrl ? (
                <div className="image-preview">
                  <img src={imageUrl} alt="菜品预览" />
                  <button
                    className="remove-image"
                    onClick={() => {
                      setImage(null);
                      setImageUrl(null);
                    }}
                  >
                    移除图片
                  </button>
                </div>
              ) : (
                <>
                  <label htmlFor="image-upload" className="upload-label">
                    点击上传图片
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>
          </div>
        </div>


        {/* 菜品描述 */}
        <div className="form-group">
          <label htmlFor="description">菜品描述</label>
          <textarea
            id="description"
            placeholder="菜品描述，最长200字"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
          />
          <div className="char-counter">
            {description.length}/200
          </div>
        </div>

        {/* 表单按钮 */}
        <div className="form-buttons">
          {isEditMode ? (
            <>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowCancelConfirm(true)}
              >
                取消并返回
              </button>
              <button
                type="button"
                className="save-and-continue-button"
                onClick={resetForm}
              >
                重置
              </button>
              <button
                type="button"
                className="save-button"
                onClick={(e) => handleSave(e)}
              >
                保存修改
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowCancelConfirm(true)}
              >
                取消并返回
              </button>
              <button
                type="button"
                className="save-button"
                onClick={(e) => handleSave(e, false)}
              >
                保存
              </button>
              <button
                type="button"
                className="save-and-continue-button"
                onClick={(e) => handleSave(e, true)}
              >
                保存并继续添加
              </button>
            </>
          )}
        </div>
      </form>

      {/* 取消确认对话框 */}
      <ConfirmationModal
        isOpen={showCancelConfirm}
        title="取消"
        message="确定要取消吗？所有输入将丢失。"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
      <ConfirmationModal
        isOpen={showUpConfirm}
        title="提交"
        message="确定要提交吗？"
        onConfirm={confirmSave}
        onCancel={() => setShowUpConfirm(false)}
      />
    </div>
  );
};

export default AddDish;