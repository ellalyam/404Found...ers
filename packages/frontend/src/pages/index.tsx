import Home from "./home";
import Login from "./login";
import Suggestion from "./suggestion";
import "../styling/index.sass";
import { Route, Routes } from "react-router-dom";

export default function Index() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/suggestion" element={<Suggestion />} />
    </Routes>
  );
}
