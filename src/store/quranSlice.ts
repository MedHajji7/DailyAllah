import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSurahVerses } from '../api/quran';

export const fetchVerses = createAsyncThunk(
  'quran/fetchVerses',
  async (surah:number) => ({ surah, verses: await getSurahVerses(surah) })
);

type QuranState = { riwayah: 'hafs'; surah:number; verses:any[]; loading:boolean };
const initial: QuranState = { riwayah:'hafs', surah:1, verses:[], loading:false };

const slice = createSlice({
  name:'quran',
  initialState: initial,
  reducers: { setSurah(s, a){ s.surah = a.payload; } },
  extraReducers: b=>{
    b.addCase(fetchVerses.pending, s=>{ s.loading = true; });
    b.addCase(fetchVerses.fulfilled, (s,a)=>{ s.loading=false; s.surah=a.payload.surah; s.verses=a.payload.verses; });
    b.addCase(fetchVerses.rejected, s=>{ s.loading=false; });
  }
});

export const { setSurah } = slice.actions;
export default slice.reducer;
