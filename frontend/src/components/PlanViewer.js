import React, { useState } from 'react';
import './PlanViewer.css';

/**
 * PlanViewer - компонент для отображения и управления планами выполнения
 */
function PlanViewer({ plan, onExecuteStep, onEditStep, onCancelPlan, className = '' }) {
  const [expandedSteps, setExpandedSteps] = useState(new Set([1])); // Первый шаг развернут по умолчанию

  const toggleStepExpanded = (stepId) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStepStatus = (step) => {
    const isCompleted = plan.completedSteps?.some(completed => completed.stepId === step.id);
    const isCurrent = plan.currentStep === step.id - 1;
    const isReady = step.id <= (plan.currentStep || 0) + 1;

    if (isCompleted) return 'completed';
    if (isCurrent) return 'current';
    if (isReady) return 'ready';
    return 'pending';
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'current': return '🔄';
      case 'ready': return '⏳';
      default: return '⭕';
    }
  };

  const getProgressPercentage = () => {
    if (!plan.steps || plan.steps.length === 0) return 0;
    return Math.round((plan.completedSteps?.length || 0) / plan.steps.length * 100);
  };

  if (!plan) return null;

  return (
    <div className={`plan-viewer ${className}`}>
      {/* Заголовок плана */}
      <div className="plan-header">
        <div className="plan-title-section">
          <h3 className="plan-title">{plan.plan_title}</h3>
          <p className="plan-description">{plan.description}</p>
        </div>
        
        <div className="plan-controls">
          <button 
            className="plan-cancel-btn"
            onClick={() => onCancelPlan?.(plan.id)}
            title="Отменить план"
          >
            ❌
          </button>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div className="plan-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <span className="progress-text">
          {plan.completedSteps?.length || 0} из {plan.steps?.length || 0} шагов
          ({getProgressPercentage()}%)
        </span>
      </div>

      {/* Список шагов */}
      <div className="plan-steps">
        {plan.steps?.map((step, index) => {
          const status = getStepStatus(step);
          const isExpanded = expandedSteps.has(step.id);
          const stepResult = plan.completedSteps?.find(completed => completed.stepId === step.id);

          return (
            <div key={step.id} className={`plan-step plan-step--${status}`}>
              {/* Заголовок шага */}
              <div 
                className="plan-step-header"
                onClick={() => toggleStepExpanded(step.id)}
              >
                <div className="step-status-icon">
                  {getStepIcon(status)}
                </div>
                
                <div className="step-info">
                  <h4 className="step-title">
                    {step.id}. {step.title}
                  </h4>
                  <span className="step-time">{step.estimated_time}</span>
                </div>

                <div className="step-controls">
                  {status === 'ready' && (
                    <button
                      className="step-execute-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExecuteStep?.(step);
                      }}
                    >
                      ▶️ Выполнить
                    </button>
                  )}
                  
                  <button className="step-expand-btn">
                    {isExpanded ? '▼' : '▶'}
                  </button>
                </div>
              </div>

              {/* Детали шага */}
              {isExpanded && (
                <div className="plan-step-details">
                  <p className="step-description">{step.description}</p>
                  
                  {step.dependencies && step.dependencies.length > 0 && (
                    <div className="step-dependencies">
                      <strong>Зависимости:</strong> Шаги {step.dependencies.join(', ')}
                    </div>
                  )}

                  {stepResult && stepResult.success && (
                    <div className="step-result">
                      <div className="result-header">
                        <strong>✅ Результат выполнения:</strong>
                        <span className="result-time">
                          {new Date(stepResult.executedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      {stepResult.textContent && (
                        <div className="result-text">{stepResult.textContent}</div>
                      )}
                    </div>
                  )}

                  {stepResult && !stepResult.success && (
                    <div className="step-error">
                      <strong>❌ Ошибка:</strong> {stepResult.error}
                      <button
                        className="retry-step-btn"
                        onClick={() => onExecuteStep?.(step)}
                      >
                        🔄 Повторить
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Статус плана */}
      <div className="plan-footer">
        <div className="plan-status">
          Статус: <span className={`status-badge status-${plan.status}`}>
            {plan.status === 'pending' && '⏳ Ожидает'}
            {plan.status === 'executing' && '🔄 Выполняется'}
            {plan.status === 'completed' && '✅ Завершен'}
            {plan.status === 'cancelled' && '❌ Отменен'}
          </span>
        </div>
        
        <div className="plan-created">
          Создан: {new Date(plan.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default PlanViewer;