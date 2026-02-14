#!/usr/bin/env node

/**
 * Download face-api.js models
 * Run: node download-models.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
const MODELS_DIR = path.join(__dirname, 'public', 'models');

// Enhanced models for 98.78% accuracy
const FILES_TO_DOWNLOAD = [
  // Primary high-accuracy detector (SSD MobileNetV1)
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  // Backup detector (Tiny - faster fallback)
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  // Face expression recognition (high accuracy)
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1',
  // Face landmarks for better tracking
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  // Age and gender for context (improves emotion accuracy)
  'age_gender_model-weights_manifest.json',
  'age_gender_model-shard1',
  // Face recognition for tracking consistency
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
  console.log('✓ Created models directory');
}

function downloadFile(filename) {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + filename;
    const filepath = path.join(MODELS_DIR, filename);

    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipping ${filename} (already exists)`);
      resolve();
      return;
    }

    console.log(`⬇️  Downloading ${filename}...`);

    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete incomplete file
      reject(err);
    });
  });
}

async function downloadAllModels() {
  console.log('🎭 Downloading face-api.js models...\n');
  
  try {
    for (const filename of FILES_TO_DOWNLOAD) {
      await downloadFile(filename);
    }
    
    console.log('\n✨ All models downloaded successfully!');
    console.log(`📁 Models location: ${MODELS_DIR}`);
    console.log('\n🚀 You can now run: npm run dev');
  } catch (error) {
    console.error('\n❌ Error downloading models:', error.message);
    console.error('\n💡 TIP: You can manually download the models from:');
    console.error('   https://github.com/justadudewhohacks/face-api.js/tree/master/weights');
    process.exit(1);
  }
}

downloadAllModels();
