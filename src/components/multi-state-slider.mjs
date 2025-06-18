// components/three-state-slider.js
class ThreeStateSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.options = [];
    this.currentValue = null;
    this.compact = false;
    this._handleResize = this._handleResize.bind(this);
  }

  static get observedAttributes() {
    return ['value', 'width', 'height', 'options'];
  }

  connectedCallback() {
    this.parseOptions();
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
    this._themeObserver = new MutationObserver(() => this._updateThemeAttribute());
    this._themeObserver.observe(document.body, { attributes: true });
    this._updateThemeAttribute();
    this.render();
    this.addEventListeners();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._handleResize);
    if (this._themeObserver) this._themeObserver.disconnect();
  }

  _updateThemeAttribute() {
    if (document.body.classList.contains('light-theme')) {
      this.setAttribute('theme', 'light');
    } else {
      this.setAttribute('theme', 'dark');
    }
  }

  _handleResize() {
    const wasCompact = this.compact;
    this.compact = window.matchMedia('(max-width: 480px)').matches;
    if (wasCompact !== this.compact) {
      this.render();
      this.addEventListeners();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'value') {
        this.currentValue = newValue;
        this.updateUI();
      } else if (name === 'options') {
        this.parseOptions();
        this.render();
        this.addEventListeners();
      } else {
        this.render();
      }
    }
  }

  parseOptions() {
    // Parse options from attribute or child elements
    const optionsAttr = this.getAttribute('options');

    if (optionsAttr) {
      // Parse from JSON attribute: options='[{"value":"best","label":"Best","color":"#10b981"}, ...]'
      try {
        this.options = JSON.parse(optionsAttr);
      } catch (e) {
        // Parse from simple string: options="best,all,worst"
        this.options = optionsAttr.split(',').map((opt) => ({
          value: opt.trim(),
          label: opt.trim().charAt(0).toUpperCase() + opt.trim().slice(1),
          color: this.getDefaultColor(opt.trim()),
        }));
      }
    } else {
      // Parse from child <option> elements
      const optionElements = this.querySelectorAll('option');
      this.options =
        optionElements.length > 0
          ? Array.from(optionElements).map((el) => ({
              value: el.getAttribute('value') || el.textContent.toLowerCase(),
              label: el.textContent,
              color:
                el.getAttribute('color') ||
                this.getDefaultColor(
                  el.getAttribute('value') || el.textContent.toLowerCase(),
                ),
            }))
          : [
              { value: 'best', label: 'Best', color: '#10b981' },
              { value: 'all', label: 'All', color: '#6366f1' },
              { value: 'worst', label: 'Worst', color: '#ef4444' },
            ];
    }

    // Set initial value if not set
    if (!this.currentValue && this.options.length > 0) {
      this.setValue(this.getAttribute('value') || this.options[0].value);
    }
  }

  getDefaultColor(value) {
    const colorMap = {
      best: '#10b981',
      good: '#22c55e',
      all: '#6366f1',
      any: '#6366f1',
      worst: '#ef4444',
      bad: '#f87171',
      high: '#10b981',
      medium: '#f59e0b',
      low: '#ef4444',
      yes: '#10b981',
      no: '#ef4444',
      maybe: '#6366f1',
    };
    return colorMap[value.toLowerCase()] || '#64748b';
  }

  render() {
    const width = this.getAttribute('width'); // Only use if explicitly set
    const height = this.getAttribute('height') || '36px';
    const optionCount = this.options.length;
    const optionWidth = optionCount > 0 ? `${100 / optionCount}%` : '33.333%';

    // Generate CSS custom properties for colors
    const colorProperties = this.options
      .map((opt, index) => `--color-${opt.value}: ${opt.color};`)
      .join('\n        ');

    // Generate dark theme colors (lighter versions)
    const darkColorProperties = this.options
      .map((opt, index) => {
        const lightColor = this.lightenColor(opt.color, 20);
        return `--color-${opt.value}: ${lightColor};`;
      })
      .join('\n          ');

    // Generate option elements (compact mode: only first letter)
    const optionElements = this.options
      .map(
        (opt) =>
          `<div class="option" data-value="${opt.value}">${
            this.compact ? opt.label.charAt(0) : opt.label
          }</div>`,
      )
      .join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host([theme="dark"]) {
          --slider-bg-primary: #0f172a;
          --slider-bg-secondary: #1e293b;
          --slider-text-primary: #f1f5f9;
          --slider-text-secondary: #94a3b8;
          --slider-border-color: #334155;
          --slider-track-bg: #334155;
          ${darkColorProperties}
          display: inline-block;
        }
        :host([theme="light"]) {
          --slider-bg-primary: #f8fafc;
          --slider-bg-secondary: #e2e8f0;
          --slider-text-primary: #1e293b;
          --slider-text-secondary: #334155;
          --slider-border-color: #cbd5e1;
          --slider-track-bg: #e0e7ef;
          ${colorProperties}
        }

        .slider {
          position: relative;
          display: flex;
          align-items: stretch;
          background: var(--slider-track-bg);
          border-radius: 8px;
          padding: 3px;
          ${width ? `width: ${width};` : ''}
          max-width: 340px;
          height: ${height};
          min-height: ${height};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
          /* Remove gap to make options fill all space */
          gap: 0;
        }

        .option {
          flex: 1 1 0%;
          min-width: 0;
          /* Remove margin and padding that could affect width */
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-size: 13px;
          font-weight: 500;
          color: var(--slider-text-secondary);
          cursor: pointer;
          border-radius: 6px;
          transition: color 0.2s ease, background 0.2s ease;
          user-select: none;
          position: relative;
          z-index: 2;
          background: none;
        }

        .option.active {
          color: #fff;
          background: var(--color-active, #6366f1);
        }

        .option:hover:not(.active) {
          color: var(--slider-text-primary);
        }

        @media (max-width: 768px) {
          .slider {
            height: 28px !important;
            min-height: 24px;
            padding: 1px;
            border-radius: 6px;
            max-width: 110px;
            width: auto !important;
            gap: 2px; /* smaller gap for mobile */
          }
          .option {
            font-size: 11px !important;
            padding: 0 4px !important;
            min-width: 22px;
            height: 24px;
            border-radius: 4px;
            margin: 0 1px;
          }
        }
        @media (min-width: 769px) {
          .slider {
            max-width: 340px !important;
            gap: 12px !important;
          }
          .option {
            margin: 0 !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .indicator {
            transition: none;
          }
        }
      </style>
      
      <div class="slider">
        ${optionElements}
      </div>
    `;
    this.updateUI(); // Ensure active class is set after rendering
  }

  lightenColor(color, percent) {
    // Simple color lightening for dark theme
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const lighten = (c) =>
      Math.min(255, Math.floor(c + (255 - c) * (percent / 100)));

    return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`;
  }

  addEventListeners() {
    const options = this.shadowRoot.querySelectorAll('.option');
    options.forEach((option) => {
      option.addEventListener('click', () => {
        this.setValue(option.dataset.value);
      });
    });
  }

  setValue(value) {
    if (
      this.currentValue !== value &&
      this.options.some((opt) => opt.value === value)
    ) {
      this.currentValue = value;
      this.setAttribute('value', value);
      this.updateUI();
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            value,
            option: this.options.find((opt) => opt.value === value),
          },
          bubbles: true,
        }),
      );
    }
  }

  updateUI() {
    const options = this.shadowRoot.querySelectorAll('.option');
    options.forEach((option) => {
      const isActive = option.dataset.value === this.currentValue;
      option.classList.toggle('active', isActive);
      if (isActive) {
        // Set background color for active option
        const opt = this.options.find(o => o.value === this.currentValue);
        option.style.background = opt ? opt.color : '#6366f1';
        option.style.color = '#fff';
      } else {
        option.style.background = 'none';
        option.style.color = 'var(--slider-text-secondary)';
      }
    });
  }

  getValue() {
    return this.currentValue;
  }

  getSelectedOption() {
    return this.options.find((opt) => opt.value === this.currentValue);
  }

  addOption(value, label, color) {
    this.options.push({
      value,
      label,
      color: color || this.getDefaultColor(value),
    });
    this.render();
    this.addEventListeners();
  }

  removeOption(value) {
    this.options = this.options.filter((opt) => opt.value !== value);
    if (this.currentValue === value && this.options.length > 0) {
      this.setValue(this.options[0].value);
    }
    this.render();
    this.addEventListeners();
  }
}

// Register the custom element
customElements.define('three-state-slider', ThreeStateSlider);
