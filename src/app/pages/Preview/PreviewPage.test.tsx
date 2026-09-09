import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PreviewPage } from "./PreviewPage";
import { makeMockups } from "@/app/test/fixtures";

vi.mock("@/app/launchkit-api", async () => {
  const actual = await vi.importActual<typeof import("@/app/launchkit-api")>(
    "@/app/launchkit-api",
  );
  return {
    ...actual,
    launchKitApi: {
      ...actual.launchKitApi,
      getAssetContent: vi.fn(async () => "<html><body>mockup</body></html>"),
    },
  };
});

describe("PreviewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a card per mockup with its direction", async () => {
    render(
      <PreviewPage
        mockups={makeMockups()}
        selectedMockupId={null}
        onConfirm={vi.fn()}
        onBack={vi.fn()}
        busy={false}
      />,
    );

    expect(screen.getByText("Choose Your Design")).toBeInTheDocument();
    expect(screen.getByText("Version 1")).toBeInTheDocument();
    expect(screen.getByText("Clean and structured")).toBeInTheDocument();
    expect(screen.getByText("Version 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirm Selection/i })).toBeInTheDocument();

    // Each mockup's preview HTML lands in a sandboxed iframe.
    await waitFor(() => {
      expect(screen.getByTitle("Version 1 preview")).toBeInTheDocument();
    });
  });

  it("honours a previously selected mockup", () => {
    render(
      <PreviewPage
        mockups={makeMockups()}
        selectedMockupId="mck_two"
        onConfirm={vi.fn()}
        onBack={vi.fn()}
        busy={false}
      />,
    );

    expect(screen.getByText("Version 2")).toBeInTheDocument();
  });
});
