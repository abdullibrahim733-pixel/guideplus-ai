import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';

export default function ProfileScreen() {
  const { user, isAuthenticated, modelsDownloaded, isOnline, lastSyncAt } = useAppStore();

  const renderProfileInfo = () => {
    if (!isAuthenticated || !user) {
      return (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Please sign in to access your profile</Text>
          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userTier}>{user.tier.toUpperCase()}</Text>
      </View>
    );
  };

  const renderModelStatus = () => (
    <View style={styles.statusCard}>
      <Text style={styles.statusTitle}>AI Models Status</Text>
      
      <View style={styles.modelItem}>
        <Text style={styles.modelName}>Whisper (Speech-to-Text)</Text>
        <View style={[styles.statusIndicator, modelsDownloaded.whisper ? styles.statusReady : styles.statusMissing]} />
        <Text style={styles.statusText}>{modelsDownloaded.whisper ? 'Ready' : 'Not Downloaded'}</Text>
      </View>
      
      <View style={styles.modelItem}>
        <Text style={styles.modelName}>Species Vision</Text>
        <View style={[styles.statusIndicator, modelsDownloaded.species ? styles.statusReady : styles.statusMissing]} />
        <Text style={styles.statusText}>{modelsDownloaded.species ? 'Ready' : 'Not Downloaded'}</Text>
      </View>
      
      <View style={styles.modelItem}>
        <Text style={styles.modelName}>Translation Models</Text>
        <Text style={styles.statusText}>Downloaded: {Object.keys(modelsDownloaded.nmt).filter(lang => modelsDownloaded.nmt[lang]).length} languages</Text>
      </View>
    </View>
  );

  const renderSyncStatus = () => (
    <View style={styles.statusCard}>
      <Text style={styles.statusTitle}>Sync Status</Text>
      
      <View style={styles.syncItem}>
        <Text style={styles.syncLabel}>Connection:</Text>
        <Text style={[styles.syncValue, isOnline ? styles.online : styles.offline]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
      
      <View style={styles.syncItem}>
        <Text style={styles.syncLabel}>Last Sync:</Text>
        <Text style={styles.syncValue}>
          {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Never'}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.syncButton} disabled={!isOnline}>
        <Text style={styles.syncButtonText}>Sync Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsCard}>
      <Text style={styles.statusTitle}>Settings</Text>
      
      {[
        'Language Preferences',
        'Audio Settings',
        'Camera Settings',
        'Privacy & Security',
        'About GuidePlus AI',
        'Help & Support'
      ].map((setting, index) => (
        <TouchableOpacity key={index} style={styles.settingItem}>
          <Text style={styles.settingText}>{setting}</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>
      
      {renderProfileInfo()}
      {renderModelStatus()}
      {renderSyncStatus()}
      {renderSettings()}
      
      <View style={styles.footer}>
        <Text style={styles.versionText}>GuidePlus AI v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2025 VEX Mechatronics</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1F14',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginPrompt: {
    backgroundColor: '#1A3526',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginPromptText: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#1A6B3C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#1A3526',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A6B3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userTier: {
    fontSize: 14,
    color: '#D4A017',
    fontWeight: 'bold',
  },
  statusCard: {
    backgroundColor: '#1A3526',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modelName: {
    color: '#CCC',
    fontSize: 14,
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  statusReady: {
    backgroundColor: '#4CAF50',
  },
  statusMissing: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#CCC',
    fontSize: 12,
  },
  syncItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  syncLabel: {
    color: '#CCC',
    fontSize: 14,
  },
  syncValue: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  online: {
    color: '#4CAF50',
  },
  offline: {
    color: '#F44336',
  },
  syncButton: {
    backgroundColor: '#1A6B3C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingsCard: {
    backgroundColor: '#1A3526',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    color: '#CCC',
    fontSize: 14,
  },
  settingArrow: {
    color: '#666',
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  copyrightText: {
    color: '#666',
    fontSize: 10,
  },
});
