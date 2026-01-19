import { useState } from "react";
import { useElementPicker } from "../useElementPicker";
import { PickedElement } from "../types";

export const LinkFetch = () => {
  const [picking, setPicking] = useState(false);
  const [pickedLink, setPickedLink] = useState<PickedElement | null>(null);
  const [url, setUrl] = useState("");
  const [resultText, setResultText] = useState("" );
  const [combinedResult, setCombinedResult] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { startPicker } = useElementPicker((element) => {
    setPickedLink(element);
    setUrl(element.href || "");
    setPicking(false);
  }, setPicking);

  const handleFetch = async () => {
    setError("");
    setResultText("");
    if (!url.trim()) {
      setError("Select or enter a link with an href first.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const text = doc.body?.textContent || "";
      setResultText(text.trim());

      // Merge fetched text into the picked link object for downstream use
      if (pickedLink) {
        setCombinedResult({ ...pickedLink, fetchedText: text.trim() });
      } else {
        setCombinedResult({ href: url, fetchedText: text.trim() });
      }
    } catch (err) {
      setError(`Failed to fetch: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crx-ext-card">
      <h3 className="crx-ext-title">Link Fetch</h3>
      <p className="crx-ext-text-sm">Pick a link on the page, then fetch its content.</p>
      <div className="crx-ext-form-group" style={{ gap: 8 }}>
        <div className="crx-ext-f crx-ext-ai-center" style={{ gap: 8 }}>
          <button
            onClick={() => {
              if (picking) return;
              setPicking(true);
              startPicker();
            }}
            className="crx-ext-btn"
            style={{ backgroundColor: picking ? "#ff6b6b" : undefined }}
          >
            {picking ? "Picking... (ESC to cancel)" : "Pick Link"}
          </button>
          <input
            className="crx-ext-form-input"
            placeholder="Or paste link href here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
        {pickedLink && (
          <div className="crx-ext-text-sm">
            <strong>Selector:</strong> {pickedLink.selector} | <strong>Index:</strong> {pickedLink.index}
          </div>
        )}
        <button onClick={handleFetch} className="crx-ext-btn" disabled={loading}>
          {loading ? "Fetching..." : "Fetch & Extract Text"}
        </button>
        {error && <div className="crx-ext-error">{error}</div>}
        {resultText && (
          <div className="crx-ext-text-sm" style={{ maxHeight: 180, overflow: "auto", whiteSpace: "pre-wrap" }}>
            {resultText}
          </div>
        )}
        {combinedResult && (
          <div className="crx-ext-text-sm" style={{ maxHeight: 180, overflow: "auto", whiteSpace: "pre-wrap", border: '1px solid #e5e7eb', padding: 8, borderRadius: 6 }}>
            <strong>Merged Object</strong>
            <pre style={{ margin: 0 }}>{JSON.stringify(combinedResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
