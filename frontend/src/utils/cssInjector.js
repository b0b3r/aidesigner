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
            return;
        }

        try {
            const response = await fetch(url);
            const cssContent = await response.text();
            this.injectCSS(cssContent, id);
        } catch (error) {
            console.error(`❌ Ошибка загрузки CSS ${url}:`, error);
        }
    }

    /**
     * Загружает все CSS файлы дизайн-систем
     */
    async loadDesignSystemsCSS() {
        const designSystems = {
            'material-design': [
                'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css',
                'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
            ],
            'bootstrap': [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
            ],
            'ant-design': [
                'https://cdn.jsdelivr.net/npm/antd@5.0.0/dist/reset.css'
            ]
        };

        console.log('🎨 Загружаю CSS дизайн-систем...');

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