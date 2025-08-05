import React from 'react';

// Компонент выбора цвета
const ColorPicker = ({ label, value, onChange, defaultValue = '#000000' }) => {
  const displayValue = value === 'transparent' || !value ? defaultValue : value;
  
  return (
    <div className="visual-control">
      <label className="control-label">{label}</label>
      <div className="color-picker-container">
        <input
          type="color"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          className="color-input"
        />
        <input
          type="text"
          value={value || 'transparent'}
          onChange={(e) => onChange(e.target.value)}
          className="color-text-input"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

// Компонент слайдера
const Slider = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = 'px' }) => {
  const numericValue = parseInt(value) || min;
  
  return (
    <div className="visual-control">
      <label className="control-label">{label}</label>
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numericValue}
          onChange={(e) => onChange(`${e.target.value}${unit}`)}
          className="slider-input"
        />
        <input
          type="number"
          value={numericValue}
          onChange={(e) => onChange(`${e.target.value}${unit}`)}
          className="number-input"
          min={min}
          max={max}
        />
        <span className="unit-label">{unit}</span>
      </div>
    </div>
  );
};

// Компонент выбора опций
const Select = ({ label, value, onChange, options = [] }) => {
  return (
    <div className="visual-control">
      <label className="control-label">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="select-input"
      >
        {options.map(option => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
};

// Компонент управления отступами
const SpacingControl = ({ label, value, onChange }) => {
  // Парсим значение padding/margin (например: "10px 20px 10px 20px")
  const parseSpacing = (spacingValue) => {
    if (!spacingValue) return { top: 0, right: 0, bottom: 0, left: 0 };
    
    const values = spacingValue.replace(/px/g, '').split(' ').map(v => parseInt(v) || 0);
    
    if (values.length === 1) {
      return { top: values[0], right: values[0], bottom: values[0], left: values[0] };
    } else if (values.length === 2) {
      return { top: values[0], right: values[1], bottom: values[0], left: values[1] };
    } else if (values.length === 4) {
      return { top: values[0], right: values[1], bottom: values[2], left: values[3] };
    }
    
    return { top: 0, right: 0, bottom: 0, left: 0 };
  };

  const spacing = parseSpacing(value);

  const updateSpacing = (side, newValue) => {
    const updated = { ...spacing, [side]: parseInt(newValue) || 0 };
    const spacingString = `${updated.top}px ${updated.right}px ${updated.bottom}px ${updated.left}px`;
    onChange(spacingString);
  };

  return (
    <div className="visual-control">
      <label className="control-label">{label}</label>
      <div className="spacing-control">
        <div className="spacing-inputs">
          <div className="spacing-row">
            <input
              type="number"
              value={spacing.top}
              onChange={(e) => updateSpacing('top', e.target.value)}
              className="spacing-input"
              placeholder="T"
              title="Top"
            />
          </div>
          <div className="spacing-row">
            <input
              type="number"
              value={spacing.left}
              onChange={(e) => updateSpacing('left', e.target.value)}
              className="spacing-input"
              placeholder="L"
              title="Left"
            />
            <div className="spacing-center">
              {label}
            </div>
            <input
              type="number"
              value={spacing.right}
              onChange={(e) => updateSpacing('right', e.target.value)}
              className="spacing-input"
              placeholder="R"
              title="Right"
            />
          </div>
          <div className="spacing-row">
            <input
              type="number"
              value={spacing.bottom}
              onChange={(e) => updateSpacing('bottom', e.target.value)}
              className="spacing-input"
              placeholder="B"
              title="Bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Группа свойств
const PropertyGroup = ({ title, children, isCollapsed = false }) => {
  const [collapsed, setCollapsed] = React.useState(isCollapsed);

  return (
    <div className="property-group">
      <button
        className="property-group-header"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={`collapse-icon ${collapsed ? 'collapsed' : ''}`}>▼</span>
        <span className="property-group-title">{title}</span>
      </button>
      {!collapsed && (
        <div className="property-group-content">
          {children}
        </div>
      )}
    </div>
  );
};

// Основной компонент Visual Controls
const VisualControls = ({ selectedElement, onPropertyChange }) => {
  if (!selectedElement) {
    return (
      <div className="visual-controls no-selection">
        <p>Выберите элемент для редактирования</p>
      </div>
    );
  }

  const properties = selectedElement.properties || {};

  return (
    <div className="visual-controls">
      {/* Typography Section */}
      <PropertyGroup title="Типографика">
        <ColorPicker
          label="Цвет текста"
          value={properties.color}
          onChange={(color) => onPropertyChange('color', color)}
        />
        <Slider
          label="Размер шрифта"
          value={properties.fontSize}
          min={8}
          max={72}
          unit="px"
          onChange={(size) => onPropertyChange('fontSize', size)}
        />
        <Select
          label="Жирность"
          value={properties.fontWeight}
          onChange={(weight) => onPropertyChange('fontWeight', weight)}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'bold', label: 'Bold' },
            { value: '100', label: '100 - Thin' },
            { value: '300', label: '300 - Light' },
            { value: '400', label: '400 - Regular' },
            { value: '500', label: '500 - Medium' },
            { value: '600', label: '600 - Semi Bold' },
            { value: '700', label: '700 - Bold' },
            { value: '900', label: '900 - Black' }
          ]}
        />
        <Select
          label="Выравнивание"
          value={properties.textAlign}
          onChange={(align) => onPropertyChange('textAlign', align)}
          options={[
            { value: 'left', label: 'По левому краю' },
            { value: 'center', label: 'По центру' },
            { value: 'right', label: 'По правому краю' },
            { value: 'justify', label: 'По ширине' }
          ]}
        />
      </PropertyGroup>

      {/* Layout Section */}
      <PropertyGroup title="Отступы и размеры">
        <SpacingControl
          label="Padding"
          value={properties.padding}
          onChange={(padding) => onPropertyChange('padding', padding)}
        />
        <SpacingControl
          label="Margin"
          value={properties.margin}
          onChange={(margin) => onPropertyChange('margin', margin)}
        />
        <Slider
          label="Ширина"
          value={properties.width}
          min={0}
          max={800}
          unit="px"
          onChange={(width) => onPropertyChange('width', width)}
        />
      </PropertyGroup>

      {/* Visual Section */}
      <PropertyGroup title="Внешний вид">
        <ColorPicker
          label="Цвет фона"
          value={properties.backgroundColor}
          defaultValue="#ffffff"
          onChange={(bg) => onPropertyChange('backgroundColor', bg)}
        />
        <Slider
          label="Скругление углов"
          value={properties.borderRadius}
          min={0}
          max={50}
          unit="px"
          onChange={(radius) => onPropertyChange('borderRadius', radius)}
        />
        <Slider
          label="Прозрачность"
          value={properties.opacity}
          min={0}
          max={1}
          step={0.1}
          unit=""
          onChange={(opacity) => onPropertyChange('opacity', opacity)}
        />
      </PropertyGroup>
    </div>
  );
};

export default VisualControls;
export { ColorPicker, Slider, Select, SpacingControl, PropertyGroup };