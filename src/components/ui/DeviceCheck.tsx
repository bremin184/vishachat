import React from 'react';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Mic, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceCheckProps {
  onDevicesReady?: (camera: string, mic: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const DeviceCheck: React.FC<DeviceCheckProps> = ({ onDevicesReady, isLoading, className }) => {
  const {
    cameras,
    microphones,
    selectedCamera,
    selectedMicrophone,
    permissionGranted,
    error,
    requestPermissions,
    setSelectedCamera,
    setSelectedMicrophone
  } = useMediaDevices();

  const hasDevices = cameras.length > 0 && microphones.length > 0;
  const isReady = permissionGranted && hasDevices;

  const handleJoin = () => {
    if (onDevicesReady && isReady) {
      onDevicesReady(selectedCamera, selectedMicrophone);
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader>
        <CardTitle>Device Check</CardTitle>
        <CardDescription>Configure your camera and microphone before joining.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!permissionGranted ? (
          <div className="text-center py-4">
            <div className="mb-4 flex justify-center gap-4">
              <div className="p-3 bg-muted rounded-full">
                <Camera className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="p-3 bg-muted rounded-full">
                <Mic className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We need access to your camera and microphone to start the call.
            </p>
            <Button onClick={requestPermissions} className="w-full">
              Allow Access
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="camera-select">Camera</Label>
              <div className="flex gap-2">
                <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                  <SelectTrigger id="camera-select" className="w-full">
                    <SelectValue placeholder="Select Camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${cameras.indexOf(device) + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className={cn("flex items-center justify-center w-10 h-10 rounded-md border", 
                  cameras.length > 0 ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                )}>
                  <Camera className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mic-select">Microphone</Label>
              <div className="flex gap-2">
                <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                  <SelectTrigger id="mic-select" className="w-full">
                    <SelectValue placeholder="Select Microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    {microphones.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${microphones.indexOf(device) + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className={cn("flex items-center justify-center w-10 h-10 rounded-md border", 
                  microphones.length > 0 ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                )}>
                  <Mic className="h-4 w-4" />
                </div>
              </div>
            </div>

            {hasDevices ? (
               <Alert className="bg-green-500/10 border-green-500/20 text-green-600">
                 <CheckCircle2 className="h-4 w-4" />
                 <AlertTitle>Ready to join</AlertTitle>
                 <AlertDescription>Devices detected and ready.</AlertDescription>
               </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No devices found</AlertTitle>
                <AlertDescription>Please connect a camera and microphone.</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!isReady || isLoading} 
          onClick={handleJoin}
          variant={isReady ? "default" : "secondary"}
        >
          {isLoading ? "Joining..." : "Join Call"}
        </Button>
      </CardFooter>
    </Card>
  );
};