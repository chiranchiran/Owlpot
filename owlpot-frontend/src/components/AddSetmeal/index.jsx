import React, { useState } from 'react';
import './index.css';

const AddSetmeal = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [dishes, setDishes] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleAddDish = () => {
    // 这里可以实现添加菜品的逻辑，目前先简单模拟
    setDishes([...dishes, '新菜品']);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // 这里添加保存套餐的实际逻辑，目前仅做简单校验提示
    if (!name || !category || !price || !dishes.length || !image) {
      alert('请填写所有必填项');
      return;
    }
    alert('保存成功');
  };

  const handleSaveAndContinue = () => {
    handleSave();
    // 保存后可进行重置表单等操作，这里先不详细展开
  };

  return (
    <div className="create-setmeal">
      <form>
        <div className="form-group">
          <label htmlFor="name">* 套餐名称:</label>
          <input
            type="text"
            id="name"
            placeholder="请填写套餐名称"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">* 套餐分类:</label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">全部套餐分类</option>
            {/* 这里应根据实际分类动态生成选项，目前写死示例 */}
            <option value="人气套餐">人气套餐</option>
            <option value="商务套餐">商务套餐</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="price">* 套餐价格:</label>
          <input
            type="number"
            id="price"
            placeholder="请设置套餐价格"
            value={price}
            onChange={handlePriceChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dishes">* 套餐菜品:</label>
          <button className="add-dish-button" onClick={handleAddDish}>+ 添加菜品</button>
          <div className="dish-list">
            {dishes.map((dish, index) => (
              <span key={index}>{dish}</span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="image">* 套餐图片:</label>
          <div className="image-upload">
            {image ? (
              <img src={image} alt="套餐图片" className="uploaded-image" />
            ) : (
              <div className="upload-placeholder">
                <input
                  type="file"
                  id="image"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleImageUpload}
                />
                <p>图片大小不超过2M</p>
                <p>仅能上传 PNG JPEG JPG类型图片</p>
                <p>建议上传200*200或300*300尺寸的图片</p>
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">套餐描述:</label>
          <textarea
            id="description"
            placeholder="套餐描述，最长200字"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={() => { }}>取消</button>
          <button type="button" className="save-button" onClick={handleSave}>保存</button>
          <button type="button" className="save-and-continue-button" onClick={handleSaveAndContinue}>
            保存并继续添加
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSetmeal;