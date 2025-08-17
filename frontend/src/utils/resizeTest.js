/**
 * Автоматический тест для проверки функциональности изменения размера
 * Этот тест можно запустить в консоли браузера для проверки работы resize
 */

class ResizeTest {
  constructor() {
    this.testResults = [];
    this.currentTest = null;
  }

  // Логирование результатов тестов
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    this.testResults.push({
      timestamp,
      message,
      type
    });
  }

  // Проверка наличия ReactFlow
  checkReactFlow() {
    this.log('Проверяем наличие ReactFlow...');
    
    const reactFlowContainer = document.querySelector('.canvas-flow-container');
    if (!reactFlowContainer) {
      this.log('ReactFlow контейнер не найден!', 'error');
      return false;
    }
    
    const reactFlow = reactFlowContainer.querySelector('.react-flow');
    if (!reactFlow) {
      this.log('ReactFlow компонент не найден!', 'error');
      return false;
    }
    
    this.log('ReactFlow найден', 'success');
    return true;
  }

  // Проверка наличия узлов
  checkNodes() {
    this.log('Проверяем наличие узлов...');
    
    const nodes = document.querySelectorAll('.ui-flow-node');
    if (nodes.length === 0) {
      this.log('Узлы не найдены! Создайте артефакт для тестирования', 'error');
      return false;
    }
    
    this.log(`Найдено ${nodes.length} узлов`, 'success');
    return nodes;
  }

  // Проверка стилей resize handles
  checkResizeStyles() {
    this.log('Проверяем стили для resize handles...');
    
    const styleSheets = Array.from(document.styleSheets);
    let resizeStylesFound = false;
    
    for (const sheet of styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules);
        for (const rule of rules) {
          if (rule.selectorText && rule.selectorText.includes('react-flow__node-resizer')) {
            resizeStylesFound = true;
            break;
          }
        }
      } catch (e) {
        // Игнорируем ошибки доступа к cross-origin стилям
      }
    }
    
    if (!resizeStylesFound) {
      this.log('Стили для resize handles не найдены!', 'error');
      return false;
    }
    
    this.log('Стили для resize handles найдены', 'success');
    return true;
  }

  // Симуляция клика для выбора узла
  selectNode(node) {
    this.log(`Выбираем узел: ${node.querySelector('.ui-flow-title')?.textContent || 'Без названия'}`);
    
    // Симулируем клик для выбора узла
    node.click();
    
    // Проверяем, что узел выбран
    setTimeout(() => {
      if (node.classList.contains('selected')) {
        this.log('Узел успешно выбран', 'success');
      } else {
        this.log('Узел не выбран после клика', 'error');
      }
    }, 100);
  }

  // Проверка наличия resize handles
  checkResizeHandles(node) {
    this.log('Проверяем наличие resize handles...');
    
    // Сначала выбираем узел
    this.selectNode(node);
    
    setTimeout(() => {
      const resizeHandles = node.querySelectorAll('.react-flow__node-resizer-handle');
      
      if (resizeHandles.length === 0) {
        this.log('Resize handles не найдены!', 'error');
        this.log('Возможные причины:', 'info');
        this.log('- NodeResizer компонент не добавлен в узел', 'info');
        this.log('- CSS стили не загружены', 'info');
        this.log('- Узел не выбран', 'info');
        return false;
      }
      
      this.log(`Найдено ${resizeHandles.length} resize handles`, 'success');
      return resizeHandles;
    }, 200);
  }

  // Симуляция изменения размера
  simulateResize(node) {
    this.log('Симулируем изменение размера...');
    
    const resizeHandles = this.checkResizeHandles(node);
    if (!resizeHandles) return false;
    
    // Получаем начальные размеры
    const initialWidth = node.offsetWidth;
    const initialHeight = node.offsetHeight;
    
    this.log(`Начальные размеры: ${initialWidth}x${initialHeight}`);
    
    // Симулируем перетаскивание правого нижнего угла
    const bottomRightHandle = Array.from(resizeHandles).find(handle => {
      const rect = handle.getBoundingClientRect();
      return rect.left > node.getBoundingClientRect().left + node.offsetWidth / 2 &&
             rect.top > node.getBoundingClientRect().top + node.offsetHeight / 2;
    });
    
    if (!bottomRightHandle) {
      this.log('Правый нижний resize handle не найден', 'error');
      return false;
    }
    
    this.log('Найден правый нижний resize handle, симулируем перетаскивание...');
    
    // Симулируем события мыши
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      clientX: bottomRightHandle.getBoundingClientRect().left,
      clientY: bottomRightHandle.getBoundingClientRect().top
    });
    
    const mouseMoveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: bottomRightHandle.getBoundingClientRect().left + 50,
      clientY: bottomRightHandle.getBoundingClientRect().top + 50
    });
    
    const mouseUpEvent = new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true
    });
    
    // Запускаем события
    bottomRightHandle.dispatchEvent(mouseDownEvent);
    setTimeout(() => {
      document.dispatchEvent(mouseMoveEvent);
      setTimeout(() => {
        document.dispatchEvent(mouseUpEvent);
        
        // Проверяем, изменились ли размеры
        setTimeout(() => {
          const newWidth = node.offsetWidth;
          const newHeight = node.offsetHeight;
          
          this.log(`Новые размеры: ${newWidth}x${newHeight}`);
          
          if (newWidth !== initialWidth || newHeight !== initialHeight) {
            this.log('Размеры успешно изменены!', 'success');
            return true;
          } else {
            this.log('Размеры не изменились', 'error');
            return false;
          }
        }, 100);
      }, 100);
    }, 100);
  }

  // Полный тест
  runFullTest() {
    this.log('🚀 Запускаем полный тест функциональности изменения размера...');
    
    // Проверяем ReactFlow
    if (!this.checkReactFlow()) {
      this.log('Тест прерван: ReactFlow не найден', 'error');
      return this.testResults;
    }
    
    // Проверяем стили
    if (!this.checkResizeStyles()) {
      this.log('Тест прерван: стили не найдены', 'error');
      return this.testResults;
    }
    
    // Проверяем узлы
    const nodes = this.checkNodes();
    if (!nodes) {
      this.log('Тест прерван: узлы не найдены', 'error');
      return this.testResults;
    }
    
    // Тестируем первый узел
    const firstNode = nodes[0];
    this.log(`Тестируем узел: ${firstNode.querySelector('.ui-flow-title')?.textContent || 'Без названия'}`);
    
    // Проверяем resize handles
    setTimeout(() => {
      this.checkResizeHandles(firstNode);
      
      // Симулируем изменение размера
      setTimeout(() => {
        this.simulateResize(firstNode);
        
        // Выводим итоговый отчет
        setTimeout(() => {
          this.generateReport();
        }, 500);
      }, 300);
    }, 200);
    
    return this.testResults;
  }

  // Генерация отчета
  generateReport() {
    this.log('📊 Генерируем отчет о тестировании...');
    
    const totalTests = this.testResults.length;
    const errors = this.testResults.filter(r => r.type === 'error').length;
    const successes = this.testResults.filter(r => r.type === 'success').length;
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 ОТЧЕТ О ТЕСТИРОВАНИИ ИЗМЕНЕНИЯ РАЗМЕРА');
    console.log('='.repeat(50));
    console.log(`Всего проверок: ${totalTests}`);
    console.log(`Успешных: ${successes}`);
    console.log(`Ошибок: ${errors}`);
    console.log(`Успешность: ${Math.round((successes / totalTests) * 100)}%`);
    
    if (errors > 0) {
      console.log('\n❌ ОШИБКИ:');
      this.testResults.filter(r => r.type === 'error').forEach(error => {
        console.log(`  - ${error.message}`);
      });
    }
    
    console.log('\n✅ УСПЕШНЫЕ ПРОВЕРКИ:');
    this.testResults.filter(r => r.type === 'success').forEach(success => {
      console.log(`  - ${success.message}`);
    });
    
    console.log('\n' + '='.repeat(50));
    
    if (errors === 0) {
      console.log('🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!');
    } else {
      console.log('⚠️  ОБНАРУЖЕНЫ ПРОБЛЕМЫ, ТРЕБУЕТСЯ ИСПРАВЛЕНИЕ');
    }
  }

  // Быстрая проверка
  quickCheck() {
    this.log('⚡ Быстрая проверка функциональности...');
    
    const reactFlow = document.querySelector('.react-flow');
    const nodes = document.querySelectorAll('.ui-flow-node');
    const selectedNode = document.querySelector('.ui-flow-node.selected');
    
    if (!reactFlow) {
      this.log('ReactFlow не найден', 'error');
      return false;
    }
    
    if (nodes.length === 0) {
      this.log('Узлы не найдены', 'error');
      return false;
    }
    
    if (!selectedNode) {
      this.log('Нет выбранного узла - выберите узел для тестирования', 'info');
      return false;
    }
    
    const resizeHandles = selectedNode.querySelectorAll('.react-flow__node-resizer-handle');
    if (resizeHandles.length === 0) {
      this.log('Resize handles не найдены на выбранном узле', 'error');
      return false;
    }
    
    this.log(`Найдено ${resizeHandles.length} resize handles - функциональность готова к использованию!`, 'success');
    return true;
  }
}

// Создаем глобальный экземпляр для доступа из консоли
window.resizeTest = new ResizeTest();

// Экспортируем для использования в других модулях
export default ResizeTest;
