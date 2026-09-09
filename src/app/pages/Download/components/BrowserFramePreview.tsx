import { ExternalLink, RotateCw } from "lucide-react";

/**
 * Fake browser chrome around the generated site.
 *
 * v0 chat pages (`v0.app/chat/...`) and many demo hosts refuse iframe embedding
 * (or need a server-side preview proxy). Prefer a Vercel live URL when we have
 * one; otherwise offer open-in-new-tab instead of a broken iframe.
 */
export function BrowserFramePreview({
  previewUrl,
  liveUrl,
}: {
  previewUrl: string | null;
  liveUrl?: string | null;
}) {
  const openUrl = pickOpenUrl(liveUrl, previewUrl);
  const embedUrl = pickEmbedUrl(liveUrl);

  return (
    <div
      className="flex flex-col overflow-hidden w-full"
      style={{
        height: "clamp(220px, 34vw, 240px)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-[10px] px-[12px]"
        style={{
          height: 36,
          background: "#1a1a1a",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        {["#6fccdd", "#6fccdd", "#6fccdd"].map((c, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{ width: 10, height: 10, background: c, opacity: 0.7 }}
          />
        ))}
        <div
          className="flex-1 flex items-center gap-[6px] px-[10px] rounded-[6px]"
          style={{ height: 22, background: "rgba(255,255,255,0.06)", marginLeft: 8 }}
        >
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 1L7 13M1 7h12"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span
            className="text-[11px] font-medium truncate"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {openUrl ?? "Generated website"}
          </span>
        </div>
        <RotateCw size={14} color="rgba(255,255,255,0.3)" strokeWidth={1.3} aria-hidden="true" />
      </div>

      <div className="flex-1 flex flex-col relative" style={{ background: "#111" }}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Generated website preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="absolute inset-0 w-full h-full border-0"
            style={{ background: "white", zIndex: 2 }}
          />
        ) : openUrl ? (
          <div
            className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-[12px] px-[20px] text-center"
            style={{ background: "#0d0d0d" }}
          >
            <p className="text-white font-semibold text-[14px]">Preview opens in a new tab</p>
            <p className="font-medium text-[12px]" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 280 }}>
              Live provider previews can’t be embedded here. Open the site to review it.
            </p>
            <button
              type="button"
              onClick={() => window.open(openUrl, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-[8px] font-semibold text-[12px] uppercase px-[14px] py-[8px] rounded-[8px]"
              style={{ background: "#6fccdd", color: "#0b0b0b" }}
            >
              <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
              Open preview
            </button>
          </div>
        ) : (
          <>
            <div
              className="flex-1 flex flex-col items-center justify-center gap-[8px]"
              style={{
                background: "linear-gradient(135deg, #0a1628 0%, #0a1a1a 50%, #111 100%)",
              }}
            >
              <div
                style={{ width: 120, height: 12, borderRadius: 6, background: "rgba(111,204,221,0.5)" }}
              />
              <div
                style={{ width: 200, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)" }}
              />
              <div className="flex gap-[8px] mt-[8px]">
                <div style={{ width: 64, height: 20, borderRadius: 4, background: "#6fccdd" }} />
                <div
                  style={{
                    width: 64,
                    height: 20,
                    borderRadius: 4,
                    border: "1px solid rgba(111,204,221,0.4)",
                  }}
                />
              </div>
            </div>
            <div
              className="grid grid-cols-3 gap-[8px] px-[12px] py-[10px]"
              style={{ background: "#0d0d0d" }}
            >
              {[1, 2, 3].map((k) => (
                <div
                  key={k}
                  style={{
                    height: 32,
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function pickOpenUrl(...candidates: Array<string | null | undefined>): string | null {
  for (const value of candidates) {
    if (value && isHttpsUrl(value) && !isV0ChatUrl(value)) return value;
  }
  for (const value of candidates) {
    if (value && isHttpsUrl(value)) return value;
  }
  return null;
}

/** Only embed URLs we control / that typically allow framing (Vercel live sites). */
function pickEmbedUrl(liveUrl: string | null | undefined): string | null {
  if (!liveUrl || !isHttpsUrl(liveUrl)) return null;
  try {
    const host = new URL(liveUrl).hostname.toLowerCase();
    if (host.endsWith(".vercel.app") || host === "vercel.app") return liveUrl;
  } catch {
    return null;
  }
  return null;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isV0ChatUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      (url.hostname === "v0.app" || url.hostname === "v0.dev") &&
      url.pathname.startsWith("/chat/")
    );
  } catch {
    return false;
  }
}
