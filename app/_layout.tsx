import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { COLORS, scale } from '../../constants/theme';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: scale(22), opacity: focused ? 1 : 0.45 }}>{label}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(253,243,227,0.97)',
          borderTopColor: 'rgba(180,120,40,0.2)',
          borderTopWidth: 1,
          height: scale(64),
          paddingBottom: scale(8),
          paddingTop: scale(6),
          elevation: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textHint,
        tabBarLabelStyle: {
          fontSize: scale(9),
          letterSpacing: 1,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'जप',
          tabBarIcon: ({ focused }) => <TabIcon label="🪷" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'इतिहास',
          tabBarIcon: ({ focused }) => <TabIcon label="📿" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="streak"
        options={{
          title: 'अनुक्रम',
          tabBarIcon: ({ focused }) => <TabIcon label="🔥" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'सेटिंग',
          tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
