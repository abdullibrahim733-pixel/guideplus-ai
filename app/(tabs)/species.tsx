import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SpeciesEngine, SpeciesResult } from '../../src/ai/vision/SpeciesEngine';
import { useSpeciesStore } from '../../src/store/useSpeciesStore';

const speciesEngine = new SpeciesEngine();

export default function SpeciesScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const {
    isIdentifying,
    lastResult,
    setIdentifying,
    setLastResult,
    addToRecent
  } = useSpeciesStore();

  const handleImageCapture = useCallback(async (useCamera: boolean) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setLastResult(null); // Clear previous result
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  }, [setLastResult]);

  const handleIdentify = useCallback(async () => {
    if (!selectedImage) return;

    setIdentifying(true);
    try {
      const result = await speciesEngine.identifyFromUri(selectedImage);
      setLastResult(result);
      
      // Add to recent identifications
      addToRecent({
        species: result.species,
        confidence: result.confidence,
        imageUri: selectedImage,
        timestamp: Date.now()
      });
    } catch (error: any) {
      Alert.alert('Identification Failed', error.message);
    } finally {
      setIdentifying(false);
    }
  }, [selectedImage, setIdentifying, setLastResult, addToRecent]);

  const renderIUCNBadge = (status: string) => {
    const colors: Record<string, string> = {
      'LC': '#4CAF50', // Least Concern - Green
      'NT': '#FFC107', // Near Threatened - Yellow
      'VU': '#FF9800', // Vulnerable - Orange
      'EN': '#F44336', // Endangered - Red
      'CR': '#9C27B0', // Critically Endangered - Purple
      'EX': '#000000', // Extinct - Black
    };

    return (
      <View style={[styles.iucnBadge, { backgroundColor: colors[status] || '#666' }]}>
        <Text style={styles.iucnText}>{status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Species Vision</Text>
      
      {/* Image Selection */}
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Select an image to identify</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleImageCapture(false)}
        >
          <Text style={styles.buttonText}>📷 Choose Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, !selectedImage && styles.disabledButton]}
          onPress={handleIdentify}
          disabled={!selectedImage || isIdentifying}
        >
          <Text style={styles.buttonText}>
            {isIdentifying ? '🔍 Identifying...' : '🔍 Identify Species'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {lastResult && (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.speciesName}>{lastResult.species.commonNameEn}</Text>
            <Text style={styles.scientificName}>{lastResult.scientificName}</Text>
            {renderIUCNBadge(lastResult.iucnStatus)}
          </View>
          
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceText}>
              Confidence: {lastResult.confidence.toFixed(1)}%
            </Text>
          </View>

          <View style={styles.factsContainer}>
            <Text style={styles.factsTitle}>Pro Facts:</Text>
            {lastResult.proFacts.map((fact, index) => (
              <Text key={index} style={styles.factItem}>• {fact}</Text>
            ))}
          </View>
        </View>
      )}
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
  imageContainer: {
    backgroundColor: '#1A3526',
    borderRadius: 16,
    height: 200,
    marginBottom: 20,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#1A6B3C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#D4A017',
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#1A3526',
    borderRadius: 16,
    padding: 20,
  },
  resultHeader: {
    marginBottom: 16,
  },
  speciesName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    color: '#9CDCFE',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  iucnBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  iucnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidenceContainer: {
    marginBottom: 16,
  },
  confidenceText: {
    color: '#D4A017',
    fontSize: 16,
    fontWeight: 'bold',
  },
  factsContainer: {
    marginTop: 16,
  },
  factsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  factItem: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 4,
  },
});
