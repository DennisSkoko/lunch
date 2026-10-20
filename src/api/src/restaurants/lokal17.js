import fetch from "node-fetch";
import { readPdfFromUrl } from "../util.js";
// Import pdf-parse correctly in ESM

export const name = "Lokal17";
export const url = "https://lokal17.se/";
export const emoji = "fork_and_knife";

export async function scrape() {
  // 1. Fetch homepage
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Failed to fetch homepage");
  const html = await resp.text();

  // 2. Extract PDF link
  const pdfUrlMatch = html.match(/href="([^"]+\.pdf)"/i);
  if (!pdfUrlMatch) throw new Error("No PDF link found");
  let pdfUrl = pdfUrlMatch[1];
  if (pdfUrl && !pdfUrl.startsWith("http")) pdfUrl = new URL(pdfUrl, url).href;

  // 3. Download PDF as buffer
  const pdfText = await readPdfFromUrl(pdfUrl || "");
  if (!pdfText) throw new Error("Failed to parse PDF");

  // 5. Extract today's dishes
  const dayNames = ["Måndag","Tisdag","Onsdag","Torsdag","Fredag"];
  const todayIndex = new Date().getDay();
  const todayName = dayNames[todayIndex - 1];
  
  const regex = new RegExp(`${todayName}[\\s\\S]*?(?=${dayNames.join("|")}|$)`, "i");
  const match = pdfText.match(regex);
  if (!match) throw new Error(`Could not find dishes for ${todayName}`);
  
  const courses = [{ diet: "all", desc: readSwedishDish(match[0]) }];

  const vegMatch = pdfText.match(/Vegetarisk\/Vegetarian[\s\S]*/i);
  if (vegMatch) courses.push({ diet: "veg", desc: readSwedishDish(vegMatch[0]) });

  // Dishes that are always on the lunch menu, each one is a Swedish line, an English line and a price
  const alwaysMatch = pdfText.match(/Always on the menu([\s\S]*?)Något Sött/i);
  if (alwaysMatch) {
    const groups = /** @type {string} */ (alwaysMatch[1]).split(/^\s*\d+\s?kr\s*$/im);
    for (const group of groups) {
      const desc = group.split(/\r?\n/).map(l => l.trim()).find(Boolean);
      if (desc) courses.push({ diet: "all", desc });
    }
  }

  return courses;
}

/**
 * The line after the header is the Swedish dish, it continues on the next line when it ends with "-"
 * @param {string} section
 */
function readSwedishDish(section) {
  const lines = section.split(/\r?\n/).slice(1);
  let dish = lines.shift()?.trim() ?? "";
  while (dish.endsWith("-") && lines.length) dish += lines.shift()?.trim();

  // The PDF text extraction turns the "f" of the "fi" ligature into ";"
  return dish.replace(/;(?=\p{L})/gu, "f");
}
