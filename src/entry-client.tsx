import { hydrateRoot } from "react-dom/client";
import App from "./App";

// root 엘리먼트 탐색
const container = document.getElementById("root");

if (container) {
  hydrateRoot(container, <App />);
}