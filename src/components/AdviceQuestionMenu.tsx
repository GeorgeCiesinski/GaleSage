/**
 * Shared preset + custom Ask controls for city and day advice scopes.
 */
import { useId, useState } from 'react';

type AdviceQuestionMenuProps = {
  presets: readonly string[];
  onAsk: (question: string) => void;
  disabled?: boolean;
  scopeName: string;
  placeholder?: string;
};

/**
 * Renders a preset question select and an always-visible custom question form.
 *
 * Selecting a preset submits immediately. Custom submit calls onAsk with the
 * trimmed question. Does not fetch — parent handles the request.
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
  scopeName,
  placeholder,
}: AdviceQuestionMenuProps) {
  const selectId = useId();
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectValue, setSelectValue] = useState('');

  function handlePresetChange(value: string) {
    setSelectValue('');
    if (!value) return;
    onAsk(value);
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
      <form className="advice-ask__custom" onSubmit={handleCustomSubmit}>
        <input
          type="text"
          className="advice-ask__input"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={500}
          aria-label={`Ask a question about ${scopeName}`}
        />
        <button
          type="submit"
          className="advice-ask__submit"
          disabled={disabled || !customQuestion.trim()}
          aria-label={`Send question about ${scopeName}`}
        >
          Send
        </button>
      </form>

      <div className="advice-ask__list">
        <label className="advice-ask__label" htmlFor={selectId}>
          Select a question about {scopeName}
        </label>
        <select
          id={selectId}
          className="advice-ask__select"
          value={selectValue}
          disabled={disabled}
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          <option value="">or pick a common question…</option>
          {presets.map((question) => (
            <option key={question} value={question}>
              {question}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
