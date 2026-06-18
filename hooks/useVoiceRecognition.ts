import { useEffect, useRef, useCallback, useState } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { isRamUtterance } from '../constants/ramNames';

interface UseVoiceRecognitionProps {
  enabled: boolean;
  onDetected: () => void;
}

export function useVoiceRecognition({ enabled, onDetected }: UseVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const cooldownRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestPermission = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    setHasPermission(result.granted);
    return result.granted;
  };

  const startListening = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    try {
      ExpoSpeechRecognitionModule.start({
        lang: 'hi-IN',           // Hindi primary
        interimResults: true,
        continuous: true,
        requiresOnDeviceRecognition: true,  // on-device, offline
        addsPunctuation: false,
        contextualStrings: [
          'राम', 'जय राम', 'ओम राम', 'श्री राम',
          'ram', 'raam', 'rama', 'jai ram', 'shri ram',
        ],
        // Volume sensitivity — picks up whispers
        volumeChangeEventOptions: {
          enabled: true,
        },
      });
      setIsListening(true);
    } catch (e) {
      console.error('Speech start error:', e);
    }
  }, [hasPermission]);

  const stopListening = useCallback(() => {
    try {
      ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Speech stop error:', e);
    }
  }, []);

  // Auto-restart when recognition ends (keeps listening continuously)
  useSpeechRecognitionEvent('end', () => {
    if (enabled) {
      restartTimerRef.current = setTimeout(() => {
        startListening();
      }, 300);
    } else {
      setIsListening(false);
    }
  });

  // Handle results — fires on interim + final
  useSpeechRecognitionEvent('result', (event) => {
    if (cooldownRef.current) return;
    const transcript = event.results?.[0]?.transcript || '';
    if (isRamUtterance(transcript)) {
      cooldownRef.current = true;
      onDetected();
      // 800ms cooldown prevents double-counting one utterance
      setTimeout(() => { cooldownRef.current = false; }, 800);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.warn('Speech recognition error:', event.error, event.message);
    // Auto-restart on error if still enabled
    if (enabled) {
      restartTimerRef.current = setTimeout(() => startListening(), 1000);
    }
  });

  // Start/stop based on enabled flag
  useEffect(() => {
    if (enabled) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      stopListening();
    };
  }, [enabled]);

  return { isListening, hasPermission, requestPermission };
}
