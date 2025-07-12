// frontend/src/App.js
import React from "react";
import UploadScanner from "./components/uploadScanner";

/**
 * A *very* small React app that only
 * shows one component: the file‑upload
 * AI scanner.
 *
 * You can add more components later.
 */
function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>
        NeuroScan AI – Image / Video Deepfake Scanner
      </h1>

      {/* ←‑‑ our new upload‑based scanner */}
      <UploadScanner />
    </div>
  );
}

export default App;
