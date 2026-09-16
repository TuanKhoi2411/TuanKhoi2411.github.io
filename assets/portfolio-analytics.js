(() => {
  "use strict";

  const measurementId = "G-YMK0BVNHWT";
  const productionHosts = new Set(["tuankhoi2411.github.io"]);

  // Keep local previews and draft servers out of the production reports.
  if (!productionHosts.has(window.location.hostname)) {
    document.documentElement.dataset.analytics = "disabled";
    window.portfolioAnalytics = { enabled: false, reason: "non-production-host" };
    return;
  }

  document.documentElement.dataset.analytics = "enabled";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const loader = document.createElement("script");
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(loader);

  const cleanText = (value) => (value || "").replace(/\s+/g, " ").trim().slice(0, 100);
  const baseParams = () => ({
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title
  });

  window.portfolioTrack = (eventName, params = {}) => {
    window.gtag("event", eventName, { ...baseParams(), ...params });
  };

  window.portfolioAnalytics = { enabled: true, measurementId };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const rawHref = link.getAttribute("href") || "";
    const label = cleanText(link.textContent || link.getAttribute("aria-label"));

    if (rawHref.startsWith("mailto:")) {
      window.portfolioTrack("contact_click", { contact_method: "email" });
      return;
    }

    let target;
    try {
      target = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    const path = target.pathname.toLowerCase();
    const hostname = target.hostname.toLowerCase();
    const isDownload = link.hasAttribute("download") || /\.(pdf|xlsx|xls|csv|pbix|pptx|docx|zip)$/i.test(path);

    if (isDownload) {
      window.portfolioTrack("portfolio_download", {
        file_name: path.split("/").pop() || "download",
        file_extension: path.includes(".") ? path.split(".").pop() : "",
        link_text: label
      });
      return;
    }

    if (hostname.includes("linkedin.com") || hostname.includes("github.com")) {
      window.portfolioTrack("social_click", {
        social_network: hostname.includes("linkedin.com") ? "linkedin" : "github",
        link_text: label
      });
      return;
    }

    if (/dashboard|analysis slides|presentation/i.test(label) || path.includes("/power-bi/stories/")) {
      window.portfolioTrack("dashboard_open", {
        destination_path: target.pathname,
        link_text: label
      });
      return;
    }

    if (target.origin === window.location.origin &&
        (path.includes("/cases/") || path === "/financial-models/" || path === "/power-bi/" || path === "/case-studies/")) {
      window.portfolioTrack("project_open", {
        destination_path: target.pathname,
        link_text: label
      });
    }
  }, { passive: true });
})();
