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
        console.log(`🔍 Проверяю применение CSS: ${id}`);
        
        // Проверяем разные классы в зависимости от системы
        const testClasses = {
            'material-design': ['mdc-button', 'mdc-card', 'mdc-text-field'],
            'bootstrap': ['btn', 'card'],
            'ant-design': ['ant-btn', 'ant-card']
        };
        
        const systemName = id.split('-')[0] + '-' + id.split('-')[1];
        const classesToTest = testClasses[systemName] || ['mdc-button'];
        
        let hasAnyStyles = false;
        
        classesToTest.forEach(className => {
            const testElement = document.createElement('div');
            testElement.className = className;
            testElement.style.position = 'absolute';
            testElement.style.left = '-9999px';
            testElement.style.top = '-9999px';
            testElement.textContent = 'Test';
            
            document.body.appendChild(testElement);
            
            const computedStyle = window.getComputedStyle(testElement);
            const hasStyles = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
                             computedStyle.borderRadius !== '0px' ||
                             computedStyle.padding !== '0px' ||
                             computedStyle.display !== 'block';
            
            document.body.removeChild(testElement);
            
            if (hasStyles) {
                console.log(`✅ Класс ${className} работает корректно`);
                hasAnyStyles = true;
            } else {
                console.warn(`⚠️ Класс ${className} не имеет стилей`);
            }
        });
        
        if (hasAnyStyles) {
            console.log(`✅ CSS ${id} успешно применен`);
        } else {
            console.warn(`❌ CSS ${id} загружен, но НИ ОДИН класс не работает!`);
        }
    }

    /**
     * Загружает все CSS файлы дизайн-систем
     */
    async loadDesignSystemsCSS() {
        console.log('🎨 Начинаю загрузку CSS дизайн-систем...');
        
        // Проверяем, что уже загружено в index.html
        const existingLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        console.log('📋 Уже загруженные CSS файлы в index.html:', existingLinks.map(link => link.href));
        
        const designSystems = {
            'material-design': [
                'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css'
            ]
            // Удалены Bootstrap и Ant Design - используем только Material Design
        };

        console.log('📦 Дополнительные CSS для загрузки:', designSystems);

        for (const [system, urls] of Object.entries(designSystems)) {
            console.log(`🔄 Обрабатываю систему: ${system}`);
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                const id = `${system}-${i + 1}`;
                console.log(`⬇️ Загружаю: ${url} (ID: ${id})`);
                await this.loadCSSFromURL(url, id);
            }
        }

        console.log('✅ Все CSS дизайн-систем загружены');
        
        // Дополнительная проверка доступности ключевых классов
        this.testMaterialDesignClasses();
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
                button: ['mdc-button', 'mdc-button--raised', 'mdc-button--outlined', 'mdc-button--unelevated'],
                card: ['mdc-card', 'mdc-card--elevated'],
                'text-field': ['mdc-text-field', 'mdc-text-field--outlined', 'mdc-text-field--filled'],
                chip: ['mdc-chip', 'mdc-chip--selected'],
                'top-app-bar': ['mdc-top-app-bar'],
                list: ['mdc-list', 'mdc-list-item'],
                dialog: ['mdc-dialog', 'mdc-dialog__container'],
                select: ['mdc-select', 'mdc-select--outlined'],
                checkbox: ['mdc-checkbox'],
                'radio-button': ['mdc-radio'],
                switch: ['mdc-switch'],
                slider: ['mdc-slider'],
                'linear-progress': ['mdc-linear-progress'],
                snackbar: ['mdc-snackbar'],
                tooltip: ['mdc-tooltip'],
                menu: ['mdc-menu', 'mdc-menu-surface'],
                drawer: ['mdc-drawer'],
                'bottom-navigation': ['mdc-tab-bar'],
                'data-table': ['mdc-data-table', 'mdc-data-table__table'],
                'image-list': ['mdc-image-list'],
                'layout-grid': ['mdc-layout-grid'],
                ripple: ['mdc-ripple-surface'],
                'form-field': ['mdc-form-field'],
                icons: ['material-icons', 'material-icons-outlined']
            }
        };

        return classMap[system]?.[component] || [];
    }

    /**
     * Инжектирует дизайн-токены в элемент артефакта
     * @param {HTMLElement} element - элемент, в который нужно инжектировать токены
     */
    injectDesignTokensToElement(element) {
        if (!element) {
            console.warn('⚠️ Элемент для инъекции токенов не найден');
            return;
        }

        // Проверяем, есть ли уже стили токенов
        if (element.querySelector('#design-tokens-style')) {
            console.log('🎨 Дизайн-токены уже инжектированы в элемент');
            return;
        }

        const tokensCSS = `
        * {
            --mdc-theme-primary: #6200ee !important;
            --mdc-theme-on-primary: #ffffff !important;
            --mdc-theme-secondary: #018786 !important;
            --mdc-theme-on-secondary: #ffffff !important;
            --mdc-theme-surface: #ffffff !important;
            --mdc-theme-background: #ffffff !important;
            --mdc-theme-on-surface: #000000 !important;
            --mdc-theme-error: #b00020 !important;
            --mdc-theme-on-error: #ffffff !important;
            --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87) !important;
            --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54) !important;
            --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38) !important;
            --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38) !important;
        }
        `;

        const style = document.createElement('style');
        style.id = 'design-tokens-style';
        style.textContent = tokensCSS;
        
        // Добавляем в начало элемента
        element.insertBefore(style, element.firstChild);
        
        console.log('🎨 Дизайн-токены инжектированы в артефакт');
    }

    /**
     * Инжектирует дизайн-токены прямо в HTML содержимое
     * @param {string} htmlContent - HTML содержимое
     * @returns {string} - HTML с инжектированными токенами
     */
    injectDesignTokensToHTML(htmlContent) {
        // Определяем значения токенов (закомментировано - не используется)
        // const tokens = {
        //     '--mdc-theme-primary': '#6200ee',
        //     '--mdc-theme-on-primary': '#ffffff',
        //     '--mdc-theme-primary-variant': '#3700b3',
        //     '--mdc-theme-secondary': '#018786',
        //     '--mdc-theme-on-secondary': '#ffffff',
        //     '--mdc-theme-secondary-variant': '#018786',
        //     '--mdc-theme-surface': '#ffffff',
        //     '--mdc-theme-on-surface': '#000000',
        //     '--mdc-theme-background': '#f5f5f5',
        //     '--mdc-theme-on-background': '#000000',
        //     '--mdc-theme-error': '#b00020',
        //     '--mdc-theme-on-error': '#ffffff',
        //     '--mdc-theme-text-primary-on-background': 'rgba(0, 0, 0, 0.87)',
        //     '--mdc-theme-text-secondary-on-background': 'rgba(0, 0, 0, 0.54)',
        //     '--mdc-theme-text-hint-on-background': 'rgba(0, 0, 0, 0.38)',
        //     '--mdc-theme-text-disabled-on-background': 'rgba(0, 0, 0, 0.38)',
        //     '--mdc-theme-text-icon-on-background': 'rgba(0, 0, 0, 0.38)',
        //     '--mdc-theme-text-primary-on-light': 'rgba(0, 0, 0, 0.87)',
        //     '--mdc-theme-text-secondary-on-light': 'rgba(0, 0, 0, 0.54)',
        //     '--mdc-theme-text-hint-on-light': 'rgba(0, 0, 0, 0.38)',
        //     '--mdc-theme-text-disabled-on-light': 'rgba(0, 0, 0, 0.38)',
        //     '--mdc-theme-text-primary-on-dark': 'rgba(255, 255, 255, 1)',
        //     '--mdc-theme-text-secondary-on-dark': 'rgba(255, 255, 255, 0.7)',
        //     '--mdc-theme-text-hint-on-dark': 'rgba(255, 255, 255, 0.5)',
        //     '--mdc-theme-text-disabled-on-dark': 'rgba(255, 255, 255, 0.5)',
        //     '--mdc-theme-shadow': 'rgba(0, 0, 0, 0.2)'
        // };
        
        console.log('🎨 CSS переменные уже доступны через CanvasFlow.js inline стили');
        console.log('⚡ Пропускаем добавление дублирующего <style> блока');
        
        // Возвращаем HTML как есть - CSS переменные уже прокинуты через CanvasFlow.js
        return htmlContent;
    }

    /**
     * Инжектирует дизайн-токены во все артефакты на странице
     */
    injectDesignTokensToAllArtifacts() {
        // Ищем контейнеры с HTML содержимым артефактов
        const artifactContainers = document.querySelectorAll('[data-artifact-id]');
        const reactFlowNodes = document.querySelectorAll('.react-flow__node');
        const nodeContents = document.querySelectorAll('.react-flow__node [dangerouslySetInnerHTML], .react-flow__node .node-content');
        
        console.log(`🎨 Найдено контейнеров артефактов: ${artifactContainers.length}`);
        console.log(`🎨 Найдено React Flow узлов: ${reactFlowNodes.length}`);
        console.log(`🎨 Найдено контейнеров с содержимым: ${nodeContents.length}`);
        
        // Инжектируем в контейнеры артефактов
        artifactContainers.forEach((container, index) => {
            console.log(`🎨 Обрабатываю контейнер артефакта ${index + 1}/${artifactContainers.length}`);
            this.injectDesignTokensToElement(container);
        });
        
        // Инжектируем в React Flow узлы
        reactFlowNodes.forEach((node, index) => {
            console.log(`🎨 Обрабатываю React Flow узел ${index + 1}/${reactFlowNodes.length}`);
            this.injectDesignTokensToElement(node);
            
            // Также инжектируем в дочерние элементы с содержимым
            const contentElements = node.querySelectorAll('div[style*="dangerouslySetInnerHTML"], .node-content, [data-element-id]');
            contentElements.forEach((contentEl, contentIndex) => {
                console.log(`🎨 Инжектируем в содержимое узла ${index + 1}, элемент ${contentIndex + 1}`);
                this.injectDesignTokensToElement(contentEl);
            });
        });
    }

    /**
     * Тестирует ключевые классы Material Design
     */
    testMaterialDesignClasses() {
        console.log('🧪 Тестирую ключевые классы Material Design...');
        
        const criticalClasses = [
            'mdc-button',
            'mdc-button--raised',
            'mdc-card',
            'mdc-text-field',
            'mdc-text-field--outlined',
            'mdc-chip',
            'material-icons'
        ];
        
        const results = {};
        
        criticalClasses.forEach(className => {
            const testElement = document.createElement('div');
            testElement.className = className;
            testElement.style.position = 'absolute';
            testElement.style.left = '-9999px';
            testElement.style.top = '-9999px';
            
            document.body.appendChild(testElement);
            
            const computedStyle = window.getComputedStyle(testElement);
            const hasStyles = 
                computedStyle.display !== 'inline' ||
                computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
                computedStyle.borderRadius !== '0px' ||
                computedStyle.padding !== '0px' ||
                computedStyle.fontFamily !== 'serif' ||
                computedStyle.fontSize !== '16px';
            
            document.body.removeChild(testElement);
            
            results[className] = hasStyles;
            
            if (hasStyles) {
                console.log(`✅ ${className} — стили применены`);
            } else {
                console.warn(`❌ ${className} — стили НЕ применены`);
            }
        });
        
        const workingClasses = Object.values(results).filter(Boolean).length;
        const totalClasses = criticalClasses.length;
        
        console.log(`📊 Результат тестирования: ${workingClasses}/${totalClasses} классов работают`);
        
        if (workingClasses === 0) {
            console.error('🚨 КРИТИЧЕСКАЯ ОШИБКА: НИ ОДИН класс Material Design не работает!');
        } else if (workingClasses < totalClasses) {
            console.warn(`⚠️ Частичная загрузка: работает только ${workingClasses} из ${totalClasses} классов`);
        } else {
            console.log('🎉 Все ключевые классы Material Design работают корректно!');
        }
        
        return results;
    }
}

// Создаем глобальный экземпляр
const cssInjector = new CSSInjector();

// Делаем доступным в консоли браузера для отладки
if (typeof window !== 'undefined') {
    window.cssInjector = cssInjector;
    window.testMaterialDesign = () => cssInjector.testMaterialDesignClasses();
    console.log('🔧 Доступно в консоли: window.cssInjector и window.testMaterialDesign()');
}

export default cssInjector; 