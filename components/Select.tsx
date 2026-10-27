import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Option = { value: string; label: string };

/** WAI-ARIA "select-only combobox": focus stays on the button, the list follows it. */
export default function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const typed = useRef({ text: "", at: 0 });
  const current = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  const show = (i = current) => {
    setActive(i);
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };
  const move = (i: number) =>
    open ? setActive(Math.min(options.length - 1, Math.max(0, i))) : show();

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => move(active + 1),
      ArrowUp: () => move(active - 1),
      Home: () => show(0),
      End: () => show(options.length - 1),
      Enter: () => (open ? pick(active) : show()),
      " ": () => (open ? pick(active) : show()),
      Escape: () => setOpen(false),
      Tab: () => open && pick(active),
    };
    if (keys[e.key]) {
      if (e.key !== "Tab") e.preventDefault();
      keys[e.key]();
      return;
    }
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      const t = typed.current;
      t.text = (e.timeStamp - t.at < 600 ? t.text : "") + e.key.toLowerCase();
      t.at = e.timeStamp;
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
      if (hit >= 0) show(hit);
    }
  };

  return (
    <span className="sel" data-open={open}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      >
        {options[current]?.label}
      </button>
      {open && (
        <ul id={`${id}-list`} role="listbox" tabIndex={-1}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={o.value === value}
              data-active={i === active}
              // mousedown would blur the button and close the list before the click lands
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(i)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
