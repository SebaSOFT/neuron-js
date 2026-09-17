import DefaultTheme from "vitepress/theme";
import { inBrowser } from "vitepress";
import type { EnhanceAppContext } from "vitepress";
import mermaid from "mermaid";
import "./custom.css";

const isDarkMode = () => document.documentElement.classList.contains("dark");

const configureMermaid = () => {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: isDarkMode() ? "dark" : "default",
  });
};

const restoreDiagramSources = () => {
  for (const diagram of document.querySelectorAll<HTMLElement>(".mermaid")) {
    const source = diagram.dataset.mermaidSource;

    if (!source) {
      continue;
    }

    diagram.removeAttribute("data-processed");
    diagram.textContent = decodeURIComponent(source);
  }
};

const renderMermaid = async () => {
  if (!inBrowser) {
    return;
  }

  configureMermaid();
  restoreDiagramSources();
  await mermaid.run({ querySelector: ".mermaid" });
};

const observeThemeChanges = () => {
  const observer = new MutationObserver(() => {
    void renderMermaid();
  });

  observer.observe(document.documentElement, {
    attributeFilter: ["class"],
    attributes: true,
  });
};

const scheduleRender = () => {
  requestAnimationFrame(() => {
    void renderMermaid();
  });
};

export default {
  extends: DefaultTheme,
  enhanceApp({ router }: EnhanceAppContext) {
    if (!inBrowser) {
      return;
    }

    configureMermaid();
    observeThemeChanges();

    const afterRouteChange = router.onAfterRouteChanged;
    router.onAfterRouteChanged = async (to) => {
      await afterRouteChange?.(to);
      scheduleRender();
    };
  },
  setup() {
    if (!inBrowser) {
      return;
    }

    scheduleRender();
  },
};
