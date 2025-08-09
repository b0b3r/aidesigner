/**
 * CSS инжектор для дизайн-систем
 * Автоматически загружает CSS файлы при необходимости
 */

class CSSInjector {
    constructor() {
        this.loadedCSS = new Set();
        this.cssCache = new Map();
    }

    /**
     * Инжектирует CSS файл в head документа
     * @param {string} cssContent - содержимое CSS
     * @param {string} id - уникальный идентификатор
     */
    injectCSS(cssContent, id) {
        if (this.loadedCSS.has(id)) {
            console.log(`🎨 CSS уже загружен: ${id}`);
            return;
        }

        const style = document.createElement('style');
        style.id = `css-injector-${id}`;
        style.textContent = cssContent;
        
        document.head.appendChild(style);
        this.loadedCSS.add(id);
        
        console.log(`🎨 CSS инжектирован: ${id}`);
    }

    /**
     * Загружает CSS файл по URL
     * @param {string} url - URL CSS файла
     * @param {string} id - уникальный идентификатор
     */
    async loadCSSFromURL(url, id) {
        if (this.loadedCSS.has(id)) {
            console.log(`📝 CSS ${id} уже загружен, пропускаем`);
            return;
        }

        try {
            console.log(`📥 Загружаю CSS: ${url}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const cssContent = await response.text();
            console.log(`✅ CSS загружен: ${url} (${cssContent.length} символов)`);
            
            this.injectCSS(cssContent, id);
            this.loadedCSS.add(id);
            
            // Проверяем, что CSS действительно применился
            setTimeout(() => {
                this.verifyCSSLoaded(id, url);
            }, 1000);
            
        } catch (error) {
            console.error(`❌ Ошибка загрузки CSS ${url}:`, error);
        }
    }

    /**
     * Проверяет, что CSS действительно загрузился
     * @param {string} id - идентификатор CSS
     * @param {string} url - URL файла
     */
    verifyCSSLoaded(id, url) {
        // Создаем тестовый элемент для проверки
        const testElement = document.createElement('div');
        testElement.className = 'ant-btn ant-btn-primary';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.top = '-9999px';
        testElement.textContent = 'Test';
        
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const hasStyles = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
                         computedStyle.borderRadius !== '0px' ||
                         computedStyle.padding !== '0px';
        
        document.body.removeChild(testElement);
        
        if (hasStyles) {
            console.log(`✅ CSS ${id} успешно применен`);
        } else {
            console.warn(`⚠️ CSS ${id} загружен, но стили не применены`);
        }
    }

    /**
     * Загружает все CSS файлы дизайн-систем
     */
    async loadDesignSystemsCSS() {
        const designSystems = {
            'material-design': [
                'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css'
            ],
            'bootstrap': [
                // Bootstrap уже загружен в index.html
            ],
            'ant-design': [
                // Загружаем локальный Ant Design CSS
                'antd-local.css'
            ]
        };

        console.log('🎨 Загружаю дополнительные CSS дизайн-систем...');

        for (const [system, urls] of Object.entries(designSystems)) {
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                const id = `${system}-${i + 1}`;
                await this.loadCSSFromURL(url, id);
            }
        }

        console.log('✅ Все CSS дизайн-систем загружены');
    }

    /**
     * Проверяет доступность CSS классов
     * @param {string} className - имя класса для проверки
     * @returns {boolean} - доступен ли класс
     */
    isClassAvailable(className) {
        // Создаем временный элемент для проверки
        const testElement = document.createElement('div');
        testElement.className = className;
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const hasStyles = computedStyle.getPropertyValue('display') !== 'inline' || 
                         computedStyle.getPropertyValue('background-color') !== 'rgba(0, 0, 0, 0)';
        
        document.body.removeChild(testElement);
        return hasStyles;
    }

    /**
     * Получает список доступных классов для компонента
     * @param {string} component - тип компонента (button, card, etc.)
     * @param {string} system - дизайн-система
     * @returns {Array} - список доступных классов
     */
    getAvailableClasses(component, system) {
        const classMap = {
            'material-design': {
                button: ['mdc-button', 'mdc-button--filled', 'mdc-button--outlined', 'mdc-button--text'],
                card: ['mdc-card', 'mdc-card--elevated'],
                'text-field': ['mdc-text-field', 'mdc-text-field--outlined', 'mdc-text-field--filled']
            },
            'bootstrap': {
                button: ['btn', 'btn-primary', 'btn-secondary', 'btn-success', 'btn-danger'],
                card: ['card', 'card-body', 'card-title'],
                form: ['form-control', 'form-select']
            },
            'ant-design': {
                button: ['ant-btn', 'ant-btn-primary', 'ant-btn-dashed'],
                card: ['ant-card', 'ant-card-bordered'],
                input: ['ant-input', 'ant-input-search']
            }
        };

        return classMap[system]?.[component] || [];
    }
}

// Создаем глобальный экземпляр
const cssInjector = new CSSInjector();

export default cssInjector; 