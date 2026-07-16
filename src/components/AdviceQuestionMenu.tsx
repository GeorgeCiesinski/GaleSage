/**
 * Shared preset + custom Ask controls for city and day advice scopes.
 */
import { useEffect, useId, useRef, useState } from 'react';

type AdviceQuestionMenuProps = {
  presets: readonly string[];
  onAsk: (question: string) => void;
  disabled?: boolean;
  label: string;
};

/**
 * Renders a preset question select and an Ask control that reveals a custom input.
 *
 * Selecting a preset submits immediately. Ask reveals/focuses a text field; submit
 * calls onAsk with the trimmed question. Does not fetch — parent handles the request.
 *
 * @param props - Component props.
 * @param props.presets - Starter questions shown in the select.
 * @param props.onAsk - Called with a trimmed question string.
 * @param props.disabled - Disables controls while a request is in flight.
 * @param props.label - Accessible label for the preset select.
 * @returns The ask menu UI.
 */
export default function AdviceQuestionMenu({
  presets,
  onAsk,
  disabled = false,
  label,
}: AdviceQuestionMenuProps) {
  const selectId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectValue, setSelectValue] = useState('');

  useEffect(() => {
    if (showCustom) inputRef.current?.focus();
  }, [showCustom]);

  function handlePresetChange(value: string) {
    setSelectValue('');
    if (!value) return;
    onAsk(value);
  }

  function handleRevealAsk() {
    setShowCustom(true);
  }

  function handleCustomSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = customQuestion.trim();
    if (!trimmed || disabled) return;
    onAsk(trimmed);
    setCustomQuestion('');
  }

  return (
    <div className="advice-ask">
      <div className="advice-ask__row">
        <label className="advice-ask__label" htmlFor={selectId}>
          {label}
        </label>
        <select
          id={selectId}
          className="advice-ask__select"
          value={selectValue}
          disabled={disabled}
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          <option value="">Common questions…</option>
          {presets.map((question) => (
            <option key={question} value={question}>
              {question}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="advice-ask__ask-btn"
          onClick={handleRevealAsk}
          disabled={disabled}
        >
          Ask
        </button>
      </div>

      {showCustom ? (
        <form className="advice-ask__custom" onSubmit={handleCustomSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="advice-ask__input"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Ask a weather question…"
            disabled={disabled}
            maxLength={500}
            aria-label="Custom weather question"
          />
          <button
            type="submit"
            className="advice-ask__submit"
            disabled={disabled || !customQuestion.trim()}
          >
            Send
          </button>
        </form>
      ) : null}
    </div>
  );
}
