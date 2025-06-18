import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { useClientOnlyValue } from '../../components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,

        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,}}/>
      <Tabs.Screen name="tickets/index" options={{ title: 'Mes Tickets', tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,}}/>
      <Tabs.Screen name="tickets/create" options={{ title: 'Créer', tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,}}/>
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />, }}/>
    </Tabs>
  );
}
