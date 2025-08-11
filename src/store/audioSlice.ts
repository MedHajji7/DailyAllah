import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSurahAyahAudio, getChapterMp3 } from '../api/quran';

type AyahFile = { verse_key: string; url: string };

export const fetchAyahAudio = createAsyncThunk(
  'audio/fetchAyahAudio',
  async ({ reciterId, surah }: { reciterId: number; surah: number }) => {
    const files = await getSurahAyahAudio(reciterId, surah);
    if (!files.length) throw new Error('No ayah audio found');
    return { surah, files };
  }
);

export const fetchChapterMp3 = createAsyncThunk(
  'audio/fetchChapterMp3',
  async ({ reciterId, surah }: { reciterId: number; surah: number }) => {
    const url = await getChapterMp3(reciterId, surah);
    if (!url) throw new Error('No chapter MP3 found');
    return { surah, url };
  }
);

type AudioState = {
  reciterId?: number;
  surah: number;
  files: AyahFile[];          // per-ayah audio list
  chapterMp3?: string;        // optional single-MP3 url
  status: 'idle' | 'loading' | 'ready' | 'error';
  error?: string;
};

const initial: AudioState = {
  surah: 1,
  files: [],
  status: 'idle',
};

const slice = createSlice({
  name: 'audio',
  initialState: initial,
  reducers: {
    setReciter(state, action) { state.reciterId = action.payload as number; },
    setSurah(state, action)    { state.surah = action.payload as number; },
    clearChapterMp3(state)     { state.chapterMp3 = undefined; },
  },
  extraReducers: (b) => {
    b.addCase(fetchAyahAudio.pending, (s) => { s.status = 'loading'; s.error = undefined; s.files = []; });
    b.addCase(fetchAyahAudio.fulfilled, (s, a) => {
      s.status = 'ready';
      s.surah = a.payload.surah;
      s.files = a.payload.files;
    });
    b.addCase(fetchAyahAudio.rejected, (s, a) => {
      s.status = 'error';
      s.error = a.error.message;
      s.files = [];
    });

    b.addCase(fetchChapterMp3.pending, (s) => { s.error = undefined; s.chapterMp3 = undefined; });
    b.addCase(fetchChapterMp3.fulfilled, (s, a) => {
      s.surah = a.payload.surah;
      s.chapterMp3 = a.payload.url;
    });
    b.addCase(fetchChapterMp3.rejected, (s, a) => {
      s.error = a.error.message;
      s.chapterMp3 = undefined;
    });
  },
});

export const { setReciter, setSurah, clearChapterMp3 } = slice.actions;
export default slice.reducer;
