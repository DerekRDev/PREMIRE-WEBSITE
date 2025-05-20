import React, { useState, useRef } from 'react';
import { Card, Button } from '@/ui/design-system/components';

interface InsuranceCardScannerProps {
  onCapture: (frontImage: string, backImage?: string) => void;
  onCancel: () => void;
  showBackCapture?: boolean;
}

export const InsuranceCardScanner: React.FC<InsuranceCardScannerProps> = ({
  onCapture,
  onCancel,
  showBackCapture = true
}) => {
  // State
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isFrontActive, setIsFrontActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      setError('Unable to access camera. Please use the file upload option instead.');
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  // Capture image from camera
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    
    // Set the appropriate image based on which side is active
    if (isFrontActive) {
      setFrontImage(imageDataUrl);
      
      if (showBackCapture) {
        // Switch to back if we're showing both sides
        setIsFrontActive(false);
      } else {
        // Stop camera if we only need front
        stopCamera();
        onCapture(imageDataUrl);
      }
    } else {
      setBackImage(imageDataUrl);
      stopCamera();
      
      // Call onCapture with both images
      if (frontImage) {
        onCapture(frontImage, imageDataUrl);
      }
    }
  };
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        if (isFrontActive) {
          setFrontImage(event.target.result);
          
          if (showBackCapture) {
            setIsFrontActive(false);
          } else {
            onCapture(event.target.result);
          }
        } else {
          setBackImage(event.target.result);
          
          if (frontImage) {
            onCapture(frontImage, event.target.result);
          }
        }
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  // Handle retake
  const handleRetake = () => {
    if (isFrontActive) {
      setFrontImage(null);
    } else {
      setBackImage(null);
    }
    
    startCamera();
  };
  
  // Toggle between front and back
  const toggleSide = () => {
    setIsFrontActive(!isFrontActive);
  };
  
  // Load/cleanup camera on mount/unmount
  React.useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <Card className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-2">
        Insurance Card Scanner
      </h2>
      <p className="text-gray-600 mb-6">
        {isFrontActive
          ? 'Please position the FRONT of your insurance card within the frame and take a photo.'
          : 'Now please position the BACK of your insurance card within the frame and take a photo.'}
      </p>
      
      <div className="mb-6">
        {/* Show canvas for the captured image */}
        {((isFrontActive && frontImage) || (!isFrontActive && backImage)) ? (
          <div className="relative border-2 border-blue-500 rounded-lg overflow-hidden aspect-video">
            <img
              src={isFrontActive ? frontImage! : backImage!}
              alt={isFrontActive ? 'Front of insurance card' : 'Back of insurance card'}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          // Show video feed for capture
          <div className="relative border-2 border-blue-500 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-2 border-dashed border-white pointer-events-none" />
          </div>
        )}
        
        {/* Hidden canvas for processing captured images */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Controls */}
      <div className="flex flex-col gap-3 mb-4">
        {((isFrontActive && frontImage) || (!isFrontActive && backImage)) ? (
          <Button onClick={handleRetake}>
            Retake Photo
          </Button>
        ) : (
          <Button onClick={captureImage} isLoading={isLoading}>
            Take Photo
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
        >
          Upload from Gallery
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="text" onClick={onCancel}>
          Cancel
        </Button>
        
        {showBackCapture && (
          <Button
            variant="text"
            onClick={toggleSide}
            disabled={(!isFrontActive && !frontImage) || (isFrontActive && !backImage)}
          >
            {isFrontActive ? 'Skip to Back Side' : 'Back to Front Side'}
          </Button>
        )}
      </div>
      
      {/* Progress indicator */}
      {showBackCapture && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <div className={`h-2 w-8 rounded-full ${isFrontActive || frontImage ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <div className={`h-2 w-8 rounded-full ${!isFrontActive || backImage ? 'bg-blue-500' : 'bg-gray-300'}`} />
          </div>
        </div>
      )}
    </Card>
  );
};