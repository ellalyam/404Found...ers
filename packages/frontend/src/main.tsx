//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Index from "./pages/index.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <Index />
    </BrowserRouter>
);
