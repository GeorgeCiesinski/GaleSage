/**
 * Presentational component for API attribution.
 */
export default function Attribution() {
  return (
    <div className="attribution">
      <p className="open-street-map">
        Location data provided by ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          OpenStreetMap
        </a>
        .
      </p>
      <p className="visual-crossing">
        Weather data provided by{' '}
        <a href="https://www.visualcrossing.com/" target="_blank" rel="noreferrer">
          VisualCrossing
        </a>
        .
      </p>
    </div>
  )
}
