import { createRoot } from "react-dom/client";
import { injectSpeedInsights } from "@vercel/speed-insights";
import "../src/assets/css/index.css";
import App from "./App.jsx";

injectSpeedInsights();
createRoot(document.getElementById("root")).render(<App />);
