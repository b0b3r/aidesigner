/**
 * Тестирование доступности CSS классов дизайн-систем
 */

export function testCSSClasses() {
    console.log('🧪 Тестирую доступность CSS классов...');
    
    const testClasses = {
        'Material Design': [
            'mdc-button',
            'mdc-button--raised',
            'mdc-card',
            'mdc-text-field'
        ],
        'Bootstrap': [
            'btn',
            'btn-primary',
            'card',
            'form-control'
        ],
        'Ant Design': [
            'ant-btn',
            'ant-btn-primary',
            'ant-card',
            'ant-input'
        ]
    };

    const results = {};

    for (const [system, classes] of Object.entries(testClasses)) {
        results[system] = {};
        
        for (const className of classes) {
            const testElement = document.createElement('div');
            testElement.className = className;
            testElement.style.position = 'absolute';
            testElement.style.left = '-9999px';
            testElement.style.top = '-9999px';
            
            document.body.appendChild(testElement);
            
            const computedStyle = window.getComputedStyle(testElement);
            const hasStyles = computedStyle.getPropertyValue('display') !== 'inline' || 
                             computedStyle.getPropertyValue('background-color') !== 'rgba(0, 0, 0, 0)' ||
                             computedStyle.getPropertyValue('border') !== 'none';
            
            results[system][className] = hasStyles;
            
            document.body.removeChild(testElement);
        }
    }

    // Выводим результаты
    console.log('📊 Результаты тестирования CSS классов:');
    for (const [system, classes] of Object.entries(results)) {
        console.log(`\n${system}:`);
        for (const [className, available] of Object.entries(classes)) {
            console.log(`  ${className}: ${available ? '✅' : '❌'}`);
        }
    }

    return results;
}

export function testCDNSources() {
    console.log('🌐 Тестирую CDN источники Ant Design...');
    
    const cdnSources = [
        {
            name: 'unpkg.com',
            url: 'https://unpkg.com/antd@5.0.0/dist/antd.min.css'
        },
        {
            name: 'cdnjs.cloudflare.com',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.0.0/antd.min.css'
        },
        {
            name: 'jsdelivr.net',
            url: 'https://cdn.jsdelivr.net/npm/antd@5.0.0/dist/antd.min.css'
        },
        {
            name: 'cdnjs.cloudflare.com v4',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/antd/4.24.0/antd.min.css'
        }
    ];

    const results = {};

    cdnSources.forEach((source, index) => {
        const testElement = document.createElement('div');
        testElement.className = 'ant-btn ant-btn-primary';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.top = '-9999px';
        testElement.textContent = `Test ${index + 1}`;
        
        document.body.appendChild(testElement);
        
        // Пытаемся загрузить CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = source.url;
        document.head.appendChild(link);
        
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(testElement);
            const hasStyles = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
                             computedStyle.borderRadius !== '0px' ||
                             computedStyle.padding !== '0px';
            
            results[source.name] = hasStyles;
            console.log(`${source.name}: ${hasStyles ? '✅' : '❌'}`);
            
            document.body.removeChild(testElement);
            document.head.removeChild(link);
        }, 1000);
    });

    return results;
}

export function createTestElements() {
    console.log('🎨 Создаю тестовые элементы...');
    
    const testContainer = document.createElement('div');
    testContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: white;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 300px;
    `;
    
    testContainer.innerHTML = `
        <h3 style="margin: 0 0 15px 0; font-size: 16px;">Тест CSS классов</h3>
        
        <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px;">Material Design:</h4>
            <button class="mdc-button mdc-button--raised" style="margin: 5px;">MD Button</button>
            <div class="mdc-card" style="margin: 5px; padding: 10px;">MD Card</div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px;">Bootstrap:</h4>
            <button class="btn btn-primary" style="margin: 5px;">BS Button</button>
            <div class="card" style="margin: 5px; padding: 10px;">BS Card</div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px;">Ant Design:</h4>
            <button class="ant-btn ant-btn-primary" style="margin: 5px;">AD Button</button>
            <div class="ant-card" style="margin: 5px; padding: 10px;">AD Card</div>
        </div>
        
        <button onclick="this.parentElement.remove()" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        ">Закрыть</button>
    `;
    
    document.body.appendChild(testContainer);
    
    console.log('✅ Тестовые элементы созданы');
}
