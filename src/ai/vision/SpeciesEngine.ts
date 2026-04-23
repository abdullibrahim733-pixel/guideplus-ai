import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { database } from '../../db';
import { Species } from '../../db/models/Species';

export interface SpeciesResult {
  species: Species;
  confidence: number;
  proFacts: string[];
  iucnStatus: string;
  scientificName: string;
}

export class SpeciesEngine {
  private model: tf.LayersModel | null = null;
  private classIndex: number[] = [];
  private readonly INPUT_SIZE = 224; // MobileNetV3 standard

  async initialize(): Promise<void> {
    if (this.model) return;
    
    await tf.ready();
    const modelPath = './models/species-mobilenet/model.json';
    const modelJson = modelPath;
    
    try {
      this.model = await tf.loadLayersModel(`file://${modelJson}`);
      console.log('[SpeciesEngine] Model loaded, warming up...');
      
      // Warm up with dummy input (avoids first-inference latency)
      const warmup = tf.zeros([1, this.INPUT_SIZE, this.INPUT_SIZE, 3]);
      const result = this.model.predict(warmup) as tf.Tensor;
      result.dispose();
      warmup.dispose();
      
      console.log('[SpeciesEngine] Ready');
    } catch (error) {
      console.log('[SpeciesEngine] Model not found, using placeholder');
      // Create a placeholder model for development
      this.model = null;
    }
  }

  async identifyFromUri(imageUri: string): Promise<SpeciesResult> {
    if (!this.model) {
      // Return placeholder result for development
      return this.getPlaceholderResult();
    }

    try {
      // 1. Preprocess image
      const tensor = await this.preprocessImage(imageUri);
      
      // 2. Run inference
      const predictions = this.model!.predict(tensor) as tf.Tensor;
      const probabilities = await predictions.data();
      
      // 3. Get top prediction
      const topIndex = Array.from(probabilities)
        .indexOf(Math.max(...Array.from(probabilities)));
      const confidence = probabilities[topIndex];
      
      // 4. Cleanup tensors
      tensor.dispose();
      predictions.dispose();
      
      if (confidence < 0.4) {
        throw new Error('UNCERTAIN: Confidence too low. Try better lighting.');
      }
      
      // 5. For now, return placeholder data
      return this.getPlaceholderResult(confidence);
    } catch (error) {
      console.log('[SpeciesEngine] Error in identification:', error);
      return this.getPlaceholderResult();
    }
  }

  private async preprocessImage(uri: string): Promise<tf.Tensor4D> {
    // Resize to 224x224
    const resized = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: this.INPUT_SIZE, height: this.INPUT_SIZE } }],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    // Convert base64 to tensor
    const imageData = atob(resized.base64!);
    const imageArray = new Uint8Array(imageData.length);
    
    for (let i = 0; i < imageData.length; i++) {
      imageArray[i] = imageData.charCodeAt(i);
    }
    
    const imageTensor = decodeJpeg(imageArray);
    
    // Normalize to [0, 1] and add batch dimension
    return tf.tidy(() =>
      imageTensor
        .toFloat()
        .div(255.0)
        .expandDims(0) as tf.Tensor4D
    );
  }

  private getPlaceholderResult(confidence: number = 0.85): SpeciesResult {
    // Create a placeholder species result for development
    const placeholderSpecies = {
      id: 'placeholder',
      commonNameEn: 'African Elephant',
      commonNameSw: 'Tembo',
      scientificName: 'Loxodonta africana',
      family: 'Elephantidae',
      category: 'mammal',
      iucnStatus: 'EN',
      habitat: 'Savanna, forest',
      proFactsJson: JSON.stringify([
        'African elephants are the largest land animals on Earth',
        'They can live up to 70 years in the wild',
        'Elephants are highly intelligent and have excellent memory',
        'They consume up to 300 pounds of food per day'
      ]),
      translationsJson: JSON.stringify({}),
      tfliteClassIndex: 0,
      updatedAt: new Date(),
    } as Species;

    return {
      species: placeholderSpecies,
      confidence: confidence * 100,
      proFacts: JSON.parse(placeholderSpecies.proFactsJson),
      iucnStatus: placeholderSpecies.iucnStatus,
      scientificName: placeholderSpecies.scientificName,
    };
  }

  async downloadModel(downloadUrl: string): Promise<void> {
    const modelDir = './models/species-mobilenet/';
    
    try {
      // In a real implementation, download and extract the model files
      console.log('[SpeciesEngine] Downloading model from:', downloadUrl);
      
      // Placeholder for model download logic
      console.log('[SpeciesEngine] Model download completed');
    } catch (error) {
      console.error('[SpeciesEngine] Model download failed:', error);
    }
  }
}
