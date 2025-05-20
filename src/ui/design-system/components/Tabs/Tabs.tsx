import React, { useState, useEffect } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[] | string[];
  activeTab?: number | string;
  onChange?: (tabId: number | string) => void;
  variant?: 'line' | 'enclosed' | 'pill';
  size?: 'small' | 'medium' | 'large';
  align?: 'start' | 'center' | 'end';
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab = 0,
  onChange,
  variant = 'line',
  size = 'medium',
  align = 'start',
  className = '',
  tabListClassName = '',
  tabPanelClassName = '',
}) => {
  // Determine if we're using simple string tabs or TabItem objects
  const isStringTabs = typeof tabs[0] === 'string';
  
  // State for the active tab
  const [activeTabState, setActiveTabState] = useState<number | string>(activeTab);
  
  // Update active tab if it changes externally
  useEffect(() => {
    setActiveTabState(activeTab);
  }, [activeTab]);
  
  // Handle tab click
  const handleTabClick = (tabId: number | string) => {
    setActiveTabState(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  // Style variables
  const variantClasses = {
    line: {
      list: 'border-b border-neutral-200',
      tab: 'border-b-2 border-transparent hover:border-neutral-300',
      activeTab: 'border-primary-500 text-primary-600',
    },
    enclosed: {
      list: 'border-b border-neutral-200',
      tab: 'border border-transparent rounded-t-lg border-b-0 hover:bg-neutral-50',
      activeTab: 'border-neutral-200 border-b-white bg-white text-primary-600',
    },
    pill: {
      list: 'space-x-1',
      tab: 'rounded-full hover:bg-neutral-50',
      activeTab: 'bg-primary-50 text-primary-600',
    },
  };
  
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-5 text-lg',
  };
  
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`flex ${alignClasses[align]} ${variantClasses[variant].list} ${tabListClassName}`} role="tablist">
        {isStringTabs ? (
          // Render string tabs
          (tabs as string[]).map((label, index) => (
            <button
              key={index}
              className={`
                ${sizeClasses[size]} 
                ${variantClasses[variant].tab} 
                font-medium 
                focus:outline-none 
                focus:ring-2 
                focus:ring-primary-500 
                focus:ring-opacity-50
                ${activeTabState === index ? variantClasses[variant].activeTab : 'text-neutral-600'}
                cursor-pointer
              `}
              onClick={() => handleTabClick(index)}
              role="tab"
              aria-selected={activeTabState === index}
              aria-controls={`panel-${index}`}
              id={`tab-${index}`}
              tabIndex={activeTabState === index ? 0 : -1}
            >
              {label}
            </button>
          ))
        ) : (
          // Render tab item objects
          (tabs as TabItem[]).map((item) => (
            <button
              key={item.id}
              className={`
                ${sizeClasses[size]} 
                ${variantClasses[variant].tab} 
                font-medium 
                focus:outline-none 
                focus:ring-2 
                focus:ring-primary-500 
                focus:ring-opacity-50
                ${activeTabState === item.id ? variantClasses[variant].activeTab : 'text-neutral-600'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => !item.disabled && handleTabClick(item.id)}
              role="tab"
              aria-selected={activeTabState === item.id}
              aria-disabled={item.disabled}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              tabIndex={activeTabState === item.id ? 0 : -1}
              disabled={item.disabled}
            >
              {item.label}
            </button>
          ))
        )}
      </div>
      
      {!isStringTabs && (
        <div className={`mt-4 ${tabPanelClassName}`}>
          {(tabs as TabItem[]).map((item) => (
            <div
              key={item.id}
              id={`panel-${item.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${item.id}`}
              hidden={activeTabState !== item.id}
            >
              {activeTabState === item.id && item.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};