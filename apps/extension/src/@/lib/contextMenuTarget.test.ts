import { describe, it, expect } from "vitest";
import { extractContextMenuTarget } from "./contextMenuTarget";

describe("extractContextMenuTarget", () => {
  it("returns null when no URL is available", () => {
    const result = extractContextMenuTarget({}, {});
    expect(result).toBeNull();
  });

  it("prioritizes linkUrl over srcUrl and tab URL", () => {
    const result = extractContextMenuTarget(
      {
        linkUrl: "https://example.com/article",
        srcUrl: "https://example.com/image.png",
      },
      {
        url: "https://example.com/page",
        title: "Page Title",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/article",
      title: "https://example.com/article",
    });
  });

  it("uses srcUrl when linkUrl is not available", () => {
    const result = extractContextMenuTarget(
      {
        srcUrl: "https://example.com/video.mp4",
      },
      {
        url: "https://example.com/page",
        title: "Page Title",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/video.mp4",
      title: "https://example.com/video.mp4",
    });
  });

  it("falls back to tab URL when no link or media URL is available", () => {
    const result = extractContextMenuTarget(
      {},
      {
        url: "https://example.com/page",
        title: "Page Title",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/page",
      title: "Page Title",
    });
  });

  it("prioritizes selectionText for title", () => {
    const result = extractContextMenuTarget(
      {
        linkUrl: "https://example.com/article",
        selectionText: "Selected Text",
      },
      {
        url: "https://example.com/page",
        title: "Page Title",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/article",
      title: "Selected Text",
    });
  });

  it("uses link URL as title when no selectionText and linkUrl is present", () => {
    const result = extractContextMenuTarget(
      {
        linkUrl: "https://example.com/article",
      },
      {
        url: "https://example.com/page",
        title: "Page Title",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/article",
      title: "https://example.com/article",
    });
  });

  it("uses tab title for title when no selectionText and using tab URL", () => {
    const result = extractContextMenuTarget(
      {},
      {
        url: "https://example.com/page",
        title: "Page Title",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/page",
      title: "Page Title",
    });
  });

  it("falls back to URL as title when tab has no title", () => {
    const result = extractContextMenuTarget(
      {},
      {
        url: "https://example.com/page",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/page",
      title: "https://example.com/page",
    });
  });

  it("handles undefined tab parameter", () => {
    const result = extractContextMenuTarget({
      linkUrl: "https://example.com/article",
    });

    expect(result).toEqual({
      url: "https://example.com/article",
      title: "https://example.com/article",
    });
  });

  it("returns null when tab is undefined and no link/media URL", () => {
    const result = extractContextMenuTarget({});
    expect(result).toBeNull();
  });

  it("handles empty string URLs gracefully", () => {
    const result = extractContextMenuTarget(
      {
        linkUrl: "",
      },
      {
        url: "https://example.com/page",
        title: "Page Title",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/page",
      title: "Page Title",
    });
  });

  it("handles real-world HN scenario from issue", () => {
    // User is on HN and right-clicks an article link
    const result = extractContextMenuTarget(
      {
        linkUrl: "https://example.com/great-article",
      },
      {
        url: "https://news.ycombinator.com",
        title: "Hacker News",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/great-article",
      title: "https://example.com/great-article",
    });
  });

  it("handles image context menu on Wikipedia", () => {
    const result = extractContextMenuTarget(
      {
        srcUrl: "https://upload.wikimedia.org/image.jpg",
      },
      {
        url: "https://en.wikipedia.org/wiki/Article",
        title: "Article - Wikipedia",
      }
    );

    expect(result).toEqual({
      url: "https://upload.wikimedia.org/image.jpg",
      title: "https://upload.wikimedia.org/image.jpg",
    });
  });

  it("handles link with selected text", () => {
    const result = extractContextMenuTarget(
      {
        linkUrl: "https://example.com/article",
        selectionText: "Read more about this topic",
      },
      {
        url: "https://example.com/page",
        title: "Page Title",
      }
    );

    expect(result).toEqual({
      url: "https://example.com/article",
      title: "Read more about this topic",
    });
  });
});
