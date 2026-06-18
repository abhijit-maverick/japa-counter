import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export type JapaMode = 'man' | 'vaani';

export interface DayRecord {
  date: string;
  count: number;
  goalMet: boolean;
}

interface JapaState {
  todayCount: number;
  totalCount: number;
  dailyGoal: number;
  streak: number;
  history: DayRecord[];
  mode: JapaMode;
}

const STORAGE_KEY = 'japa_state_v1';

const defaultState: JapaState = {
  todayCount: 0,
  totalCount: 0,
  dailyGoal: 108,
  streak: 0,
  history: [],
  mode: 'man',
};

export function useJapaStore() {
  const [state, setState] = useState<JapaState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { loadState(); }, []);

  const getToday = () => format(new Date(), 'yyyy-MM-dd');

  const loadState = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as JapaState & { lastDate?: string };
        const today = getToday();
        const lastDate = saved.lastDate || today;
        if (lastDate !== today) {
          const wasGoalMet = saved.todayCount >= saved.dailyGoal;
          const newHistory: DayRecord[] = [
            { date: lastDate, count: saved.todayCount, goalMet: wasGoalMet },
            ...saved.history,
          ].slice(0, 90);
          const newStreak = wasGoalMet ? saved.streak + 1 : 0;
          setState({ ...saved, todayCount: 0, streak: newStreak, history: newHistory });
        } else {
          setState(saved);
        }
      }
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setLoaded(true);
    }
  };

  const saveState = async (newState: JapaState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...newState, lastDate: getToday() }));
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const increment = useCallback(() => {
    setState(prev => {
      const next = { ...prev, todayCount: prev.todayCount + 1, totalCount: prev.totalCount + 1 };
      saveState(next);
      return next;
    });
  }, []);

  const setMode = useCallback((mode: JapaMode) => {
    setState(prev => { const next = { ...prev, mode }; saveState(next); return next; });
  }, []);

  const setDailyGoal = useCallback((goal: number) => {
    setState(prev => { const next = { ...prev, dailyGoal: goal }; saveState(next); return next; });
  }, []);

  return { ...state, loaded, increment, setMode, setDailyGoal };
}
