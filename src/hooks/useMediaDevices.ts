import { useState, useEffect, useCallback } from 'react';

export interface MediaDeviceState {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  selectedCamera: string;
  selectedMicrophone: string;
  permissionGranted: boolean;
  error: string | null;
  requestPermissions: () => Promise<void>;
  setSelectedCamera: (id: string) => void;
  setSelectedMicrophone: (id: string) => void;
}

export const useMediaDevices = (): MediaDeviceState => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getDevices = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) return;

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');

      setCameras(videoDevices);
      setMicrophones(audioDevices);

      // Auto-select first device if none selected
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
      if (audioDevices.length > 0 && !selectedMicrophone) {
        setSelectedMicrophone(audioDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
    }
  }, [selectedCamera, selectedMicrophone]);

  const requestPermissions = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      setError("Media devices not supported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPermissionGranted(true);
      setError(null);
      
      // Stop tracks to release hardware, we just wanted permission
      stream.getTracks().forEach(track => track.stop());
      
      // Re-enumerate to get device labels now that we have permission
      await getDevices();
    } catch (err: any) {
      console.error("Permission denied:", err);
      setPermissionGranted(false);
      setError(err.message || "Camera/Microphone permission denied");
    }
  }, [getDevices]);

  useEffect(() => {
    // Initial check (might not have labels yet)
    getDevices();

    const handleDeviceChange = () => getDevices();
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
  }, [getDevices]);

  return {
    cameras,
    microphones,
    selectedCamera,
    selectedMicrophone,
    permissionGranted,
    error,
    requestPermissions,
    setSelectedCamera,
    setSelectedMicrophone
  };
};