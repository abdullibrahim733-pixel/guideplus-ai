import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { database } from '../../src/db';
import { ParkFee } from '../../src/db/models/ParkFee';
import { EmergencyContact } from '../../src/db/models/EmergencyContact';

type TabType = 'fees' | 'contacts' | 'checklist';

export default function BriefcaseScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('fees');

  // Mock data for demonstration - in production, this would come from the database
  const mockParkFees = [
    {
      parkName: 'Serengeti National Park',
      authority: 'TANAPA',
      visitorCategory: 'Adult Non-Resident',
      residentUsd: 0,
      nonresidentUsd: 70,
      vehicleFeeUsd: 40,
      validFrom: new Date('2024-01-01'),
      notes: 'Valid for 24 hours'
    },
    {
      parkName: 'Ngorongoro Crater',
      authority: 'NCAA',
      visitorCategory: 'Adult Non-Resident',
      residentUsd: 0,
      nonresidentUsd: 71,
      vehicleFeeUsd: 295,
      validFrom: new Date('2024-01-01'),
      notes: 'Crater descent fee included'
    },
  ];

  const mockEmergencyContacts = [
    {
      name: 'Serengeti Park Headquarters',
      category: 'ranger',
      phonePrimary: '+255 284 520 034',
      phoneSecondary: '+255 754 460 490',
      location: 'Seronera',
      notes: '24/7 emergency response'
    },
    {
      name: 'Flying Medical Service',
      category: 'medical',
      phonePrimary: '+255 754 333 111',
      phoneSecondary: '',
      location: 'Arusha',
      notes: 'Air ambulance service'
    },
    {
      name: 'Tanzania Police Emergency',
      category: 'police',
      phonePrimary: '999',
      phoneSecondary: '112',
      location: 'Nationwide',
      notes: 'General emergency number'
    },
  ];

  const renderParkFees = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Current Park Fees</Text>
      {mockParkFees.map((fee, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{fee.parkName}</Text>
          <Text style={styles.cardSubtitle}>{fee.authority}</Text>
          
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Adult (Non-Resident):</Text>
            <Text style={styles.feeValue}>${fee.nonresidentUsd}</Text>
          </View>
          
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Vehicle Fee:</Text>
            <Text style={styles.feeValue}>${fee.vehicleFeeUsd}</Text>
          </View>
          
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Valid From:</Text>
            <Text style={styles.feeValue}>{fee.validFrom.toLocaleDateString()}</Text>
          </View>
          
          {fee.notes && (
            <Text style={styles.notes}>{fee.notes}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderEmergencyContacts = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Emergency Contacts</Text>
      {mockEmergencyContacts.map((contact, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.card}
          onPress={() => {
            Alert.alert(
              `${contact.name}`,
              `Call: ${contact.phonePrimary}\n${contact.phoneSecondary ? `Alt: ${contact.phoneSecondary}` : ''}`,
              [
                { text: 'Call Primary', onPress: () => console.log(`Calling ${contact.phonePrimary}`) },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }}
        >
          <View style={styles.contactHeader}>
            <Text style={styles.cardTitle}>{contact.name}</Text>
            <View style={[styles.categoryBadge, getCategoryStyle(contact.category)]}>
              <Text style={styles.categoryText}>{contact.category.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.phonePrimary}>{contact.phonePrimary}</Text>
          {contact.phoneSecondary && (
            <Text style={styles.phoneSecondary}>{contact.phoneSecondary}</Text>
          )}
          
          <Text style={styles.location}>{contact.location}</Text>
          {contact.notes && (
            <Text style={styles.notes}>{contact.notes}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderVehicleChecklist = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionTitle}>Vehicle Checklist</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Vehicle Check</Text>
        <Text style={styles.checklistSubtitle}>Complete before each safari departure</Text>
        
        {[
          'Check tire pressure and condition',
          'Test headlights and brake lights',
          'Verify fuel level (minimum 1/2 tank)',
          'Check oil and coolant levels',
          'Test horn and windshield wipers',
          'Ensure spare tire is properly inflated',
          'Check first aid kit supplies',
          'Verify radio communication equipment',
          'Test emergency brake functionality',
          'Inspect seat belts and child locks'
        ].map((item, index) => (
          <View key={index} style={styles.checklistItem}>
            <TouchableOpacity style={styles.checkbox}>
              <View style={styles.checkboxInner} />
            </TouchableOpacity>
            <Text style={styles.checklistText}>{item}</Text>
          </View>
        ))}
        
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Mark Checklist Complete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, any> = {
      medical: { backgroundColor: '#F44336' },
      ranger: { backgroundColor: '#4CAF50' },
      police: { backgroundColor: '#2196F3' },
      evac: { backgroundColor: '#FF9800' },
    };
    return styles[category] || { backgroundColor: '#666' };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digital Briefcase</Text>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'fees' as TabType, label: 'Park Fees', icon: '💰' },
          { key: 'contacts' as TabType, label: 'Emergency', icon: '🚨' },
          { key: 'checklist' as TabType, label: 'Vehicle', icon: '🚗' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'fees' && renderParkFees()}
      {activeTab === 'contacts' && renderEmergencyContacts()}
      {activeTab === 'checklist' && renderVehicleChecklist()}
    </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A3526',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#1A6B3C',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    color: '#CCC',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1A3526',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9CDCFE',
    marginBottom: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeLabel: {
    color: '#CCC',
    fontSize: 14,
  },
  feeValue: {
    color: '#D4A017',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  phonePrimary: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phoneSecondary: {
    color: '#9CDCFE',
    fontSize: 14,
    marginBottom: 4,
  },
  location: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 4,
  },
  notes: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  checklistSubtitle: {
    color: '#9CDCFE',
    fontSize: 14,
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D4A017',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  checklistText: {
    color: '#CCC',
    fontSize: 14,
    flex: 1,
  },
  completeButton: {
    backgroundColor: '#1A6B3C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
