import { match } from "ts-pattern";
import * as topojson from "topojson-client";
import { geoWinkel3 } from "d3-geo-projection";
import { geoPath } from "d3-geo";
import { select, zoom } from "d3";
import { countries110m as world } from "../data/countries-110m";
import { coffeeScore, normalizeScore } from "../scoring.mjs";

const width = 1000;
const height = 500;

export function initializeMapTab() {
  initializeMapSvg();
}

function initializeMapSvg() {
  // Responsive container sizing
  const container = document.querySelector(".map-container");
  if (container) {
    container.style.width = "100%";
    container.style.maxWidth = "100vw";
    container.style.overflow = "hidden";
    container.style.touchAction = "none";
    container.style.height = "100dvh"; // Ensure full viewport height on mobile
    container.style.minHeight = "100dvh";
  }

  // Responsive SVG sizing
  const svg = select("#world-map")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 1000 500`)
    .style("display", "block")
    .style("max-width", "100vw")
    .style("height", "100dvh"); // Ensure SVG fills container vertically

  // D3 zoom behavior
  svg.call(
    zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        svg.selectAll("g").attr("transform", event.transform);
      })
  );

  // Projection and path
  const projection = geoWinkel3()
    .scale(150)
    .translate([1000 / 2, 500 / 2]);
  const path = geoPath().projection(projection);

  // Create a group for all map elements (for zooming)
  let g = svg.select("g");
  if (g.empty()) g = svg.append("g");

  const countries = topojson.feature(world, world.objects.countries);

  // Draw countries
  g.selectAll(".country")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", path)
    .style("fill", (d) => {
      const countryName = d3CountryNameNormilizer(d.properties.name);
      const data = coffeeScore[countryName];
      return data ? getColor(data.best.score) : "#555";
    })
    .style("stroke", "#333")
    .style("stroke-width", 0.5)
    .style("cursor", "pointer")
    .on("mouseenter", function (event, d) {
      const countryName = d3CountryNameNormilizer(d.properties.name);
      const data = coffeeScore[countryName];
      if (data) {
        select(this)
          .style("stroke", "#fff")
          .style("stroke-width", 2)
          .style("filter", "brightness(1.2)");
        showTooltip(event, data, d.properties.name);
      }
    })
    .on("mousemove", function (event, d) {
      const countryName = d3CountryNameNormilizer(d.properties.name);
      const data = coffeeScore[countryName];
      if (data) {
        moveTooltip(event);
      }
    })
    .on("mouseleave", function (event, d) {
      const countryName = d3CountryNameNormilizer(d.properties.name);
      const data = coffeeScore[countryName];
      if (data) {
        select(this)
          .style("stroke", "#333")
          .style("stroke-width", 0.5)
          .style("filter", "none");
        hideTooltip();
      }
    });

  // Update statistics
  //updateStatistics();
}

const allScores = Object.values(coffeeScore).map((data) =>
  normalizeScore(data.best.score)
);
const min = Math.min(...allScores);
const max = Math.max(...allScores);

// Color mapping function
function getColor(score) {
  // Normalize score to [0, 1]
  const t = (normalizeScore(score) - min) / (max - min);
  // Color stops
  const worst = { r: 198, g: 40, b: 40 }; // #c62828
  const good = { r: 251, g: 192, b: 45 }; // #fbc02d
  const best = { r: 46, g: 125, b: 50 }; // #2e7d32

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  let r, g, b;
  if (t <= 0.5) {
    // Interpolate from worst to good
    const localT = t / 0.5;
    r = Math.round(lerp(worst.r, good.r, localT));
    g = Math.round(lerp(worst.g, good.g, localT));
    b = Math.round(lerp(worst.b, good.b, localT));
  } else {
    // Interpolate from good to best
    const localT = (t - 0.5) / 0.5;
    r = Math.round(lerp(good.r, best.r, localT));
    g = Math.round(lerp(good.g, best.g, localT));
    b = Math.round(lerp(good.b, best.b, localT));
  }
  return `rgb(${r},${g},${b})`;
}

// Tooltip functions
function showTooltip(event, data, countryName) {
  const tooltip = select("#tooltip");
  const titleElement = select("#tooltip-title");
  const contentElement = select("#tooltip-content");

  titleElement.text(data.name);

  const averageScore = Math.round(
    (normalizeScore(data.worst.score) + normalizeScore(data.best.score)) / 2
  );

  contentElement.html(`
              <div class="score-country">
                    <strong>Country:</strong> ${countryName}
                </div>
                <div class="score-range">
                    <strong>Quality Range:</strong> ${normalizeScore(
                      data.worst.score
                    ).toFixed(1)} - ${normalizeScore(data.best.score).toFixed(1)}
                </div>
                <div class="score-range">
                    <strong>Average:</strong> ${averageScore}
                </div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${data.best}%"></div>
                </div>
                <div style="margin-top: 8px; font-size: 12px; line-height: 1.4;">
                    ${data.notes}
                </div>
            `);

  // Mobile: pin tooltip to bottom, desktop: follow mouse
  if (window.innerWidth <= 768) {
    tooltip
      .classed("show", true)
      .style("position", "fixed")
      .style("left", "0")
      .style("right", "0")
      .style("bottom", "0")
      .style("top", "auto")
      .style("margin", "0 auto")
      .style("width", "100vw")
      .style("max-width", "100vw")
      .style("z-index", 9999);
  } else {
    tooltip.classed("show", true);
    moveTooltip(event);
  }
}

function moveTooltip(event) {
  if (window.innerWidth <= 768) return; // Don't move on mobile, it's pinned
  const tooltip = select("#tooltip");
  const containerRect = document
    .querySelector(".map-container")
    .getBoundingClientRect();

  tooltip
    .style("left", event.clientX - containerRect.left + 10 + "px")
    .style("top", event.clientY - containerRect.top - 10 + "px");
}

function hideTooltip() {
  select("#tooltip").classed("show", false);
}

function updateStatistics() {
  const scores = Object.values(coffeeScore).map(
    (data) => (data.worst.score + data.best.score) / 2
  );
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Find top producer (highest best score)
  let topProducer = "";
  let highestScore = 0;
  Object.entries(coffeeScore).forEach(([country, data]) => {
    if (data.best.score > highestScore) {
      highestScore = data.best.score;
      topProducer = country;
    }
  });

  document.getElementById("avg-score").textContent = avgScore.toFixed(1);
  document.getElementById("top-producer").textContent = topProducer;
  document.getElementById("countries-count").textContent =
    Object.keys(coffeeScore).length;
}

export const d3CountryNameNormilizer = (name) =>
  match(name)
    .with("Central African Rep.", () => "central-african-republic")
    .with(`Côte d'Ivoire`, () => "ivory-coast")
    .otherwise(() =>
      name
        .split(" ")
        .map((word) => word.toLowerCase())
        .join("-")
    );
