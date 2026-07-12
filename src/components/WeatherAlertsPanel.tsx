/**
 * Presentational component for location-wide weather alerts.
 */
import { formatAlertPeriod, formatAlertSourceLabel } from '../utils/forecastFormatter';
import type { WeatherAlert } from '../types/weather';

type WeatherAlertsPanelProps = {
  alerts: WeatherAlert[];
};

/**
 * Renders active weather alerts for a location.
 *
 * Shows a compact banner per alert with headline, active period, a link to the
 * issuing agency, and an expandable details section for the full description.
 * Expects pre-filtered alerts from the weather client.
 *
 * @param props - Component props.
 * @param props.alerts - Active alert objects from the root-level API alerts array.
 * @returns Alert banners, or null when there are no alerts.
 */
export default function WeatherAlertsPanel({ alerts }: WeatherAlertsPanelProps) {
  if (!alerts.length) return null;

  return (
    <div className="weather-alerts" role="region" aria-label="Weather alerts">
      {alerts.map((alert) => (
        <article key={alert.id ?? alert.headline} className="weather-alert">
          <p className="weather-alert__headline">{alert.headline}</p>
          {(alert.onset || alert.ends) && (
            <p className="weather-alert__period">{formatAlertPeriod(alert.onset, alert.ends)}</p>
          )}

          {alert.link && (
            <a
              className="weather-alert__link"
              href={alert.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {formatAlertSourceLabel(alert.link)}
            </a>
          )}

          {alert.description && (
            <details className="weather-alert__details">
              <summary>Full alert details</summary>
              <p>{alert.description}</p>
            </details>
          )}
        </article>
      ))}
    </div>
  );
}
