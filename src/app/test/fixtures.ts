// Test fixtures shaped from the `*View` types in launchkit-api.ts. Every helper
// returns a fresh object so tests can mutate freely without leaking state.
import type {
  BuildView,
  DeploymentView,
  MockupView,
  OperationView,
  ProjectSummaryView,
  ProjectView,
  WizardCatalog,
} from "../launchkit-api";

export function makeCatalog(): WizardCatalog {
  return {
    businessCategories: [
      { id: "corporate", label: "Corporate Enterprise", description: "Established businesses building trust." },
      { id: "coffee", label: "Coffee Shop", description: "Café with specialty drinks." },
    ],
    designMoods: [
      { id: "minimalist", label: "Minimalist", description: "Clean, airy and uncluttered." },
      { id: "bold", label: "Bold", description: "High contrast and striking visuals." },
    ],
    animationLevels: [
      { id: "minimal", label: "Minimal", description: "Subtle & clean" },
      { id: "balanced", label: "Balanced", description: "Recommended" },
    ],
    themeModes: [
      { id: "light", label: "Light", description: "Light theme" },
      { id: "dark", label: "Dark", description: "Dark theme" },
    ],
    palettes: [
      {
        id: "modern-blue",
        label: "Modern Blue",
        colors: { primary: "#2563eb", secondary: "#60a5fa", background: "#f8fafc", text: "#1e293b" },
      },
      {
        id: "nature-green",
        label: "Nature Green",
        colors: { primary: "#16a34a", secondary: "#86efac", background: "#f0fdf4", text: "#14532d" },
      },
    ],
    fontPairings: [
      { id: "modern-startup", label: "Modern Startup", fonts: { heading: "Poppins", body: "Inter" } },
      { id: "corporate", label: "Corporate", fonts: { heading: "Montserrat", body: "Open Sans" } },
    ],
    pageTemplates: [
      {
        id: "home",
        label: "Home",
        slug: "home",
        sectionTemplateIds: ["navigation", "hero", "features", "footer"],
        selectedByDefault: true,
      },
      {
        id: "about",
        label: "About Us",
        slug: "about",
        sectionTemplateIds: ["navigation", "hero", "footer"],
        selectedByDefault: false,
      },
    ],
    sectionTemplates: [
      { id: "navigation", label: "Navigation", locked: true },
      { id: "hero", label: "Hero Section", locked: false },
      { id: "features", label: "Features", locked: false },
      { id: "pricing", label: "Pricing", locked: false },
      { id: "footer", label: "Footer", locked: true },
    ],
  };
}

export function makeProject(overrides: Partial<ProjectView> = {}): ProjectView {
  return {
    id: "prj_test",
    status: "draft",
    business: {
      companyName: "Northstar",
      industry: "Technology",
      services: ["Consulting"],
      uvp: "Ten years of specialist expertise in one place.",
      targetAudience: "Small business owners",
      notes: "",
      categoryId: "corporate",
    },
    design: {
      tagline: "Build faster, ship smarter",
      cta: "Get Started",
      moodId: "minimalist",
      animationId: "balanced",
      themeId: "dark",
      imageSource: "stock",
      paletteId: "modern-blue",
      customPalette: null,
      fontPairingId: "modern-startup",
      customFonts: null,
    },
    pageLayout: {
      pages: [
        {
          id: "page:home",
          templateId: "home",
          name: "Home",
          slug: "home",
          sections: [
            { id: "home:navigation:0", templateId: "navigation", name: "Navigation", locked: true },
            { id: "home:hero:1", templateId: "hero", name: "Hero Section", locked: false },
            { id: "home:footer:2", templateId: "footer", name: "Footer", locked: true },
          ],
        },
      ],
    },
    extractedProfileFields: {},
    uploadedAssets: [],
    mockups: [],
    selectedMockupId: null,
    latestBuildId: null,
    latestDeploymentId: null,
    createdAt: "2026-07-15T00:00:00Z",
    updatedAt: "2026-07-15T00:00:00Z",
    ...overrides,
  };
}

export function makeMockups(): MockupView[] {
  return [
    {
      id: "mck_one",
      generation: 1,
      ordinal: 0,
      label: "Version 1",
      direction: "Clean and structured",
      previewUrl: "/api/v1/assets/ast_one/content",
      createdAt: "2026-07-15T00:00:00Z",
    },
    {
      id: "mck_two",
      generation: 1,
      ordinal: 1,
      label: "Version 2",
      direction: "Bold and contemporary",
      previewUrl: "/api/v1/assets/ast_two/content",
      createdAt: "2026-07-15T00:00:00Z",
    },
  ];
}

export function makeBuild(overrides: Partial<BuildView> = {}): BuildView {
  return {
    id: "bld_test",
    projectId: "prj_test",
    provider: "v0",
    status: "completed",
    stage: "completed",
    message: "Build completed",
    warnings: [],
    previewUrl: "https://demo.example.com/site",
    webUrl: "https://v0.app/chat/example",
    downloadUrl: "/api/v1/builds/bld_test/download",
    retryAfterSeconds: null,
    ...overrides,
  };
}

export function makeDeployment(overrides: Partial<DeploymentView> = {}): DeploymentView {
  return {
    id: "dpl_test",
    buildId: "bld_test",
    status: "queued",
    liveUrl: null,
    claimUrl: null,
    claimExpiresAt: null,
    message: "Deployment queued",
    retryAfterSeconds: null,
    ...overrides,
  };
}

export function makeOperation(overrides: Partial<OperationView> = {}): OperationView {
  return {
    id: "op_test",
    projectId: "prj_test",
    kind: "mockups",
    status: "running",
    result: {},
    errorCode: null,
    errorMessage: null,
    ...overrides,
  };
}

export function makeProjectSummaries(): ProjectSummaryView[] {
  return [
    {
      id: "prj_one",
      status: "draft",
      companyName: "Northstar",
      latestBuildId: null,
      latestBuildStatus: null,
      previewUrl: null,
      downloadUrl: null,
      createdAt: "2026-07-15T00:00:00Z",
      updatedAt: "2026-07-15T00:00:00Z",
    },
    {
      id: "prj_two",
      status: "built",
      companyName: "Harbour Coffee",
      latestBuildId: "bld_two",
      latestBuildStatus: "completed",
      previewUrl: "/api/v1/builds/bld_two/preview",
      downloadUrl: "/api/v1/builds/bld_two/download",
      createdAt: "2026-07-14T00:00:00Z",
      updatedAt: "2026-07-16T09:30:00Z",
    },
  ];
}
