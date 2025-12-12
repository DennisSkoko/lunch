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
  
  // Take only 2nd line - Swedish course line
  const line = match[0].split(/\r?\n/)[1];
  return [{ diet: "all", desc: line }];
}
