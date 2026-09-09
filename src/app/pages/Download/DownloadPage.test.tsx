import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DownloadPage } from "./DownloadPage";
import { makeBuild, makeDeployment } from "@/app/test/fixtures";

describe("DownloadPage", () => {
  it("renders the success state with download and a deferred deploy action", () => {
    render(
      <DownloadPage
        build={makeBuild()}
        deployment={null}
        onDeploy={vi.fn()}
        onBack={vi.fn()}
        busy={false}
      />,
    );

    expect(screen.getByText("Your website is ready!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download" })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Open Vercel Claim/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open preview/i })).toBeInTheDocument();
  });

  it("disables download when the build has no archive", () => {
    render(
      <DownloadPage
        build={makeBuild({ downloadUrl: null })}
        deployment={null}
        onDeploy={vi.fn()}
        onBack={vi.fn()}
        busy={false}
      />,
    );

    expect(screen.getByRole("button", { name: "Download" })).toBeDisabled();
  });

  it("shows a Phase 2 message when claim is clicked and does not deploy", () => {
    const onDeploy = vi.fn();

    render(
      <DownloadPage
        build={makeBuild()}
        deployment={makeDeployment({ status: "ready_to_claim", claimUrl: "https://vercel.com/claim" })}
        onDeploy={onDeploy}
        onBack={vi.fn()}
        busy={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Open Vercel Claim/i }));

    expect(
      screen.getByText("This feature will be available in Phase 2 soon."),
    ).toBeInTheDocument();
    expect(onDeploy).not.toHaveBeenCalled();
  });

  it("embeds a Vercel live URL when the deployment is ready", () => {
    render(
      <DownloadPage
        build={makeBuild({
          previewUrl: "https://demo.vusercontent.net/site",
          webUrl: "https://v0.app/chat/h721WuMRdWt",
        })}
        deployment={makeDeployment({
          status: "ready_to_claim",
          liveUrl: "https://northstar.vercel.app",
        })}
        onDeploy={vi.fn()}
        onBack={vi.fn()}
        busy={false}
      />,
    );

    const iframe = screen.getByTitle("Generated website preview");
    expect(iframe).toHaveAttribute("src", "https://northstar.vercel.app");
    expect(screen.queryByRole("button", { name: /Open preview/i })).not.toBeInTheDocument();
  });
});
