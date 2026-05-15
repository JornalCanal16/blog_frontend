const EXTERNAL_HREF_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export const normalizeRichTextHtml = (html: string) => {
  if (!html) return html;
  if (typeof document === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const anchors = doc.querySelectorAll("a[href]");

  anchors.forEach((anchor) => {
    const rawHref = anchor.getAttribute("href")?.trim() || "";
    if (!rawHref) return;

    if (
      rawHref.startsWith("#") ||
      rawHref.startsWith("/") ||
      rawHref.startsWith("//") ||
      rawHref.startsWith("mailto:") ||
      rawHref.startsWith("tel:") ||
      EXTERNAL_HREF_PATTERN.test(rawHref)
    ) {
      anchor.setAttribute("href", rawHref);
      return;
    }

    anchor.setAttribute("href", `https://${rawHref}`);
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  });

  return doc.body.innerHTML;
};