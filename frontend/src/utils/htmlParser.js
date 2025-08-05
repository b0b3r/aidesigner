// Утилиты для работы с HTML элементами в артефактах

/**
 * Добавляет data-element-id ко всем элементам HTML для возможности выбора
 */
export const makeElementsSelectable = (htmlString) => {
  if (!htmlString) return '';
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  // Получаем все элементы в body
  const elements = doc.body.querySelectorAll('*');
  console.log('🔍 Обрабатываем элементов для выбора:', elements.length);
  
  elements.forEach((element, index) => {
    // Добавляем уникальный ID для выбора
    element.setAttribute('data-element-id', `element-${index}`);
    element.setAttribute('data-element-type', element.tagName.toLowerCase());
    
    // Добавляем стили для hover эффекта
    const currentStyle = element.getAttribute('style') || '';
    element.setAttribute('data-original-style', currentStyle);
  });
  
  return doc.body.innerHTML;
};

/**
 * Извлекает CSS свойства элемента
 */
export const extractElementProperties = (element) => {
  if (!element) return {};
  
  const computedStyle = window.getComputedStyle(element);
  
  return {
    // Typography
    fontSize: computedStyle.fontSize,
    fontWeight: computedStyle.fontWeight,
    fontFamily: computedStyle.fontFamily,
    color: rgbToHex(computedStyle.color),
    textAlign: computedStyle.textAlign,
    lineHeight: computedStyle.lineHeight,
    
    // Layout
    display: computedStyle.display,
    padding: computedStyle.padding,
    margin: computedStyle.margin,
    width: computedStyle.width,
    height: computedStyle.height,
    
    // Visual
    backgroundColor: rgbToHex(computedStyle.backgroundColor),
    border: computedStyle.border,
    borderRadius: computedStyle.borderRadius,
    boxShadow: computedStyle.boxShadow,
    opacity: computedStyle.opacity,
    
    // Position
    position: computedStyle.position,
    top: computedStyle.top,
    left: computedStyle.left,
    right: computedStyle.right,
    bottom: computedStyle.bottom,
    zIndex: computedStyle.zIndex
  };
};

/**
 * Применяет новые свойства к элементу и возвращает обновленный HTML
 */
export const applyElementProperties = (htmlString, elementId, newProperties) => {
  if (!htmlString) return '';
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  const element = doc.querySelector(`[data-element-id="${elementId}"]`);
  if (!element) return htmlString;
  
  // Применяем новые стили
  Object.entries(newProperties).forEach(([property, value]) => {
    if (value !== null && value !== undefined) {
      element.style[property] = value;
    }
  });
  
  return doc.body.innerHTML;
};

/**
 * Получает информацию об элементе по его ID
 */
export const getElementInfo = (htmlString, elementId) => {
  if (!htmlString) return null;
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  const element = doc.querySelector(`[data-element-id="${elementId}"]`);
  if (!element) return null;
  
  return {
    id: elementId,
    tagName: element.tagName.toLowerCase(),
    textContent: element.textContent?.trim() || '',
    innerHTML: element.innerHTML,
    attributes: Array.from(element.attributes).reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {}),
    classList: Array.from(element.classList)
  };
};

/**
 * Получает все элементы из HTML
 */
export const getAllElements = (htmlString) => {
  if (!htmlString) return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  const elements = doc.body.querySelectorAll('[data-element-id]');
  
  return Array.from(elements).map(element => ({
    id: element.getAttribute('data-element-id'),
    tagName: element.tagName.toLowerCase(),
    textContent: element.textContent?.trim() || '',
    hasChildren: element.children.length > 0,
    depth: getElementDepth(element)
  }));
};

/**
 * Вспомогательные функции
 */
const rgbToHex = (rgb) => {
  if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return 'transparent';
  
  const result = rgb.match(/\d+/g);
  if (!result) return rgb;
  
  return '#' + ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1);
};

const getElementDepth = (element) => {
  let depth = 0;
  let parent = element.parentElement;
  
  while (parent && parent !== document.body) {
    depth++;
    parent = parent.parentElement;
  }
  
  return depth;
};

/**
 * Создает CSS селектор для элемента
 */
export const generateElementSelector = (elementInfo) => {
  let selector = elementInfo.tagName;
  
  if (elementInfo.attributes.id && !elementInfo.attributes.id.startsWith('element-')) {
    selector += `#${elementInfo.attributes.id}`;
  }
  
  if (elementInfo.classList.length > 0) {
    selector += `.${elementInfo.classList.join('.')}`;
  }
  
  return selector;
};