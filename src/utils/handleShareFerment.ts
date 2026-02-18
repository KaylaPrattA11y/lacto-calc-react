import type { FermentEntry } from "../types";
import { formatter, getFormattedVal } from "./formatter";
import { toast } from "react-toastify";

export default function handleShareFerment(ferment: FermentEntry) {
  const { dateStart, fermentName, saltRequired, unit, brinePercentage, tags } = ferment;
  const title = fermentName ? fermentName : "My ferment";
  let text = '';

  try {
    if (dateStart) {
      text += `📅 Started on: ${formatter.date.format(new Date(dateStart))}\n`;
    }
    if (saltRequired && unit) {
      text += `🧂 Salt required: ${getFormattedVal(saltRequired, unit)}\n`;
    }
    if (brinePercentage) {
      text += `💧 Brine percentage: ${formatter.percent.format(brinePercentage / 100)}\n`;
    }
    if (tags && tags.length > 0) {
      text += `🏷️ Tags: ${tags.join(', ')}\n`;
    }
    text += `\nShared via Lact-Fermentation Tools (LFT) - ${import.meta.env.VITE_API_URL}`;
    navigator.share({ title, text })
  } catch(error) {
    console.error('Error sharing:', error);
    toast.error('Failed to share the ferment entry. Uh... sorry.');
  }
}
