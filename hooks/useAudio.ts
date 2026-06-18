import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

export function useAudio() {
  const bgMusicRef = useRef<Audio.Sound | null>(null);
  const chantSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    setupAudio();
    return () => {
      bgMusicRef.current?.unloadAsync();
      chantSoundRef.current?.unloadAsync();
    };
  }, []);

  const setupAudio = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  };

  const playBgMusic = useCallback(async () => {
    try {
      if (bgMusicRef.current) {
        await bgMusicRef.current.playAsync();
        return;
      }
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/bg_music.mp3'),
        { isLooping: true, volume: 0.35, shouldPlay: true }
      );
      bgMusicRef.current = sound;
    } catch (e) {
      console.warn('BG music error:', e);
    }
  }, []);

  const stopBgMusic = useCallback(async () => {
    try {
      await bgMusicRef.current?.pauseAsync();
    } catch (e) {}
  }, []);

  const playChant = useCallback(async () => {
    try {
      // If chant sound already loaded, replay from start
      if (chantSoundRef.current) {
        await chantSoundRef.current.setPositionAsync(0);
        await chantSoundRef.current.playAsync();
        return;
      }
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/ram_chant.mp3'),
        { volume: 0.9, shouldPlay: true }
      );
      chantSoundRef.current = sound;
    } catch (e) {
      console.warn('Chant sound error:', e);
    }
  }, []);

  return { playBgMusic, stopBgMusic, playChant };
}
