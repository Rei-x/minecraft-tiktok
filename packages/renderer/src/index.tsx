import { createRoot } from "react-dom/client";
import { App } from "./App";

const domNode = document.getElementById("app");

if (!domNode) {
  throw new Error("Couldn't find dom node");
}

const root = createRoot(domNode);

root.render(<App />);
