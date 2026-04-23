import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AudioRecorder } from '../../src/ai/whisper/AudioRecorder';
import { WhisperEngine } from '../../src/ai/whisper/WhisperEngine';
import { useTranslationStore } from '../../src/store/useTranslationStore';

const recorder = new AudioRecorder();
const whisper = new WhisperEngine();

const LANGUAGES: { code: string; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  // ... add all 15
];

export default function TranslateScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [stage, setStage] = useState('');
  
  const {
    isProcessing,
    originalText,
    translatedText,
    selectedLang,
    setRecording,
    setProcessing,
    setOriginalText,
    setTranslatedText,
    setSelectedLang,
    setStage: setStoreStage,
    addToHistory
  } = useTranslationStore();

  const handleRecord = useCallback(async () => {
    if (isRecording) {
      // Stop recording and process
      setIsRecording(false);
      setRecording(false);
      setProcessing(true);
      setStoreStage('Transcribing Swahili...');
      
      try {
        const audioUri = await recorder.stopRecording();
        const swahiliText = await whisper.transcribe(audioUri);
        setOriginalText(swahiliText);
        setStoreStage(`Translating to ${selectedLang}...`);
        
        // Placeholder translation - in production, use NMT engine
        const translated = `[Translated from Swahili to ${selectedLang}: ${swahiliText}]`;
        setTranslatedText(translated);
        setStoreStage('');
        
        // Add to history
        addToHistory({
          originalText: swahiliText,
          translatedText: translated,
          sourceLang: 'sw',
          targetLang: selectedLang,
          timestamp: Date.now()
        });
      } catch (err: any) {
        setStoreStage('Error: ' + err.message);
      } finally {
        setProcessing(false);
      }
    } else {
      await recorder.startRecording();
      setIsRecording(true);
      setRecording(true);
      setOriginalText('');
      setTranslatedText('');
      setStoreStage('');
    }
  }, [isRecording, selectedLang, setRecording, setProcessing, setOriginalText, setTranslatedText, setSelectedLang, setStoreStage, addToHistory]);

  return (
    <View style={styles.container}>
      {/* Language Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.langScroll}
      >
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langChip, selectedLang === lang.code && styles.langChipActive]}
            onPress={() => setSelectedLang(lang.code)}
          >
            <Text style={styles.langFlag}>{lang.flag}</Text>
            <Text style={styles.langLabel}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Translation Result */}
      <View style={styles.resultCard}>
        {originalText ? (
          <>
            <Text style={styles.originalText}>{originalText}</Text>
            <Text style={styles.divider}>▼</Text>
            <Text style={styles.translatedText}>{translatedText}</Text>
          </>
        ) : (
          <Text style={styles.placeholder}>
            Press the microphone and speak in Swahili
          </Text>
        )}
      </View>

      {/* Status */}
      {stage ? <Text style={styles.stage}>{stage}</Text> : null}

      {/* Record Button */}
      <TouchableOpacity
        style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
        onPress={handleRecord}
        disabled={isProcessing}
      >
        <Text style={styles.recordIcon}>
          {isRecording ? '⏹' : isProcessing ? '⏳' : '🎙'}
        </Text>
        <Text style={styles.recordLabel}>
          {isRecording ? 'Tap to Translate' : isProcessing ? 'Processing...' : 'Hold & Speak'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0D1F14', 
    padding: 16 
  },
  langScroll: { 
    maxHeight: 60, 
    marginBottom: 16 
  },
  langChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A3526',
    borderRadius: 20, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    marginRight: 8 
  },
  langChipActive: { 
    backgroundColor: '#1A6B3C' 
  },
  langFlag: { 
    fontSize: 16, 
    marginRight: 4 
  },
  langLabel: { 
    color: '#FFF', 
    fontSize: 12 
  },
  resultCard: { 
    flex: 1, 
    backgroundColor: '#1A3526', 
    borderRadius: 16,
    padding: 20, 
    marginBottom: 16 
  },
  originalText: { 
    color: '#9CDCFE', 
    fontSize: 16, 
    marginBottom: 12 
  },
  divider: { 
    color: '#D4A017', 
    fontSize: 20, 
    textAlign: 'center', 
    marginBottom: 12 
  },
  translatedText: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  placeholder: { 
    color: '#666', 
    fontSize: 16, 
    textAlign: 'center', 
    marginTop: 40 
  },
  stage: { 
    color: '#D4A017', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  recordBtn: { 
    backgroundColor: '#1A6B3C', 
    borderRadius: 40, 
    padding: 20,
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },
  recordBtnActive: { 
    backgroundColor: '#C0392B' 
  },
  recordIcon: { 
    fontSize: 28, 
    marginRight: 12 
  },
  recordLabel: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
