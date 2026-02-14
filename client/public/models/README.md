# Face-API.js Models Setup

This directory should contain the pre-trained models for face-api.js face detection and expression recognition.

## Required Models

You need to download the following models from the face-api.js repository:

1. **tiny_face_detector_model-weights_manifest.json**
2. **tiny_face_detector_model-shard1**
3. **face_expression_model-weights_manifest.json**
4. **face_expression_model-shard1**

## Download Instructions

### Option 1: Direct Download (Recommended)

Download the models from the official repository:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Place the following files in this `public/models` folder:
- From `tiny_face_detector`: Copy all files
- From `face_expression`: Copy all files

### Option 2: Using npm (after installing face-api.js)

Run this command from the `client` directory:

```bash
# Windows PowerShell
xcopy /E /I node_modules\face-api.js\weights public\models

# macOS/Linux
cp -r node_modules/face-api.js/weights/* public/models/
```

### Option 3: Manual wget (if available)

```bash
cd public/models

# Tiny Face Detector
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Face Expression
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1
```

## Verification

After downloading, verify you have these files:
```
public/
  models/
    tiny_face_detector_model-weights_manifest.json
    tiny_face_detector_model-shard1
    face_expression_model-weights_manifest.json
    face_expression_model-shard1
```

## File Size Reference
- tiny_face_detector files: ~1.2 MB total
- face_expression files: ~340 KB total

## Troubleshooting

If the mood detection page shows "Failed to load face detection models":
1. Verify all model files are in the correct location
2. Check the browser console for specific loading errors
3. Ensure your dev server is running (`npm run dev`)
4. Try clearing browser cache and reloading

## License
These models are from face-api.js and are MIT licensed.
