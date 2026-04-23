import { Audio } from 'expo-av';

export class AudioRecorder {
  private recording: Audio.Recording | null = null;

  async startRecording(): Promise<void> {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false, // Android only
      playsInSilentModeIOS: false,
    });

    this.recording = new Audio.Recording();
    await this.recording.prepareToRecordAsync({
      android: {
        extension: '.wav',
        outputFormat: Audio.AndroidOutputFormat.DEFAULT,
        audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
        sampleRate: 16000, // Whisper requires 16kHz
        numberOfChannels: 1, // Mono
        bitRate: 128000,
      },
      ios: { 
        extension: '.wav',
        audioQuality: Audio.IOSAudioQuality.HIGH,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 128000,
      }, // placeholder
      web: {},
    });
    await this.recording.startAsync();
  }

  async stopRecording(): Promise<string> {
    if (!this.recording) throw new Error('No active recording');
    
    await this.recording.stopAndUnloadAsync();
    const uri = this.recording.getURI()!;
    this.recording = null;
    return uri; // Returns local file path to .wav
  }

  async cleanup(): Promise<void> {
    if (this.recording) {
      await this.recording.stopAndUnloadAsync();
      this.recording = null;
    }
  }
}
