// Пример использования компонента
import {CustomTabs, TabContent} from './CustomTabs';
import {PersonIcon, LockClosedIcon} from '@radix-ui/react-icons';

export const TestCustomTabs = () => {
    const tabs = [
        {value: 'account', label: 'Account', icon: <PersonIcon/>},
        {value: 'password', label: 'Password', icon: <LockClosedIcon/>},
        {value: 'settings', label: 'Settings', disabled: true},
    ];

    return (
        <>
            <h2>Primary Tabs</h2>
            <CustomTabs
                defaultValue="account"
                tabs={tabs}
                className="my-custom-tabs"
                variant={"primary"}
            >
                <TabContent value="account">
                    <div>
                        <h3>Account Settings</h3>
                        <p>Make changes to your account here.</p>
                        {/* Кастомный контент для вкладки Account */}
                    </div>
                </TabContent>

                <TabContent value="password">
                    <div>
                        <h3>Password Settings</h3>
                        <p>Change your password here.</p>
                        {/* Кастомный контент для вкладки Password */}
                    </div>
                </TabContent>

                <TabContent value="settings">
                    <div>
                        <h3>Settings</h3>
                        <p>This tab is disabled for now.</p>
                    </div>
                </TabContent>
            </CustomTabs>

            <h2>Secondary Tabs</h2>
            <CustomTabs
                defaultValue="account"
                tabs={tabs}
                className="my-custom-tabs"
                variant={"secondary"}
            >
                <TabContent value="account">
                    <div>
                        <h3>Account Settings</h3>
                        <p>Make changes to your account here.</p>
                        {/* Кастомный контент для вкладки Account */}
                    </div>
                </TabContent>

                <TabContent value="password">
                    <div>
                        <h3>Password Settings</h3>
                        <p>Change your password here.</p>
                        {/* Кастомный контент для вкладки Password */}
                    </div>
                </TabContent>

                <TabContent value="settings">
                    <div>
                        <h3>Settings</h3>
                        <p>This tab is disabled for now.</p>
                    </div>
                </TabContent>
            </CustomTabs>
        </>
    );
};