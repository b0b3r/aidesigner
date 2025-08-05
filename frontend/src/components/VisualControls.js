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

// Компонент размера с выпадающим списком
const SizeControl = ({ label, value, onChange, unit = 'px', presets = [] }) => {
  const [inputMode, setInputMode] = React.useState(false);
  const [localValue, setLocalValue] = React.useState('');
  
  // Извлекаем числовое значение из CSS значения
  const numericValue = parseInt(value) || 0;
  
  // Предустановленные размеры
  const defaultPresets = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64];
  const availablePresets = presets.length > 0 ? presets : defaultPresets;
  
  const handlePresetChange = (newValue) => {
    if (newValue === 'custom') {
      setInputMode(true);
      setLocalValue(numericValue.toString());
    } else {
      setInputMode(false);
      onChange(`${newValue}${unit}`);
    }
  };
  
  const handleCustomSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      const newValue = parseInt(localValue) || 0;
      onChange(`${newValue}${unit}`);
      setInputMode(false);
    }
  };
  
  return (
    <div className="visual-control">
      <label className="control-label">{label}</label>
      <div className="size-control-container">
        {!inputMode ? (
          <select
            value={availablePresets.includes(numericValue) ? numericValue : 'custom'}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="select-input"
          >
            {availablePresets.map(size => (
              <option key={size} value={size}>{size}{unit}</option>
            ))}
            <option value="custom">Свое значение: {numericValue}{unit}</option>
          </select>
        ) : (
          <div className="custom-input-container">
            <input
              type="number"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleCustomSubmit}
              onBlur={handleCustomSubmit}
              className="number-input"
              placeholder={numericValue.toString()}
              autoFocus
            />
            <span className="unit-label">{unit}</span>
            <button 
              onClick={() => setInputMode(false)}
              className="cancel-btn"
              type="button"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Простой числовой инпут (для отступов)
const NumberInput = ({ label, value, onChange, min = 0, max = 200, unit = 'px' }) => {
  const [localValue, setLocalValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  
  const numericValue = parseInt(value) || 0;
  
  React.useEffect(() => {
    if (!isFocused) {
      setLocalValue(numericValue.toString());
    }
  }, [numericValue, isFocused]);
  
  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };
  
  const handleSubmit = () => {
    const newValue = parseInt(localValue) || 0;
    onChange(`${Math.max(min, Math.min(max, newValue))}${unit}`);
    setIsFocused(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className="visual-control">
      <label className="control-label">{label}</label>
      <div className="number-input-container">
        <input
          type="number"
          value={isFocused ? localValue : numericValue}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true);
            setLocalValue(numericValue.toString());
          }}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
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
  const [isAllSides, setIsAllSides] = React.useState(true);
  
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
  const allSidesEqual = spacing.top === spacing.right && spacing.right === spacing.bottom && spacing.bottom === spacing.left;

  const updateSpacing = (side, newValue) => {
    const newVal = parseInt(newValue) || 0;
    let updated;
    
    if (isAllSides && allSidesEqual) {
      // Если редактируем все стороны одинаково
      updated = { top: newVal, right: newVal, bottom: newVal, left: newVal };
    } else {
      // Если редактируем отдельную сторону
      updated = { ...spacing, [side]: newVal };
    }
    
    const spacingString = `${updated.top}px ${updated.right}px ${updated.bottom}px ${updated.left}px`;
    onChange(spacingString);
  };

  return (
    <div className="visual-control">
      <label className="control-label">
        {label}
        <button
          type="button"
          onClick={() => setIsAllSides(!isAllSides)}
          className="spacing-mode-btn"
          title={isAllSides ? "Отдельные стороны" : "Все стороны одинаково"}
        >
          {isAllSides ? "⚏" : "⚉"}
        </button>
      </label>
      
      {isAllSides && allSidesEqual ? (
        <NumberInput
          label=""
          value={`${spacing.top}px`}
          onChange={(val) => updateSpacing('top', val)}
          min={0}
          max={100}
          unit="px"
        />
      ) : (
        <div className="spacing-control">
          <div className="spacing-inputs">
            <div className="spacing-row">
              <NumberInput
                label="T"
                value={`${spacing.top}px`}
                onChange={(val) => updateSpacing('top', val)}
                min={0}
                max={100}
                unit="px"
              />
            </div>
            <div className="spacing-row">
              <NumberInput
                label="L"
                value={`${spacing.left}px`}
                onChange={(val) => updateSpacing('left', val)}
                min={0}
                max={100}
                unit="px"
              />
              <div className="spacing-center">{label}</div>
              <NumberInput
                label="R"
                value={`${spacing.right}px`}
                onChange={(val) => updateSpacing('right', val)}
                min={0}
                max={100}
                unit="px"
              />
            </div>
            <div className="spacing-row">
              <NumberInput
                label="B"
                value={`${spacing.bottom}px`}
                onChange={(val) => updateSpacing('bottom', val)}
                min={0}
                max={100}
                unit="px"
              />
            </div>
          </div>
        </div>
      )}
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
        <p style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>
          Кликните на элемент в артефакте на канвасе
        </p>
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
        <SizeControl
          label="Размер шрифта"
          value={properties.fontSize}
          presets={[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64]}
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
        <SizeControl
          label="Ширина"
          value={properties.width}
          presets={[50, 100, 150, 200, 250, 300, 400, 500, 600, 800]}
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
        <SizeControl
          label="Скругление углов"
          value={properties.borderRadius}
          presets={[0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 50]}
          onChange={(radius) => onPropertyChange('borderRadius', radius)}
        />
        <NumberInput
          label="Прозрачность"
          value={properties.opacity ? (parseFloat(properties.opacity) * 100).toString() : '100'}
          onChange={(val) => onPropertyChange('opacity', (parseInt(val) / 100).toString())}
          min={0}
          max={100}
          unit="%"
        />
      </PropertyGroup>
    </div>
  );
};

export default VisualControls;
export { ColorPicker, SizeControl, NumberInput, Select, SpacingControl, PropertyGroup };