/**
 * Build short, non-LLM alert summaries for AI advice payloads.
 */
import { summarize } from 'textlens';
import type { SlimAlert, SlimAlerts } from '../types/advice';
import type { WeatherAlert } from '../types/weather';

const MAX_SUMMARY_LENGTH = 400;

/**
 * Removes URL-like tokens so link lines are not treated as summary sentences.
 * 
 * @param text - Input text to be stripped of URL like tokens.
 * @returns - Stripped text. 
 */
export function stripUrls(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\bwww\.\S+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Hard-caps summary length for token budget.
 * 
 * @param text - Input text.
 * @param maxLength - Maximum number of characters.
 */
export function truncate(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
}

/**
 * Turns an alert description into ~2 sentences, with headline/event fallback.
 * 
 * @param description - Long description of weather event.
 * @param headline - 1 sentence headline of the weather event.
 * @param event - One or more word description of event.
 */
export function summarizeAlertDescription(
  description?: string,
  headline?: string,
  event?: string,
): string {
  const cleaned = stripUrls(description ?? '').trim();

  if (cleaned) {
    const { sentences } = summarize(cleaned, { sentences: 2 });
    const joined = sentences.join(' ').trim();
    if (joined) return truncate(joined, MAX_SUMMARY_LENGTH);
  }

  return truncate(headline ?? event ?? '', MAX_SUMMARY_LENGTH);
}

/**
 * Maps active WeatherAlert[] into the shared slim alerts object for city/day asks.
 * 
 * @param alerts - Array containing weather alerts.
 * @returns - Slim alerts.
 */
export function buildSlimAlerts(alerts: WeatherAlert[]): SlimAlerts {
  const slim: SlimAlert[] = alerts.map((alert) => ({
    event: alert.event,
    headline: alert.headline,
    summary: summarizeAlertDescription(alert.description, alert.headline, alert.event),
    onset: alert.onset,
    ends: alert.ends,
  }));

  return {
    count: slim.length,
    alerts: slim,
  };
}
