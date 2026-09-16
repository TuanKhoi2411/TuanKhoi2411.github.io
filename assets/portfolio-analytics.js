(() => {
  "use strict";

  const measurementId = "G-YMK0BVNHWT";
  const productionHosts = new Set(["tuankhoi2411.github.io"]);
  const analyticsPreferenceKey = "portfolio-analytics-preference";
  const analyticsPreferenceCookie = "portfolio_analytics_preference";
  const scrollMilestones = [25, 50, 75, 90, 100];
  const activeTimeMilestones = [10, 30, 60, 120];

  const readPreference = () => {
    const requested = new URLSearchParams(window.location.search).get("portfolio_analytics");

    try {
      if (requested === "off") window.localStorage.setItem(analyticsPreferenceKey, "off");
      if (requested === "on") window.localStorage.removeItem(analyticsPreferenceKey);
    } catch {
      // The first-party cookie below remains available when storage is restricted.
    }

    if (requested === "off") {
      document.cookie = `${analyticsPreferenceCookie}=off; Max-Age=63072000; Path=/; SameSite=Lax; Secure`;
    }
    if (requested === "on") {
      document.cookie = `${analyticsPreferenceCookie}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
    }

    let storedPreference = null;
    try {
      storedPreference = window.localStorage.getItem(analyticsPreferenceKey);
    } catch {
      // Fall through to the cookie preference.
    }

    const cookiePreference = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${analyticsPreferenceCookie}=`))
      ?.split("=")[1];

    return storedPreference || cookiePreference || (requested === "off" ? "off" : null);
  };

  const hasPrivacySignal = () => {
    const doNotTrack = [window.navigator.doNotTrack, window.doNotTrack, window.navigator.msDoNotTrack];
    return window.navigator.globalPrivacyControl === true || doNotTrack.some((value) => value === "1" || value === "yes");
  };

  // Keep local previews and draft servers out of the production reports.
  if (!productionHosts.has(window.location.hostname)) {
    document.documentElement.dataset.analytics = "disabled";
    window.portfolioAnalytics = { enabled: false, reason: "non-production-host" };
    return;
  }

  if (readPreference() === "off" || hasPrivacySignal()) {
    document.documentElement.dataset.analytics = "disabled";
    window.portfolioAnalytics = { enabled: false, reason: "privacy-preference" };
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
    page_title: document.title,
    tracking_version: "2026-09-17.2"
  });

  window.portfolioTrack = (eventName, params = {}) => {
    window.gtag("event", eventName, { ...baseParams(), ...params });
  };

  window.portfolioAnalytics = { enabled: true, measurementId };

  const reachedScrollMilestones = new Set();
  let scrollFramePending = false;

  const measureScrollDepth = () => {
    scrollFramePending = false;
    const documentHeight = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0);
    const depth = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / Math.max(1, documentHeight)) * 100));

    scrollMilestones.forEach((milestone) => {
      if (depth < milestone || reachedScrollMilestones.has(milestone)) return;
      reachedScrollMilestones.add(milestone);
      window.portfolioTrack("scroll_depth", { percent_scrolled: milestone });
    });
  };

  window.addEventListener("scroll", () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    window.requestAnimationFrame(measureScrollDepth);
  }, { passive: true });

  const seenSections = new Set();
  const sectionObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seenSections.has(entry.target.id)) return;
          seenSections.add(entry.target.id);
          const heading = entry.target.querySelector("h1, h2, h3");
          window.portfolioTrack("section_view", {
            section_id: entry.target.id,
            section_title: cleanText(heading?.textContent || entry.target.getAttribute("aria-label") || entry.target.id)
          });
          sectionObserver.unobserve(entry.target);
        });
      }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 })
    : null;

  document.querySelectorAll("main section[id], main [data-analytics-section][id]").forEach((section) => {
    sectionObserver?.observe(section);
  });

  let activeSeconds = 0;
  const reachedActiveTimeMilestones = new Set();
  window.setInterval(() => {
    if (document.visibilityState !== "visible" || !document.hasFocus()) return;
    activeSeconds += 1;
    activeTimeMilestones.forEach((milestone) => {
      if (activeSeconds < milestone || reachedActiveTimeMilestones.has(milestone)) return;
      reachedActiveTimeMilestones.add(milestone);
      window.portfolioTrack("active_reading_time", { active_seconds: milestone });
    });
  }, 1000);

  measureScrollDepth();

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
