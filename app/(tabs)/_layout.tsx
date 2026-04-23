import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';

export default function TabLayout() {
  const { isOnline } = useAppStore();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1A3526',
          borderTopColor: '#333',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#D4A017',
        tabBarInactiveTintColor: '#CCC',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#0D1F14',
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="translate"
        options={{
          title: 'Translate',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🎤</Text>
          ),
          headerRight: () => (
            <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }]} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="species"
        options={{
          title: 'Species ID',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>🦁</Text>
          ),
        }}
      />
      
      <Tabs.Screen
        name="briefcase"
        options={{
          title: 'Briefcase',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💼</Text>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 16,
  },
});
