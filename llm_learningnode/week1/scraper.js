import * as cheerio from "cheerio";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
};

export async function fetchWebsiteContents(url) {
  const response = await fetch(url, { headers });
  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("title").text() || "No title found";

  // Remove irrelevant elements
  $("script, style, img, input").remove();

  const text = $("body").text().replace(/\s+/g, "\n").trim();

  return (title + "\n\n" + text).slice(0, 2000);
}

export async function fetchWebsiteLinks(url) {
  const response = await fetch(url, { headers });
  const html = await response.text();
  const $ = cheerio.load(html);

  const links = [];
  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) links.push(href);
  });

  return links;
}
