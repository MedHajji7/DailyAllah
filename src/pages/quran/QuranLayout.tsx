import { NavLink, Outlet } from "react-router-dom";
import Background from "../../Background";
import { TopNav, Footer } from "../../Primitives";

export default function QuranLayout() {
  const base = "px-4 py-2 rounded-lg hover:bg-white/5";
  const cls = ({isActive}:{isActive:boolean}) => (isActive ? `${base} bg-white/10` : base);

  return (
    <Background>
      <TopNav />  {/* <-- gives you Home/Qur’an links */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 flex gap-2">
          <NavLink to="read" className={cls}>Read</NavLink>
          <NavLink to="audio" className={cls}>Audio</NavLink>
          {/* <NavLink to="downloads" className={cls}>Downloads</NavLink> */}
        </div>
        <Outlet/>
      </main>
      <Footer />
    </Background>
  );
}
