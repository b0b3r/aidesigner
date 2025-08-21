/**
 * Сервис для сохранения и загрузки канваса
 */

class CanvasStorage {
  constructor() {
    this.storageKey = 'aidesigner_canvas';
  }

  /**
   * Сохранение канваса в localStorage
   */
  saveCanvas(canvasElements) {
    try {
      const canvasData = {
        elements: canvasElements,
        savedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(canvasData));
      console.log('💾 Канвас сохранен:', canvasElements.length, 'элементов');
      
      return {
        success: true,
        message: `Сохранено ${canvasElements.length} элементов`
      };
      
    } catch (error) {
      console.error('❌ Ошибка сохранения канваса:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Сохранение канваса в файл с системным диалогом
   */
  saveCanvasToFile(canvasElements) {
    return new Promise(async (resolve) => {
      try {
        const canvasData = {
          elements: canvasElements,
          savedAt: new Date().toISOString(),
          version: '1.0',
          metadata: {
            totalElements: canvasElements.length,
            appVersion: '1.0.0'
          }
        };
        
        const jsonData = JSON.stringify(canvasData, null, 2);
        const defaultFileName = `aidesigner-canvas-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        
        // Используем системный диалог сохранения файла
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: defaultFileName,
          types: [{
            description: 'JSON файл',
            accept: {
              'application/json': ['.json']
            }
          }]
        });
        
        // Создаем WritableStream и записываем данные
        const writable = await fileHandle.createWritable();
        await writable.write(jsonData);
        await writable.close();
        
        console.log('💾 Канвас сохранен в файл:', fileHandle.name);
        
        resolve({
          success: true,
          fileName: fileHandle.name,
          message: `Сохранено ${canvasElements.length} элементов в файл "${fileHandle.name}"`
        });
        
      } catch (error) {
        console.error('❌ Ошибка сохранения канваса в файл:', error);
        resolve({
          success: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Загрузка канваса из localStorage
   */
  loadCanvas() {
    try {
      const canvasData = localStorage.getItem(this.storageKey);
      
      if (!canvasData) {
        return {
          success: false,
          error: 'Сохраненный канвас не найден'
        };
      }
      
      const parsed = JSON.parse(canvasData);
      console.log('💾 Канвас загружен из localStorage:', parsed.elements.length, 'элементов');
      
      return {
        success: true,
        elements: parsed.elements,
        savedAt: parsed.savedAt,
        message: `Загружено ${parsed.elements.length} элементов`
      };
      
    } catch (error) {
      console.error('❌ Ошибка загрузки канваса:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Загрузка канваса из файла
   */
  loadCanvasFromFile() {
    return new Promise((resolve) => {
      try {
        // Создаем input для выбора файла
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (!file) {
            resolve({
              success: false,
              error: 'Файл не выбран'
            });
            return;
          }
          
          const reader = new FileReader();
          
          reader.onload = (e) => {
            try {
              const canvasData = JSON.parse(e.target.result);
              
              // Валидация структуры файла
              if (!canvasData.elements || !Array.isArray(canvasData.elements)) {
                resolve({
                  success: false,
                  error: 'Неверный формат файла: отсутствуют элементы канваса'
                });
                return;
              }
              
              console.log('💾 Канвас загружен из файла:', file.name, canvasData.elements.length, 'элементов');
              
              resolve({
                success: true,
                elements: canvasData.elements,
                fileName: file.name,
                savedAt: canvasData.savedAt,
                message: `Загружено ${canvasData.elements.length} элементов из файла "${file.name}"`
              });
              
            } catch (parseError) {
              console.error('❌ Ошибка парсинга файла:', parseError);
              resolve({
                success: false,
                error: 'Неверный формат файла: не удалось прочитать JSON'
              });
            }
          };
          
          reader.onerror = () => {
            resolve({
              success: false,
              error: 'Ошибка чтения файла'
            });
          };
          
          reader.readAsText(file);
        };
        
        input.oncancel = () => {
          resolve({
            success: false,
            error: 'Выбор файла отменен'
          });
        };
        
        // Запускаем выбор файла
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
        
      } catch (error) {
        console.error('❌ Ошибка загрузки канваса из файла:', error);
        resolve({
          success: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Проверка наличия сохраненного канваса
   */
  hasSavedCanvas() {
    return localStorage.getItem(this.storageKey) !== null;
  }

  /**
   * Очистка сохраненного канваса
   */
  clearCanvas() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ Канвас очищен');
      
      return {
        success: true,
        message: 'Канвас очищен'
      };
      
    } catch (error) {
      console.error('❌ Ошибка очистки канваса:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Получение информации о сохранении
   */
  getCanvasInfo() {
    try {
      const canvasData = localStorage.getItem(this.storageKey);
      
      if (!canvasData) {
        return null;
      }
      
      const parsed = JSON.parse(canvasData);
      return {
        elementsCount: parsed.elements.length,
        savedAt: parsed.savedAt,
        version: parsed.version
      };
      
    } catch (error) {
      console.error('❌ Ошибка получения информации о канвасе:', error);
      return null;
    }
  }
}

export default CanvasStorage;
