import sanitize from "sanitize-html";
import Showdown from "showdown";
export function GetFilteredHTML(md: string) {
  return sanitize(
    new Showdown.Converter({
      emoji: true,
      customizedHeaderId: true,
      tables: true,
      strikethrough: true,
      ghCodeBlocks: true,
      underline: true,
      ghCompatibleHeaderId: true,
      openLinksInNewWindow: true,
    }).makeHtml(md),
    {
      allowedTags: [
        "div",
        "span",
        "code",
        "a",
        "table",
        "thead",
        "tbody",
        "br",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "li",
        "p",
        "marquee",
        "b",
        "strong",
        "i",
        "u",
        "code",
        "pre",
        "ol",
        "s",
        "del",
        "em"
      ],
      disallowedTagsMode: "escape",
    }
  );
}
