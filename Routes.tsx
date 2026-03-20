// src/Routes.jsx
import { Routes, Route } from "react-router-dom";
import PageLogin from "./pages/login"; // pageA.jsxの読み込み
// import PageSignup from "./pages/signup"; // pageB.jsxの読み込み
import PageHome from "./pages/home"; // pageB.jsxの読み込み

export const AppRoutes = () => {
   return (
       <Routes>
           <Route path="/" element={<PageHome />} />
           <Route path="/login" element={<PageLogin />} />
           {/* <Route path="/signup" element={<PageSignup />} /> */}
       </Routes>
   )
}
