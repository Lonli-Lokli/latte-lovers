import { multipleSelect } from 'multiple-select-vanilla';
import '../components/multi-state-slider.mjs';
import '../components/virtualized-table.mjs';

import {
  applyFullProcessingEffects,
  applyRoastEffects,
  calculateLatteScore,
  normalizeScore,
  getCompatibilityGrade,
} from '../scoring.mjs';
import { coffeeProfiles } from '../data/coffee-profiles.mjs';
import { roastLevelEffects } from '../data/roast-levels.mjs';
import { processingMethods } from '../data/processing-methods.mjs';

export function initializeLeadersTab() {
  // Initialize filters and populate table via filters
  initializeLeadersFilters(
    coffeeProfiles,
    processingMethods,
    roastLevelEffects,
  );
}

// Variables to store multiple select instances
let msCountryInstance = null;
let msProcessingInstance = null;
let msRoastInstance = null;
let virtualizedTable = null;

// Function to initialize leaders table and filters using multiple-select-vanilla
export function initializeLeadersFilters(
  coffeeProfiles,
  processingMethods,
  roastLevelEffects,
) {
  const countryFilter = document.getElementById('countryFilterSelect');
  const processingFilter = document.getElementById('processingFilterSelect');
  const roastFilter = document.getElementById('roastFilterSelect');
  const originSelection = document.getElementById('originSelection');
  virtualizedTable = document.querySelector('virtualized-table');
  const allLeaders = generateAndRankLeaders(
    coffeeProfiles,
    processingMethods,
    roastLevelEffects,
  ); // Generate all leaders once

  // Populate select options
  function populateSelectOptions(selectElement, data, sort, textKey) {
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = '';

    // Convert to array and sort if needed
    const entries = Object.entries(data);
    if (sort) {
      entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    }

    for (const [key, itemData] of entries) {
      const option = document.createElement('option');
      const optionText = textKey
        ? itemData[textKey]
        : key
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '); // Capitalize key if no textKey

      option.value = key; // Use the key (e.g., 'brazil', 'washed') as the option value
      option.textContent = optionText;
      option.selected = true; // Auto-select this option
      selectElement.appendChild(option);
    }
  }

  // Populate options for each filter
  populateSelectOptions(countryFilter, coffeeProfiles, true, null);
  populateSelectOptions(
    processingFilter,
    processingMethods,
    false,
    'displayName',
  );
  populateSelectOptions(roastFilter, roastLevelEffects, false, null);

  const options = (name) => ({
    minimumCountSelected: 0,
    allSelectedText: name,
    countSelectedText: name,
    darkMode: !document.body.classList.contains('light-theme'),
  });
  msCountryInstance = multipleSelect(
    '.multiple-select.country',
    options('Country'),
  );
  msProcessingInstance = multipleSelect(
    '.multiple-select.process',
    options('Process'),
  );
  msRoastInstance = multipleSelect('.multiple-select.roast', options('Roast'));
  // Function to apply filters and update the table
  function applyFilters() {
    // Get selected values directly from native selects
    const selectedCountries = countryFilter
      ? Array.from(countryFilter.selectedOptions).map((option) => option.value)
      : Object.keys(coffeeProfiles);
    const selectedProcessings = processingFilter
      ? Array.from(processingFilter.selectedOptions).map(
          (option) => option.value,
        )
      : Object.keys(processingMethods);
    const selectedRoasts = roastFilter
      ? Array.from(roastFilter.selectedOptions).map((option) => option.value)
      : Object.keys(roastLevelEffects);

    let filteredLeaders = allLeaders.filter((leader) => {
      const leaderCountryKey = leader.country.toLowerCase().replace(/ /g, '-');
      const leaderProcessingEntry = Object.entries(processingMethods).find(
        ([key, method]) =>
          method.abbreviation === leader.processingAbbreviation,
      );
      const leaderProcessingKey = leaderProcessingEntry
        ? leaderProcessingEntry[0]
        : null;
      const leaderRoastKey = leader.roastDisplayName.toLowerCase();

      const countryMatch = selectedCountries.includes(leaderCountryKey);
      const processingMatch = selectedProcessings.includes(leaderProcessingKey);
      const roastMatch = selectedRoasts.includes(leaderRoastKey);

      return countryMatch && processingMatch && roastMatch;
    });

    // If 'Top per Origin' is checked, keep only the top entry per country
    if (originSelection) {
      const value = originSelection.getValue();
      switch (value) {
        case 'all':
          // do nothing, show all
          break;
        case 'best':
          // Top per country
          const topByCountry = {};
          for (const leader of filteredLeaders) {
            const key = leader.country;
            if (!topByCountry[key] || leader.score > topByCountry[key].score) {
              topByCountry[key] = leader;
            }
          }
          filteredLeaders = Object.values(topByCountry);
          filteredLeaders.sort((a, b) => b.score - a.score);
          break;
        case 'worst':
          // Worst per country
          const worstByCountry = {};
          for (const leader of filteredLeaders) {
            const key = leader.country;
            if (
              !worstByCountry[key] ||
              leader.score < worstByCountry[key].score
            ) {
              worstByCountry[key] = leader;
            }
          }
          filteredLeaders = Object.values(worstByCountry);
          filteredLeaders.sort((a, b) => a.score - b.score);
          break;
        default:
          throw new Error(`Unknown origin selection value: ${value}`);
      }
    }

    // Update table with filtered leaders
    if (virtualizedTable) {
      virtualizedTable.columns = [
        { key: 'rank', label: 'Rank', style: 'width:auto;min-width:2ch;max-width:4ch;text-align:right;' },
        { key: 'country', label: 'Country' },
        {
          key: 'processing',
          label: 'Processing',
          cellAttributes: (cell) => ({
            kind: 'processing',
            item: Object.entries(processingMethods).find(
              ([_, method]) => method.abbreviation === cell.abbreviation,
            )?.[0],
          }),
          render: (cell) => `<span class="abbreviation-mobile">${cell.abbreviation}</span>
                       <span class="fullname-desktop">${cell.displayName}</span>`,
          tooltipTemplate: (cell) => `${cell.displayName}: ${cell.description}`,
        },
        {
          key: 'roast',
          label: 'Roast',
          width: 'auto',
          cellAttributes: (cell) => ({
            kind: 'roast',
            item: Object.entries(roastLevelEffects).find(
              ([_, method]) => method.abbreviation === cell.abbreviation,
            )?.[0],
          }),
          render: (cell) => `<span class="abbreviation-mobile">${cell.abbreviation}</span>
                       <span class="fullname-desktop">${cell.displayName}</span>`,
          tooltipTemplate: (cell) => `${cell.displayName}: ${cell.description}`,
        },
        {
          key: 'score',
          label: 'Score',
          width: 50,
          render: (cell) => `${cell}/10`,
          cellAttributes: (_, row) => ({
            class: `table-score ${row.grade}`,
          }),
        },
      ];

      virtualizedTable.data = filteredLeaders.map((leader, index) => ({
        rank: index + 1,
        country: leader.country,
        processing: {
          abbreviation: leader.processingAbbreviation,
          displayName: leader.processingDisplayName,
          description: leader.processingDescription,
        },
        roast: {
          abbreviation: leader.roastAbbreviation,
          displayName: leader.roastDisplayName,
          description: leader.roastDescription,
        },
        score: leader.score,
        grade: leader.grade,
      }));

      // Attach tooltip logic to table after rendering
      setTimeout(() => attachTableTooltips(), 0);
    }

    function attachTableTooltips() {
      // Create or reuse tooltip element
      let tooltip = document.getElementById('table-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'table-tooltip';
        tooltip.className = 'tooltip';
        tooltip.style.cssText = `
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
        document.body.appendChild(tooltip);
      }

      function showTooltip(event, text) {
        const rect = event.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.bottom + 8;
        if (event.type === 'touchstart') {
          top = rect.top - tooltipRect.height - 8;
          if (left < 8) left = 8;
          if (left + tooltipRect.width > window.innerWidth - 8) {
            left = window.innerWidth - tooltipRect.width - 8;
          }
        }
        if (event.type === 'mouseenter') {
          if (left < 8) left = 8;
          if (left + tooltipRect.width > window.innerWidth - 8) {
            left = window.innerWidth - tooltipRect.width - 8;
          }
          if (top + tooltipRect.height > window.innerHeight - 8) {
            top = rect.top - tooltipRect.height - 8;
          }
        }
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.textContent = text;
        tooltip.style.opacity = '1';
      }
      function hideTooltip() {
        tooltip.style.opacity = '0';
      }
      document.querySelectorAll('[data-tooltip]').forEach((el) => {
        const text = el.getAttribute('data-tooltip');
        el.addEventListener('mouseenter', (e) => showTooltip(e, text));
        el.addEventListener('mouseleave', hideTooltip);
        el.addEventListener('touchstart', (e) => showTooltip(e, text), { passive: true });
        el.addEventListener('touchend', hideTooltip, { passive: true });
      });
    }
    initializeTooltips(); // Re-initialize tooltips for new table rows
  }

  // Add event listeners to native select change event
  if (countryFilter) {
    countryFilter.addEventListener('change', applyFilters);
  }
  if (processingFilter) {
    processingFilter.addEventListener('change', applyFilters);
  }
  if (roastFilter) {
    roastFilter.addEventListener('change', applyFilters);
  }
  if (originSelection) {
    originSelection.addEventListener('change', applyFilters);
  }

  // Initial table population and label state update
  applyFilters();

  // Observe theme changes on the body and update multi-selects
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        const isLightTheme = document.body.classList.contains('light-theme');
        const isDarkMode = !isLightTheme;

        if (msCountryInstance) {
          msCountryInstance.refreshOptions({ darkMode: isDarkMode });
        }
        if (msProcessingInstance) {
          msProcessingInstance.refreshOptions({ darkMode: isDarkMode });
        }
        if (msRoastInstance) {
          msRoastInstance.refreshOptions({ darkMode: isDarkMode });
        }
      }
    });
  });

  observer.observe(document.body, { attributes: true });
}

// Function to generate and rank all possible coffee combinations
function generateAndRankLeaders(
  coffeeProfiles,
  processingMethods,
  roastLevelEffects,
) {
  const leaders = [];

  for (const [country, countryObj] of Object.entries(coffeeProfiles)) {
    const profile = countryObj.profile;
    for (const [processingName, processing] of Object.entries(
      processingMethods,
    )) {
      for (const [roastName, roast] of Object.entries(roastLevelEffects)) {
        const processedProfile = applyFullProcessingEffects(
          profile,
          processingName,
          processingMethods,
        );
        const finalProfile = applyRoastEffects(
          processedProfile,
          roastName,
          roastLevelEffects,
        );
        const latteScoreRaw = calculateLatteScore(finalProfile);

        const normalizedLatteScore = normalizeScore(latteScoreRaw);

        leaders.push({
          country: country
            .replace(/-/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          processingAbbreviation: processing.abbreviation,
          processingDisplayName: processing.displayName,
          processingDescription: processing.description,
          roastAbbreviation: roast.abbreviation,
          roastDisplayName: roast.displayName,
          roastDescription: roast.description,
          score: parseFloat(normalizedLatteScore.toFixed(1)),
          grade: getCompatibilityGrade(normalizedLatteScore),
        });
      }
    }
  }

  // Sort leaders by score in descending order
  leaders.sort((a, b) => b.score - a.score);

  return leaders;
}

// Add tooltip functionality
export function initializeTooltips() {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.style.cssText = `
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
  document.body.appendChild(tooltip);

  // Handle tooltip display
  function showTooltip(event, text) {
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Position tooltip
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + 8;

    // Adjust position for mobile touch events
    if (event.type === 'touchstart') {
      top = rect.top - tooltipRect.height - 8; // Position above the element
      // Ensure tooltip is not off-screen to the left or right on mobile
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
    }

    // Adjust if tooltip would go off screen (for desktop hover)
    if (event.type === 'mouseenter') {
      if (left < 8) left = 8;
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
      if (top + tooltipRect.height > window.innerHeight - 8) {
        top = rect.top - tooltipRect.height - 8;
      }
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.textContent = text;
    tooltip.style.opacity = '1';
  }

  function hideTooltip() {
    tooltip.style.opacity = '0';
  }

  // Add event listeners to all processing abbreviations and full names
  document
    .querySelectorAll('.abbreviation-mobile, .fullname-desktop')
    .forEach((element) => {
      const processingName = element.parentElement.getAttribute('data-item');
      const cellKind = element.parentElement.getAttribute('data-kind');

      const processingSource =
        cellKind === 'processing'
          ? processingMethods
          : cellKind === 'roast'
            ? roastLevelEffects
            : null;
      if (!processingSource) {
        console.warn(`Unknown cell kind: ${cellKind}`);
        return;
      }

      const processing = processingSource[processingName];
      if (processing) {
        const tooltipText = `${processing.displayName}: ${processing.description}`;

        // Desktop hover
        element.addEventListener('mouseenter', (e) =>
          showTooltip(e, tooltipText),
        );
        element.addEventListener('mouseleave', hideTooltip);

        // Mobile touch
        element.addEventListener(
          'touchstart',
          (e) => showTooltip(e, tooltipText),
          { passive: true },
        );
        element.addEventListener('touchend', hideTooltip, { passive: true });
      }
    });
}
