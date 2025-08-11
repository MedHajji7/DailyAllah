// // src/App.tsx
// import Background from "./Background";
// import HeroSearch from "./Components/HeroSearch";
// import { TopNav, Footer } from "./Primitives";
// import "./index.css";

// export default function App() {
//   return (
//     <Background>
//       {/* subtle watermark (stays fixed, doesn’t scroll) */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
//         style={{
//           backgroundImage: `
//       radial-gradient(ellipse at 20% 10%, #ffffff20 0, transparent 55%),
//       url('/calligraphy.svg')
//     `,
//           backgroundSize: "1200px 1200px, 1100px",
//           backgroundRepeat: "no-repeat, no-repeat",
//           backgroundPosition: "left -200px top -200px, center -200px",
//         }}
//       />

//       <TopNav />

//       {/* Center the card on all screens; add breathing room */}
//       <main className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
//         <div className="min-h-[70svh] flex items-start sm:items-center justify-center">
//           <div className="w-full">
//             {/* Daily Ayah card + search/favorites live inside this component */}
//             <HeroSearch />
//           </div>
//         </div>
//       </main>

//        <Footer />
//     </Background>
//   );
// }

// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import QuranLayout from "./pages/quran/QuranLayout";
import ReadPage from "./pages/quran/ReadPage";
import AudioPage from "./pages/quran/AudioPage";
// import DownloadsPage from "./pages/quran/DownloadsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quran" element={<QuranLayout />}>
          <Route index element={<Navigate to="read" replace />} />
          <Route path="read" element={<ReadPage />} />
          <Route path="audio" element={<AudioPage />} />
          {/* <Route path="downloads" element={<DownloadsPage />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
