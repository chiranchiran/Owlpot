import React, { useState } from 'react';
import './index.css';

const AddEmployee = () => {
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('男');
  const [idCard, setIdCard] = useState('');

  const handleAccountChange = (e) => setAccount(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);
  const handleIdCardChange = (e) => setIdCard(e.target.value);

  const handleSave = () => {
    if (!account || !name || !phone || !idCard) {
      alert('请填写所有必填项');
      return;
    }
    alert('保存成功');
  };

  const handleSaveAndContinue = () => {
    handleSave();
  };

  return (
    <div className="add-employee">
      <form>
        <div className="form-group">
          <label htmlFor="account">* 账号:</label>
          <input
            type="text"
            id="account"
            placeholder="请输入账号"
            value={account}
            onChange={handleAccountChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">* 员工姓名:</label>
          <input
            type="text"
            id="name"
            placeholder="请输入员工姓名"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">* 手机号:</label>
          <input
            type="text"
            id="phone"
            placeholder="请输入手机号"
            value={phone}
            onChange={handlePhoneChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">性别:</label>
          <div className="gender-radio">
            <input
              type="radio"
              id="male"
              value="男"
              checked={gender === '男'}
              onChange={handleGenderChange}
            />
            <label htmlFor="male">男</label>
            <input
              type="radio"
              id="female"
              value="女"
              checked={gender === '女'}
              onChange={handleGenderChange}
            />
            <label htmlFor="female">女</label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="idCard">* 身份证号:</label>
          <input
            type="text"
            id="idCard"
            placeholder="请输入身份证号"
            value={idCard}
            onChange={handleIdCardChange}
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

export default AddEmployee;