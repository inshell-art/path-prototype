import './style.css';
import { pathGenerator } from './pathGenerator';

const app = document.querySelector('#app');
const controls = [
  { key: 'thought', label: 'THOUGHT' },
  { key: 'will', label: 'WILL' },
  { key: 'awa', label: 'AWA' },
];

const state = {
  thought: false,
  will: false,
  awa: false,
  willCount: 0,
};

const normalizeWillCount = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(10, parsed));
};

const applySequenceRules = (input) => ({
  ...input,
  thought: !!input.thought,
  will: !!input.thought && !!input.will,
  awa: !!input.will && normalizeWillCount(input.willCount) === 10 && !!input.awa,
  willCount: input.will ? normalizeWillCount(input.willCount) : 0,
});

const createDemoState = () => {
  return applySequenceRules({
    thought: Math.random() >= 0.5,
    will: Math.random() >= 0.5,
    awa: Math.random() >= 0.5,
    willCount: Math.random() >= 0.5 ? Math.floor(Math.random() * 11) : 0,
  });
};

const getSize = () => {
  return Math.max(240, Math.min(window.innerWidth - 120, window.innerHeight - 220, 760));
};

const syncRuleState = () => {
  Object.assign(state, applySequenceRules(state));
};

const render = () => {
  syncRuleState();
  const size = getSize();

  app.innerHTML = `
    <main class="frame">
      <h1>pathGenerator Output</h1>
      <p>Toggle each control to show/hide one square in the row.</p>
      <div class="controls">
        ${controls
          .map((item) => {
            const isOn = !!state[item.key];
            if (item.key === 'awa' && (!state.will || state.willCount !== 10)) {
              return `
                <div class="control-item">
                  <button type="button" class="toggle-btn off" disabled>AWA: NO</button>
                </div>
              `;
            }
            if (item.key === 'will' && !state.thought) {
              return `
                <div class="control-item">
                  <button type="button" class="toggle-btn off" disabled>WILL: NO</button>
                  <div class="will-number-control">
                    <label for="will-count-input">WILL count (0~10)</label>
                    <input id="will-count-input" type="number" min="0" max="10" value="${state.willCount}" disabled />
                  </div>
                </div>
              `;
            }
            const controlHtml = `<button type="button" class="toggle-btn ${isOn ? 'on' : 'off'}" data-key="${item.key}">${item.label}: ${isOn ? 'YES' : 'NO'}</button>`;
            if (item.key === 'will') {
              return `
                <div class="control-item">
                  ${controlHtml}
                  <div class="will-number-control">
                    <label for="will-count-input">WILL count (0~10)</label>
                    <input id="will-count-input" type="number" min="0" max="10" value="${state.willCount}" />
                  </div>
                </div>
              `;
            }
            return `<div class="control-item">${controlHtml}</div>`;
          })
          .join('')}
      </div>
      <div class="primary-output">
        ${pathGenerator([state.thought, state.will, state.awa], {
          size,
          willCount: state.willCount,
        })}
      </div>
    </main>
  `;

  app.querySelectorAll('[data-key]').forEach((button) => {
      button.addEventListener('click', () => {
        const key = button.dataset.key;
        state[key] = !state[key];
        render();
      });
  });

  const willCountInput = app.querySelector('#will-count-input');
  if (willCountInput) {
    const updateWillCount = () => {
      state.willCount = normalizeWillCount(willCountInput.value);
      render();
    };
    willCountInput.addEventListener('input', updateWillCount);
    willCountInput.addEventListener('change', updateWillCount);
  }
};

render();
window.addEventListener('resize', () => {
  render();
});
