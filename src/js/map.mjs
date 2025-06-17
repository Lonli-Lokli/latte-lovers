import { match } from 'ts-pattern';
import {feature} from 'topojson-client';
import { geoWinkel3 } from 'd3-geo-projection';
import { geoPath } from 'd3-geo';
import { select, zoom } from 'd3';
import { countries110m as world } from '../data/countries-110m';
import { countryScores } from '../data/country-scores.mjs';
import { coffeeProfiles } from '../data/coffee-profiles.mjs';
import { normalizeScore } from '../scoring.mjs';

export function initializeMapTab() {
  initializeMapSvg();
}

function initializeMapSvg() {
  // Responsive container sizing
  const container = document.querySelector('.map-container');
  if (container) {
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.maxWidth = 'none';
    container.style.maxHeight = 'none';
    container.style.overflow = 'hidden';
    container.style.touchAction = 'none';
    container.style.margin = '0';
    container.style.padding = '0';
  }

  // Responsive SVG sizing
  const svg = select('#world-map')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 1000 500`)
    .style('display', 'block')
    .style('width', '100%')
    .style('height', '100%')
    .style('margin', '0')
    .style('padding', '0');

  // D3 zoom behavior
  svg.call(
    zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      }),
  );

  // Projection and path
  const projection = geoWinkel3()
    .scale(150)
    .translate([1000 / 2, 500 / 2]);
  const path = geoPath().projection(projection);

  // Create a group for all map elements (for zooming)
  let g = svg.select('g');
  if (g.empty()) g = svg.append('g');

  const countries = feature(world, world.objects.countries);

  // Draw countries
  g.selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .style('fill', (d) => {
      const countryName = d3CountryNameNormilizer(d.properties.name);
      const data = countryScores[countryName];
      // Use a light gray for countries with no data
      return data ? getColor(data.best.score) : 'var(--map-country-nodata)';
    })
    .style('stroke', '#333')
    .style('stroke-width', 0.5)
    .style('cursor', 'pointer')
    .on('mouseenter', function (event, d) {
      const countryName = d3CountryNameNormilizer(d.properties.name);
      const score = countryScores[countryName];
      const profile = coffeeProfiles[countryName];
      if (score) {
        select(this)
          .style('stroke', '#fff')
          .style('stroke-width', 2)
          .style('filter', 'brightness(1.2)');
        showTooltip(event, score, profile, d.properties.name);
      } else {
        hideTooltip(); // Hide tooltip if no data
      }
    })
    .on('mousemove', function (event, d) {
      const countryName = d3CountryNameNormilizer(d.properties.name);
      const data = countryScores[countryName];
      if (data) {
        moveTooltip(event);
      } else {
        hideTooltip(); // Hide tooltip if no data
      }
    })
    .on('mouseleave', function (event, d) {
      select(this)
        .style('stroke', '#333')
        .style('stroke-width', 0.5)
        .style('filter', 'none');
      hideTooltip();
    });

  // Update statistics
  //updateStatistics();
}

// Color mapping function
function getColor(score) {
  const norm = normalizeScore(score);
  let t, from, to;
  if (norm > 8) {
    // Green shade
    t = (norm - 8) / 2; // 8..10 => 0..1
    from = { r: 120, g: 200, b: 120 }; // light green
    to = { r: 46, g: 125, b: 50 }; // dark green
  } else if (norm >= 6) {
    // Yellow shade
    t = (norm - 6) / 2; // 6..8 => 0..1
    from = { r: 251, g: 192, b: 45 }; // light yellow
    to = { r: 255, g: 160, b: 0 }; // dark yellow
  } else {
    // Red shade
    t = norm / 6; // 0..6 => 0..1
    from = { r: 255, g: 138, b: 128 }; // light red
    to = { r: 198, g: 40, b: 40 }; // dark red
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  const r = Math.round(lerp(from.r, to.r, t));
  const g = Math.round(lerp(from.g, to.g, t));
  const b = Math.round(lerp(from.b, to.b, t));
  return `rgb(${r},${g},${b})`;
}

// Tooltip functions
function showTooltip(event, score, profile, countryName) {
  const tooltip = select('#tooltip');
  const titleElement = select('#tooltip-title');
  const contentElement = select('#tooltip-content');

  titleElement.text(score.name);

  const averageScore = Math.round(
    (normalizeScore(score.worst.score) + normalizeScore(score.best.score)) / 2,
  );

  contentElement.html(`
              <div class="score-country">
                    <strong>Country:</strong> ${countryName}
                </div>
                <div class="score-range">
                    <strong>Quality Range:</strong> ${normalizeScore(
                      score.worst.score,
                    ).toFixed(
                      1,
                    )} - ${normalizeScore(score.best.score).toFixed(1)}
                </div>
                <div class="score-range">
                    <strong>Average:</strong> ${averageScore}
                </div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${score.best}%"></div>
                </div>
                <div style="margin-top: 8px; font-size: 12px; line-height: 1.4;">
                    ${profile.notes}
                </div>
            `);

  // Mobile: pin tooltip to bottom, desktop: follow mouse
  if (window.innerWidth <= 768) {
    tooltip
      .classed('show', true)
      .style('position', 'fixed')
      .style('left', '0')
      .style('right', '0')
      .style('bottom', '0')
      .style('top', 'auto')
      .style('margin', '0 auto')
      .style('width', '100vw')
      .style('max-width', '100vw')
      .style('z-index', 9999);
  } else {
    tooltip
      .classed('show', true)
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', '#222')
      .style('color', '#fff')
      .style('border-radius', '8px')
      .style('box-shadow', '0 2px 12px rgba(0,0,0,0.3)')
      .style('padding', '16px 20px')
      .style('min-width', '220px')
      .style('max-width', '320px')
      .style('font-size', '15px')
      .style('line-height', '1.5')
      .style('z-index', 9999);
    moveTooltip(event);
  }
}

function moveTooltip(event) {
  if (window.innerWidth <= 768) return; // Don't move on mobile, it's pinned
  const tooltip = select('#tooltip');
  const container = document.querySelector('.map-container');
  const containerRect = container.getBoundingClientRect();
  const tooltipNode = tooltip.node();

  // Default position: right and slightly below the cursor
  let left = event.clientX - containerRect.left + 10;
  let top = event.clientY - containerRect.top - 10;

  // Prevent tooltip from overflowing right edge
  if (tooltipNode) {
    const tooltipWidth = tooltipNode.offsetWidth;
    if (left + tooltipWidth > containerRect.width) {
      left = event.clientX - containerRect.left - tooltipWidth - 10;
      if (left < 0) left = 0; // Clamp to left edge
    }
    // Prevent tooltip from overflowing bottom edge
    const tooltipHeight = tooltipNode.offsetHeight;
    if (top + tooltipHeight > containerRect.height) {
      top = containerRect.height - tooltipHeight - 10;
      if (top < 0) top = 0;
    }
  }

  tooltip.style('left', left + 'px').style('top', top + 'px');
}

function hideTooltip() {
  select('#tooltip').classed('show', false);
}

function updateStatistics() {
  const scores = Object.values(countryScores).map(
    (data) => (data.worst.score + data.best.score) / 2,
  );
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Find top producer (highest best score)
  let topProducer = '';
  let highestScore = 0;
  Object.entries(countryScores).forEach(([country, data]) => {
    if (data.best.score > highestScore) {
      highestScore = data.best.score;
      topProducer = country;
    }
  });

  document.getElementById('avg-score').textContent = avgScore.toFixed(1);
  document.getElementById('top-producer').textContent = topProducer;
  document.getElementById('countries-count').textContent =
    Object.keys(countryScores).length;
}

export const d3CountryNameNormilizer = (name) =>
  match(name)
    .with('Central African Rep.', () => 'central-african-republic')
    .with(`Côte d'Ivoire`, () => 'ivory-coast')
    .otherwise(() =>
      name
        .split(' ')
        .map((word) => word.toLowerCase())
        .join('-'),
    );
