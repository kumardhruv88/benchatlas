import React, { useState } from 'react';
import styles from './Tabs.module.css';

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTabId, onChange }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  return (
    <div className={styles.tabs_container}>
      <div className={styles.tab_list} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeId === tab.id}
            className={`${styles.tab_trigger} ${activeId === tab.id ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tab_panels}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            className={`${styles.tab_panel} ${activeId === tab.id ? styles.active : ''}`}
            hidden={activeId !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
