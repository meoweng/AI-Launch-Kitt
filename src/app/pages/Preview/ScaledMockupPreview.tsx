import { useEffect, useRef, useState } from "react";

/** Desktop width the OpenRouter mockups are designed for. */
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 900;

/**
 * Renders generated mockup HTML at desktop size, then scales it to fit the card
 * so nav/hero layouts are not crushed into overlapping text.
 */
export function ScaledMockupPreview({
  html,
  title,
}: {
  html: string;
  title: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    const update = () => {
      const width = node.clientWidth;
      if (width > 0) setScale(width / DESIGN_WIDTH);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="absolute inset-0 overflow-hidden"
      style={{ background: "white", zIndex: 2 }}
      aria-hidden={false}
    >
      <iframe
        srcDoc={html}
        title={title}
        sandbox="allow-scripts"
        tabIndex={-1}
        className="border-0 pointer-events-none"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: "white",
        }}
      />
    </div>
  );
}
