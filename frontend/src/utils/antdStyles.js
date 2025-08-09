// Встроенные стили Ant Design для гарантированной загрузки

export const injectAntDesignStyles = () => {
  const styles = `
    /* Основные стили кнопок Ant Design */
    .ant-btn {
      position: relative;
      display: inline-block;
      font-weight: 400;
      white-space: nowrap;
      text-align: center;
      background-image: none;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      user-select: none;
      touch-action: manipulation;
      height: 32px;
      padding: 4px 15px;
      font-size: 14px;
      border-radius: 6px;
      color: rgba(0, 0, 0, 0.88);
      background: #ffffff;
      border-color: #d9d9d9;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
    }

    .ant-btn:hover {
      color: #4096ff;
      border-color: #4096ff;
    }

    .ant-btn:active {
      color: #0958d9;
      border-color: #0958d9;
    }

    .ant-btn-primary {
      color: #fff;
      background: #1677ff;
      border-color: #1677ff;
      box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);
    }

    .ant-btn-primary:hover {
      color: #fff;
      background: #4096ff;
      border-color: #4096ff;
    }

    .ant-btn-primary:active {
      color: #fff;
      background: #0958d9;
      border-color: #0958d9;
    }

    .ant-btn-dashed {
      color: rgba(0, 0, 0, 0.88);
      background: #ffffff;
      border-color: #d9d9d9;
      border-style: dashed;
    }

    .ant-btn-dashed:hover {
      color: #4096ff;
      border-color: #4096ff;
    }

    /* Стили карточек Ant Design */
    .ant-card {
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #f0f0f0;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
    }

    .ant-card-bordered {
      border: 1px solid #f0f0f0;
    }

    .ant-card-body {
      padding: 24px;
    }

    .ant-card-head {
      min-height: 48px;
      margin-bottom: -1px;
      padding: 0 24px;
      color: rgba(0, 0, 0, 0.88);
      font-weight: 500;
      font-size: 16px;
      background: transparent;
      border-bottom: 1px solid #f0f0f0;
      border-radius: 8px 8px 0 0;
    }

    .ant-card-head-title {
      display: inline-block;
      flex: 1;
      padding: 16px 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    /* Стили инпутов Ant Design */
    .ant-input {
      position: relative;
      display: inline-block;
      width: 100%;
      min-width: 0;
      padding: 4px 11px;
      color: rgba(0, 0, 0, 0.88);
      font-size: 14px;
      line-height: 1.5714285714285714;
      background-color: #ffffff;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .ant-input:hover {
      border-color: #4096ff;
      border-inline-end-width: 1px;
    }

    .ant-input:focus,
    .ant-input-focused {
      border-color: #4096ff;
      box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.2);
      border-inline-end-width: 1px;
      outline: 0;
    }

    .ant-input-search {
      position: relative;
      display: inline-block;
    }

    .ant-input-search .ant-input {
      padding-right: 30px;
    }

    .ant-input-search .ant-input-search-button {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      display: block;
      width: 32px;
      height: 30px;
      margin-top: 1px;
      margin-bottom: 1px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      font-style: normal;
      line-height: 1;
      text-align: center;
      text-transform: none;
      background: transparent;
      border: 0;
      border-start-start-radius: 0;
      border-end-start-radius: 0;
      border-start-end-radius: 6px;
      border-end-end-radius: 6px;
      outline: 0;
      transition: color 0.2s;
    }

    .ant-input-search .ant-input-search-button:hover {
      color: rgba(0, 0, 0, 0.88);
    }
  `;

  // Создаем style элемент и добавляем в head
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  styleElement.id = 'antd-inline-styles';
  
  // Удаляем существующий если есть
  const existingStyle = document.getElementById('antd-inline-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  document.head.appendChild(styleElement);
  console.log('✅ Встроенные стили Ant Design добавлены');
};

export default injectAntDesignStyles;
