// Voice recognition disabled — expo-speech-recognition removed
// Will be re-added in future build
export function useVoiceRecognition({ enabled, onDetected }: { enabled: boolean; onDetected: () => void }) {
  return { isListening: false, hasPermission: false, requestPermission: async () => false };
}
