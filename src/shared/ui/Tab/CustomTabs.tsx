import React, {ReactNode} from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import styles from './CustomTabs.module.scss';

interface TabItem {
    value: string;
    label: string;
    disabled?: boolean;
    icon?: ReactNode;
}

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    tabs: TabItem[];
    children: ReactNode;
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    activationMode?: 'automatic' | 'manual';
}

export const CustomTabs: React.FC<TabsProps> = ({
                                                    defaultValue,
                                                    value,
                                                    onValueChange,
                                                    tabs,
                                                    children,
                                                    className = '',
                                                    orientation = 'horizontal',
                                                    activationMode = 'automatic',
                                                }) => {
    return (
        <Tabs.Root
            className={`${styles.Root} ${className}`}
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            orientation={orientation}
            activationMode={activationMode}
        >
            <Tabs.List className={styles.List} aria-label="Tabs navigation">
                {tabs.map((tab) => (
                    <Tabs.Trigger
                        key={tab.value}
                        className={styles.Trigger}
                        value={tab.value}
                        disabled={tab.disabled}
                    >
                        {tab.icon && <span className={styles.Icon}>{tab.icon}</span>}
                        {tab.label}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            {children}

        </Tabs.Root>
    );
};

//TODO: Нужно ли вынести в отдельный комопонет??? Если выносить, почему-то не работает
// Вспомогательный компонент для контента табов
interface TabContentProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export const TabContent: React.FC<TabContentProps> = ({
                                                          value,
                                                          children,
                                                          className = '',
                                                      }) => (
    <Tabs.Content className={`${styles.Content} ${className}`} value={value}>
        {children}
    </Tabs.Content>
);