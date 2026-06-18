// All floating text variations - Hindi/Sanskrit only
export const RAM_TEXTS = [
  'राम',
  'जय राम',
  'ॐ राम',
  'श्री राम',
  'जय सियाराम',
];

// Voice recognition trigger words - all dialects and variations
export const RAM_TRIGGERS = [
  'ram', 'raam', 'rama', 'raama',
  'shri ram', 'shri raam', 'shree ram',
  'jai ram', 'jai raam', 'jay ram',
  'jai shri ram', 'jai shree ram',
  'siyaram', 'sita ram', 'sitaram',
  'raghupati', 'raghupathi',
  'raghav', 'raghuvar',
  'hey ram', 'hare ram',
  'jai siyaram', 'jai sia ram',
  // common misspellings / phonetic variants
  'rum', 'rahm', 'rom',
];

export const getRandomRamText = () =>
  RAM_TEXTS[Math.floor(Math.random() * RAM_TEXTS.length)];

export const isRamUtterance = (transcript: string): boolean => {
  const lower = transcript.toLowerCase().trim();
  return RAM_TRIGGERS.some(trigger => lower.includes(trigger));
};
