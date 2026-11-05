import {
  StrictMode,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type RefAttributes,
} from 'react';
import { createRoot } from 'react-dom/client';
import 'silenceui/style.css';
import { initTheme, toggleThemeMode } from 'silenceui/theme';
import type {
  AutoCompleteChangeDetail,
  AutoCompleteOption,
  SuAutoComplete,
} from 'silenceui/components/form/auto-complete';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'su-auto-complete': HTMLAttributes<SuAutoComplete> &
        RefAttributes<SuAutoComplete> & {
          name: string;
          label: string;
        };
    }
  }
}

initTheme();

const options: AutoCompleteOption[] = [
  { value: '上海', label: '上海' },
  { value: '杭州', label: '杭州' },
];

function CityField({ onChange }: { onChange: (detail: AutoCompleteChangeDetail) => void }) {
  const field = useRef<SuAutoComplete>(null);

  useEffect(() => {
    const element = field.current;
    if (!element) return;
    const lifetime = new AbortController();
    const change = (event: Event) =>
      onChange((event as CustomEvent<AutoCompleteChangeDetail>).detail);

    void import('silenceui/components/form/auto-complete').then(async () => {
      await customElements.whenDefined('su-auto-complete');
      if (lifetime.signal.aborted || !element.isConnected) return;
      element.options = options;
      element.required = true;
      element.addEventListener('change', change, { signal: lifetime.signal });
    });

    return () => lifetime.abort();
  }, [onChange]);

  return <su-auto-complete ref={field} name="city" label="城市" />;
}

function App() {
  const [shown, setShown] = useState(true);
  const [result, setResult] = useState<AutoCompleteChangeDetail>({ value: '', option: null });

  return (
    <main style={{ color: 'var(--su-text-1)', background: 'var(--su-bg-page)', padding: 24 }}>
      <h1>React 城市查询</h1>
      <button onClick={toggleThemeMode}>切换明暗</button>
      <button onClick={() => setShown(!shown)}>切换挂载</button>
      {shown && <CityField onChange={setResult} />}
      <p>
        当前值 <output id="value">{result.value}</output>
      </p>
    </main>
  );
}

createRoot(document.querySelector('#app')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
