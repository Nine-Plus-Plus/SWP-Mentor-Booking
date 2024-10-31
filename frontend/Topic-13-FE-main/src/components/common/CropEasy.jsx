import React, { useState } from 'react';
import { DialogContent, DialogActions, Box, Typography, Slider, Button } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { Crop as CropIcon } from '@mui/icons-material';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage.jsx';

export const CropEasy = ({ photoURL, setOpenCrop, setPhotoURL, setFile }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    setLoading(true);
    try {
      const { file, url } = await getCroppedImg(photoURL, croppedAreaPixels, rotation);
      setPhotoURL(url);
      setFile(file);
      setOpenCrop(false);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setLoading(false); // Ensure loading is set to false in both success and error cases
    }
  };

  const zoomPercent = value => `${Math.round(value * 100)}%`;

  return (
    <>
      <DialogContent
        dividers
        sx={{
          background: '#333',
          position: 'relative',
          height: 400,
          width: 'auto',
          minWidth: { sm: 500 }
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay="auto"
              valueLabelFormat={zoomPercent}
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e, newValue) => setZoom(newValue)} // Ensure newValue is a number
            />
          </Box>
          <Box>
            <Typography>Rotation: {rotation}°</Typography>
            <Slider
              valueLabelDisplay="auto"
              min={0}
              max={360}
              step={1} // Optional: Add a step for rotation for smoother increments
              value={rotation}
              onChange={(e, newRotation) => setRotation(newRotation)} // Ensure newRotation is a number
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Uncomment if you want the Cancel button */}
          {/* <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => {
              setOpenCrop(false);
              setPhotoURL(null);
              setFile(null);
            }}
          >
            Cancel
          </Button> */}
          <Button
            variant="contained"
            startIcon={<CropIcon />}
            onClick={cropImage}
            disabled={loading} // Disable button if loading
          >
            Crop
          </Button>
        </Box>
      </DialogActions>
    </>
  );
};

export default CropEasy;
