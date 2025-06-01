import React, { useState } from 'react';
import './index.css';

const AddDish = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [flavors, setFlavors] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleAddFlavor = () => {
    setFlavors([...flavors, '新口味']);
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
    if (!name || !category || !price || !image) {
      alert('请填写所有必填项');
      return;
    }
    alert('保存成功');
  };

  const handleSaveAndContinue = () => {
    handleSave();
  };

  return (
    <div className="create-dish">
      <form>
        <div className="form-group">
          <label htmlFor="name">* 菜品名称:</label>
          <input
            type="text"
            id="name"
            placeholder="请填写菜品名称"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">* 菜品分类:</label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">请选择菜品分类</option>
            {/* 这里应根据实际分类动态生成选项，目前写死示例 */}
            <option value="汤类">汤类</option>
            <option value="蜀味烤鱼">蜀味烤鱼</option>
            <option value="蜀味牛蛙">蜀味牛蛙</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="price">* 菜品价格:</label>
          <input
            type="number"
            id="price"
            placeholder="请设置菜品价格"
            value={price}
            onChange={handlePriceChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="flavors">口味做法配置:</label>
          <button className="add-flavor-button" onClick={handleAddFlavor}>+ 添加口味</button>
          <div className="flavor-list">
            {flavors.map((flavor, index) => (
              <span key={index}>{flavor}</span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="image">* 菜品图片:</label>
          <div className="image-upload">
            {image ? (
              <img src={image} alt="菜品图片" className="uploaded-image" />
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
          <label htmlFor="description">菜品描述:</label>
          <textarea
            id="description"
            placeholder="菜品描述，最长200字"
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

export default AddDish;