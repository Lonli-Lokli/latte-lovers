/**
 * @class VirtualizedTableElement
 * A performant, themeable, and customizable web component for displaying large datasets in a table.
 * This version internally manages its state displays for maximum robustness and ease of use.
 *
 * @property {Array<object> | null} data - The array of data objects to display.
 * @property {Array<object>} columns - Array of column definitions.
 * @property {number} rowHeight - The fixed height of each row in pixels.
 * @property {boolean} loading - Set to true to display the loading state.
 * @property {string} initialMessage - The main text to show in the initial state.
 * @property {string} loadingMessage - The text to show in the loading state.
 * @property {string} emptyMessage - The main text to show when no data is available.
 * @property {string} emptySubMessage - The secondary text/paragraph for the empty state.
 * @property {Function | null} renderRow - A function to customize the entire <tr> element.
 *
 * @slot styles - Allows injecting a <link> or <style> tag for custom cell styling.
 */
class VirtualizedTableElement extends HTMLElement {
  // --- Internal State and DOM Element References ---
  _data = null;
  _columns = [];
  _rowHeight = 40;
  _buffer = 10;
  _renderRow = null;
  _isLoading = false;
  _scrollTop = 0;
  _isRendering = false;

  // --- Message Properties with Defaults ---
  _initialMessage = 'Table Ready';
  _loadingMessage = 'Loading...';
  _emptyMessage = 'No Results Found';
  _emptySubMessage = 'There is no data to display for the current filter.';

  // --- DOM Observers ---
  _resizeObserver = null;
  _themeObserver = null;

  // --- DOM Element References ---
  wrapper = null;
  sizer = null;
  content = null;
  headerTable = null;
  bodyTable = null;
  headerColGroup = null;
  bodyColGroup = null;
  thead = null;
  tbody = null;
  stateOverlay = null;
  stateTextHeader = null;
  stateTextParagraph = null;

  // --- Internal Variables ---
  _lastTooltipListenerKey = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._setupStyles();
    this._setupDOM();
    // Create tooltip element only once
    this._tooltip = document.createElement('div');
    this._tooltip.className = 'tooltip';
    this._tooltip.style.cssText = `
      position: fixed;
      background: var(--surface-color);
      color: var(--text-color);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      max-width: 250px;
      border: 1px solid var(--border-color);
    `;
    document.body.appendChild(this._tooltip);
  }

  connectedCallback() {
    this._attachEventListeners();
    this._updateViewState();
    this._checkInitialTheme();
    // Attach tooltip delegation once
    this._attachTooltipDelegation();
  }

  disconnectedCallback() {
    if (this.wrapper)
      this.wrapper.removeEventListener('scroll', this._handleScroll);
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._themeObserver) this._themeObserver.disconnect();
    if (this.tbody) {
      this.tbody.removeEventListener('mouseenter', this._onTooltipEvent, true);
      this.tbody.removeEventListener('mouseleave', this._onTooltipEvent, true);
      this.tbody.removeEventListener('touchstart', this._onTooltipEvent, true);
      this.tbody.removeEventListener('touchend', this._onTooltipEvent, true);
    }
  }

  // --- Public API: Properties ---

  get data() {
    return this._data;
  }
  set data(newData) {
    this._data = newData;
    if (this.wrapper) {
      this.wrapper.scrollTop = 0;
      this._scrollTop = 0;
    }
    this._updateSizer();
    this._updateViewState();
    this._scheduleRender();
  }

  get columns() {
    return this._columns;
  }
  set columns(newColumns) {
    this._columns = Array.isArray(newColumns) ? newColumns : [];
    this._renderHeader();
    this._renderColumnGroups();
    this._updateViewState();
  }

  get loading() {
    return this._isLoading;
  }
  set loading(isLoading) {
    this._isLoading = !!isLoading;
    this._updateViewState();
  }

  get rowHeight() {
    return this._rowHeight;
  }
  set rowHeight(h) {
    this._rowHeight = Number(h) || 40;
    this._updateSizer();
    this._scheduleRender();
  }

  get renderRow() {
    return this._renderRow;
  }
  set renderRow(fn) {
    this._renderRow = typeof fn === 'function' ? fn : null;
    this._scheduleRender();
  }

  // --- Public API: Customizable Messages ---
  get initialMessage() {
    return this._initialMessage;
  }
  set initialMessage(msg) {
    this._initialMessage = msg;
    this._updateViewState();
  }

  get loadingMessage() {
    return this._loadingMessage;
  }
  set loadingMessage(msg) {
    this._loadingMessage = msg;
    this._updateViewState();
  }

  get emptyMessage() {
    return this._emptyMessage;
  }
  set emptyMessage(msg) {
    this._emptyMessage = msg;
    this._updateViewState();
  }

  get emptySubMessage() {
    return this._emptySubMessage;
  }
  set emptySubMessage(msg) {
    this._emptySubMessage = msg;
    this._updateViewState();
  }

  // --- Internal Methods ---

  _setupStyles() {
    const style = document.createElement('style');
    style.textContent = `
            :host {
                --table-bg: #2a2a2a; --text-color: #e1e1e1; --border-color: #444; --header-bg: #3a3a3a;
                --row-bg-even: #333333; --row-hover-bg: #4f4f4f; --link-color: #58a6ff; --state-text-color: #999;
                --wrapper-border: 1px solid var(--border-color);

                display: block; height: 100%; width: 100%; contain: content; font-size: 14px;
                border-radius: 8px; overflow: hidden; position: relative;
            }
            :host([theme="light"]) {
                --table-bg: #ffffff; --text-color: #212529; --border-color: #dee2e6; --header-bg: #f8f9fa;
                --row-bg-even: #f8f9fa; --row-hover-bg: #f1f3f5; --link-color: #007bff; --state-text-color: #6c757d;
            }

            /* --- STATE MANAGEMENT (SIMPLIFIED) --- */
            .state-overlay {
                display: none; /* Hidden by default */
                position: absolute;
                inset: 0; /* top: 0; right: 0; bottom: 0; left: 0; */
                background-color: var(--table-bg);
                color: var(--state-text-color);
                z-index: 20;
                align-items: center; justify-content: center; flex-direction: column; text-align: center;
                padding: 20px;
            }
            .state-overlay h3 { margin: 15px 0 5px 0; font-size: 1.1em; }
            .state-overlay p { margin: 0; font-size: 0.9em; }
            .state-overlay .loader {
                border: 4px solid rgba(120,120,120,0.3); border-top-color: #fff;
                border-radius: 50%; width: 40px; height: 40px;
                animation: spin 1s linear infinite;
            }
            :host([theme="light"]) .state-overlay .loader { border-top-color: #333; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

            .virtual-table-wrapper { display: none; } /* Hide table wrapper by default */

            /* Show the correct UI based on host state */
            :host([state="data"]) .virtual-table-wrapper { display: block; }
            :host(:not([state="data"])) .state-overlay { display: flex; }
            :host(:not([state="loading"])) .state-overlay .loader { display: none; }
            :host([state="initial"]) .state-overlay p { display: none; }

            /* --- CORE LAYOUT & STYLES (RE-VERIFIED) --- */
            .virtual-table-wrapper {
                height: 100%; width: 100%; overflow: auto; position: relative;
                border: var(--wrapper-border); box-sizing: border-box; border-radius: 8px;
                /* Ensure stacking context for header z-index */
                z-index: 0;
            }
            .virtual-table {
                width: 100%;
                border-collapse: collapse;
                color: var(--text-color);
                table-layout: auto; /* Use auto layout for content-fit columns */
            }
            .virtual-table--header {
                position: sticky; top: 0; z-index: 2; background-color: var(--header-bg);
                /* Ensure header is above body */
            }
            .virtual-table--body {
                z-index: 1;
                position: relative;
            }
            .virtual-table th,
            .virtual-table td {
                padding: 0.75rem 1rem;
                text-align: center;
                border-bottom: 1px solid var(--border-color);
                /* white-space: nowrap; */
                /* overflow: hidden; */
                /* text-overflow: ellipsis; */
                box-sizing: border-box;
                /* Remove width: 1% and max-width for fixed layout */
                min-width: max-content;
            }
            .virtual-table th {
                white-space: nowrap;
                word-break: normal;
                min-height: unset;
            }
            .virtual-table thead th { background-color: var(--header-bg); }
            .virtual-table tbody tr:hover td { background-color: var(--row-hover-bg); }
            .virtual-table-body-container { position: relative; } /* Positioning context for content */
            .virtual-table-sizer { position: relative; width: 100%; }
            .virtual-table-content { position: absolute; top: 0; left: 0; width: 100%; }

           @media (max-width: 768px) {
    .virtual-table th,
    .virtual-table td {
        padding: 0.375rem 0.5rem;
        font-size: 0.75rem;
    }
}
        `;

    this.shadowRoot.appendChild(style);
  }

  _setupDOM() {
    const styleSlot = document.createElement('slot');
    styleSlot.name = 'styles';
    styleSlot.addEventListener('slotchange', (e) => {
      const assigned = styleSlot.assignedNodes();
      assigned.forEach((node) => {
        if (node.nodeName === 'LINK' && node.rel === 'stylesheet') {
          // Clone and append to shadowRoot if not already present
          if (!Array.from(this.shadowRoot.querySelectorAll('link')).some((l) => l.href === node.href)) {
            const clone = node.cloneNode();
            this.shadowRoot.appendChild(clone);
          }
        } else if (node.nodeName === 'STYLE') {
          // Clone and append <style> if not already present (by textContent)
          if (!Array.from(this.shadowRoot.querySelectorAll('style')).some((s) => s.textContent === node.textContent)) {
            const clone = node.cloneNode(true);
            this.shadowRoot.appendChild(clone);
          }
        }
      });
    });

    // --- Internal State Overlay ---
    this.stateOverlay = document.createElement('div');
    this.stateOverlay.className = 'state-overlay';
    const loader = document.createElement('div');
    loader.className = 'loader';
    this.stateTextHeader = document.createElement('h3');
    this.stateTextParagraph = document.createElement('p');
    this.stateOverlay.append(
      loader,
      this.stateTextHeader,
      this.stateTextParagraph,
    );

    // --- Table Structure ---
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'virtual-table-wrapper';
    this.headerTable = document.createElement('table');
    this.headerTable.className = 'virtual-table virtual-table--header';
    this.headerColGroup = document.createElement('colgroup');
    this.thead = document.createElement('thead');
    this.headerTable.append(this.headerColGroup, this.thead);
    const bodyContainer = document.createElement('div');
    bodyContainer.className = 'virtual-table-body-container';
    this.sizer = document.createElement('div');
    this.sizer.className = 'virtual-table-sizer';
    this.content = document.createElement('div');
    this.content.className = 'virtual-table-content';
    this.bodyTable = document.createElement('table');
    this.bodyTable.className = 'virtual-table virtual-table--body';
    this.bodyColGroup = document.createElement('colgroup');
    this.tbody = document.createElement('tbody');
    this.bodyTable.append(this.bodyColGroup, this.tbody);
    this.content.appendChild(this.bodyTable);
    bodyContainer.append(this.sizer, this.content);
    this.wrapper.append(this.headerTable, bodyContainer);

    // Append all to shadow root
    this.shadowRoot.append(styleSlot, this.stateOverlay, this.wrapper);
  }

  _attachEventListeners() {
    this._handleScroll = this._handleScroll.bind(this);
    this.wrapper.addEventListener('scroll', this._handleScroll, {
      passive: true,
    });
    this._resizeObserver = new ResizeObserver(() => this._scheduleRender());
    this._resizeObserver.observe(this.wrapper);
    this._themeObserver = new MutationObserver((m) => {
      if (m[0].attributeName === 'class') this._setThemeAttribute(m[0].target);
    });
    this._themeObserver.observe(document.body, { attributes: true });
  }

  _updateViewState() {
    let state = 'initial';
    if (this._isLoading) {
      state = 'loading';
    } else if (this._data === null) {
      state = 'initial';
    } else if (this._data.length === 0) {
      state = 'empty';
    } else {
      state = 'data';
    }
    this.setAttribute('state', state);

    // Update state message content
    switch (state) {
      case 'initial':
        this.stateTextHeader.textContent = this._initialMessage;
        this.stateTextParagraph.textContent = '';
        break;
      case 'loading':
        this.stateTextHeader.textContent = this._loadingMessage;
        this.stateTextParagraph.textContent = '';
        break;
      case 'empty':
        this.stateTextHeader.textContent = this._emptyMessage;
        this.stateTextParagraph.textContent = this._emptySubMessage;
        break;
    }
  }

  _handleScroll() {
    this._scrollTop = this.wrapper.scrollTop;
    this._scheduleRender();
  }
  _scheduleRender() {
    if (this._isRendering || this.getAttribute('state') !== 'data') return;
    this._isRendering = true;
    requestAnimationFrame(() => {
      this._render();
      this._isRendering = false;
    });
  }
  _checkInitialTheme() {
    this._setThemeAttribute(document.body);
  }
  _setThemeAttribute(t) {
    this.setAttribute(
      'theme',
      t.classList.contains('light-theme') ? 'light' : 'dark',
    );
  }
  _updateSizer() {
    if (this.sizer)
      this.sizer.style.height = `${(this._data?.length || 0) * this._rowHeight}px`;
  }
  _renderColumnGroups() {
    if (!this.headerColGroup || !this.bodyColGroup || !this._columns) return;
    // Support fixed width columns
    const c = this._columns
      .map((col) => {
        // Only set width if it's a number or a non-empty string not equal to 'auto'
        if (
          typeof col.width === 'number' ||
          (typeof col.width === 'string' && col.width.trim() && col.width !== 'auto')
        ) {
          const w = typeof col.width === 'number' ? `${col.width}px` : col.width;
          return `<col style="width: ${w}; min-width: ${w}; max-width: ${w};" width="${w}">`;
        }
        // For 'auto' or undefined width, just output <col>
        return '<col>';
      })
      .join('');
    this.headerColGroup.innerHTML = c;
    this.bodyColGroup.innerHTML = c;
  }
  _renderHeader() {
    if (!this.thead || !this._columns) return;
    this.thead.innerHTML = '';
    const r = document.createElement('tr');
    this._columns.forEach((c) => {
      const h = document.createElement('th');
      h.textContent = c.label;
      r.appendChild(h);
    });
    this.thead.appendChild(r);
  }

  _attachTooltipDelegation() {
    // Bind once for delegation
    let tooltipTimer = null;
    let lastCell = null;
    this._onTooltipEvent = (event) => {
      const type = event.type;
      let cell = event.target;
      // Find the closest td with data-has-tooltip
      while (cell && cell !== this.tbody && cell.nodeName !== 'TD') {
        cell = cell.parentElement;
      }
      if (!cell || cell.nodeName !== 'TD' || !cell.hasAttribute('data-has-tooltip')) {
        if (type === 'mouseleave' || type === 'touchend') {
          clearTimeout(tooltipTimer);
          this._tooltip.style.opacity = '0';
          lastCell = null;
        }
        return;
      }
      // Find column index
      const colIdx = Array.from(cell.parentNode.children).indexOf(cell);
      const rowIdx = Array.from(this.tbody.children).indexOf(cell.parentNode);
      const col = this._columns[colIdx];
      if (!col || !col.tooltipTemplate) return;
      const data = this._data[rowIdx + Math.max(0, Math.floor(this._scrollTop / this._rowHeight) - this._buffer)];
      const cellData = data[col.key];
      const tooltipContent = col.tooltipTemplate(cellData, data);
      if (type === 'mouseenter' || type === 'touchstart') {
        clearTimeout(tooltipTimer);
        lastCell = cell;
        tooltipTimer = setTimeout(() => {
          // Only show if still on the same cell
          if (lastCell !== cell) return;
          this._tooltip.innerHTML = tooltipContent;
          const rect = cell.getBoundingClientRect();
          const tooltipRect = this._tooltip.getBoundingClientRect();
          let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          let top = rect.bottom + 8;
          if (type === 'touchstart') {
            top = rect.top - tooltipRect.height - 8;
            if (left < 8) left = 8;
            if (left + tooltipRect.width > window.innerWidth - 8) {
              left = window.innerWidth - tooltipRect.width - 8;
            }
          }
          if (type === 'mouseenter') {
            if (left < 8) left = 8;
            if (left + tooltipRect.width > window.innerWidth - 8) {
              left = window.innerWidth - tooltipRect.width - 8;
            }
            if (top + tooltipRect.height > window.innerHeight - 8) {
              top = rect.top - tooltipRect.height - 8;
            }
          }
          this._tooltip.style.left = `${left}px`;
          this._tooltip.style.top = `${top}px`;
          this._tooltip.style.opacity = '1';
        }, 200); // 200ms delay before showing tooltip
      } else if (type === 'mouseleave' || type === 'touchend') {
        clearTimeout(tooltipTimer);
        this._tooltip.style.opacity = '0';
        lastCell = null;
      }
    };
    this.tbody.addEventListener('mouseenter', this._onTooltipEvent, true);
    this.tbody.addEventListener('mouseleave', this._onTooltipEvent, true);
    this.tbody.addEventListener('touchstart', this._onTooltipEvent, true);
    this.tbody.addEventListener('touchend', this._onTooltipEvent, true);
  }

  _render() {
    if (this.getAttribute('state') !== 'data' || !this._data) {
      this.tbody.innerHTML = '';
      return;
    }
    const vh = this.wrapper.clientHeight;
    let s = Math.floor(this._scrollTop / this._rowHeight);
    s = Math.max(0, s - this._buffer);
    const rc = Math.ceil(vh / this._rowHeight) + 2 * this._buffer;
    let e = Math.min(this._data.length, s + rc);
    const vd = this._data.slice(s, e);
    const o = s * this._rowHeight;
    this.content.style.transform = `translateY(${o}px)`;
    let rh = '';
    for (const rd of vd) {
      let ch = '';
      for (const c of this._columns) {
        const cd = rd[c.key];
        const cc = c.render ? c.render(cd, rd) : cd || '';
        let at = '';
        if (c.cellAttributes && typeof c.cellAttributes === 'function') {
          const as = c.cellAttributes(cd, rd);
          if (as) {
            at = Object.entries(as)
              .map(([k, v]) => `${k}="${String(v ?? '').replace(/"/g, '"')}"`)
              .join(' ');
          }
        }
        // Add a marker for tooltip if column has tooltipTemplate
        const tooltipMarker = c.tooltipTemplate ? ' data-has-tooltip="1"' : '';
        ch += `<td${at ? ' ' + at : ''}${tooltipMarker}>${cc}</td>`;
      }
      rh += this._renderRow
        ? this._renderRow(rd, ch)
        : `<tr style="height:${this._rowHeight}px;">${ch}</tr>`;
    }
    this.tbody.innerHTML = rh;

    // --- Synchronize column widths between header and body after DOM update ---
    requestAnimationFrame(() => {
      const firstRow = this.tbody.querySelector('tr');
      if (firstRow) {
        const tds = Array.from(firstRow.children);
        const widths = tds.map((td) => td.offsetWidth);
        const headerCols = this.headerColGroup.children;
        const bodyCols = this.bodyColGroup.children;
        for (let i = 0; i < widths.length; i++) {
          if (headerCols[i]) {
            headerCols[i].style.width = widths[i] + 'px';
            headerCols[i].setAttribute('width', widths[i]);
          }
          if (bodyCols[i]) {
            bodyCols[i].style.width = widths[i] + 'px';
            bodyCols[i].setAttribute('width', widths[i]);
          }
        }
        // Synchronize body table width to header table width for sticky effect
        const bodyTable = this.bodyTable;
        const headerTable = this.headerTable;
        if (bodyTable && headerTable) {
          const headerRect = headerTable.getBoundingClientRect();
          bodyTable.style.width = headerRect.width + 'px';
        }
      }
    });
  }
}

customElements.define('virtualized-table', VirtualizedTableElement);
