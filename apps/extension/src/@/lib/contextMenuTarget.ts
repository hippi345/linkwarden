/**
 * Extracts the target URL and title from a context menu click event.
 * Prioritizes clicked links and media over the tab's URL.
 */

export interface ContextMenuClickInfo {
  linkUrl?: string;
  srcUrl?: string;
  selectionText?: string;
}

export interface TabInfo {
  url?: string;
  title?: string;
}

export interface ContextMenuTarget {
  url: string;
  title: string;
}

/**
 * Determines the target URL and title from a context menu click.
 *
 * Priority for URL:
 * 1. info.linkUrl (clicked hyperlink)
 * 2. info.srcUrl (clicked media: image, video, audio)
 * 3. tab.url (fallback to current page)
 *
 * Priority for title:
 * 1. info.selectionText (user-selected text)
 * 2. URL itself if it's a link/media (more descriptive than tab title)
 * 3. tab.title (fallback to page title)
 * 4. URL as final fallback
 *
 * @param info Context menu click information
 * @param tab Current tab information
 * @returns Target URL and title, or null if no valid URL is available
 */
export function extractContextMenuTarget(
  info: ContextMenuClickInfo,
  tab?: TabInfo
): ContextMenuTarget | null {
  const targetUrl = info.linkUrl || info.srcUrl || tab?.url;
  if (!targetUrl) {
    return null;
  }

  const targetTitle =
    info.selectionText ||
    (info.linkUrl || info.srcUrl ? targetUrl : tab?.title) ||
    targetUrl;

  return {
    url: targetUrl,
    title: targetTitle,
  };
}
