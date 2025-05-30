export class ConnectionManager {
  constructor(svgElement) {
    this.svg = svgElement; // Manager is tied to this single SVG element
    this.connections = new Map(); // Store connections by ID
    this.setupSVGDefs();
  }

  setupSVGDefs() {
    // Create defs element for gradients and markers
    if (!this.svg.querySelector("defs")) {
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );
      this.svg.appendChild(defs);
    }
  }

  createConnection(
    id,
    selector1,
    selector2,
    labelText,
    colorBefore,
    colorAfter
  ) {
    // Remove existing connection if it exists
    this.removeConnection(id);

    const element1 = document.querySelector(selector1);
    const element2 = document.querySelector(selector2);

    if (!element1 || !element2) { // Corrected check: both elements must exist
      console.error(`Elements not found: ${selector1}, ${selector2}`);
      return null;
    }

    // Calculate positions
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const containerRect = this.svg.getBoundingClientRect(); // Use this.svg's rect

    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.bottom - containerRect.top;
    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top - containerRect.top;

    // Create connection group
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("data-connection-id", id);

    if (!labelText || labelText.trim() === "") {
      // Single line connection
      this.createSingleLine(group, x1, y1, x2, y2, colorBefore);
    } else {
      // Two-segment connection with label
      this.createLabeledConnection(
        group,
        x1,
        y1,
        x2,
        y2,
        labelText,
        colorBefore,
        colorAfter
      );
    }

    this.svg.appendChild(group); // Append to this.svg

    // Store connection data
    this.connections.set(id, {
      selector1,
      selector2,
      labelText,
      colorBefore,
      colorAfter,
      group,
    });

    return group;
  }

  createSingleLine(group, x1, y1, x2, y2, color) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "2");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-linecap", "round");

    group.appendChild(line);
  }

  createLabeledConnection(
    group,
    x1,
    y1,
    x2,
    y2,
    labelText,
    colorBefore,
    colorAfter
  ) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const boxWidth = Math.max(30, labelText.length * 8 + 16);
    const boxHeight = 24;

    // Calculate direction and intersection points
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    const absUnitX = Math.abs(unitX);
    const absUnitY = Math.abs(unitY);
    const boxHalfWidth = boxWidth / 2;
    const boxHalfHeight = boxHeight / 2;

    let connectionDistance;
    if (absUnitX * boxHalfHeight > absUnitY * boxHalfWidth) {
      connectionDistance = boxHalfWidth / absUnitX;
    } else {
      connectionDistance = boxHalfHeight / absUnitY;
    }

    const gapX = unitX * connectionDistance;
    const gapY = unitY * connectionDistance;

    // First line segment
    const line1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line1.setAttribute("x1", x1);
    line1.setAttribute("y1", y1);
    line1.setAttribute("x2", midX - gapX);
    line1.setAttribute("y2", midY - gapY);
    line1.setAttribute("stroke", colorBefore);
    line1.setAttribute("stroke-width", "2");
    line1.setAttribute("fill", "none");
    line1.setAttribute("stroke-linecap", "round");

    // Second line segment
    const line2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line2.setAttribute("x1", midX + gapX);
    line2.setAttribute("y1", midY + gapY);
    line2.setAttribute("x2", x2);
    line2.setAttribute("y2", y2);
    line2.setAttribute("stroke", colorAfter);
    line2.setAttribute("stroke-width", "2");
    line2.setAttribute("fill", "none");
    line2.setAttribute("stroke-linecap", "round");

    group.appendChild(line1);
    group.appendChild(line2);

    // Label box
    const labelBox = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    labelBox.setAttribute("x", midX - boxWidth / 2);
    labelBox.setAttribute("y", midY - boxHeight / 2);
    labelBox.setAttribute("width", boxWidth);
    labelBox.setAttribute("height", boxHeight);
    labelBox.setAttribute("rx", 6);
    labelBox.setAttribute("ry", 6);
    labelBox.setAttribute("fill", colorAfter);
    labelBox.setAttribute("stroke", colorAfter);
    labelBox.setAttribute("stroke-width", 1);
    labelBox.setAttribute("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    // Label text
    const labelTextEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    labelTextEl.setAttribute("x", midX);
    labelTextEl.setAttribute("y", midY + 4);
    labelTextEl.setAttribute("text-anchor", "middle");
    labelTextEl.setAttribute("fill", "#5D4037");
    labelTextEl.setAttribute("font-family", "Arial, sans-serif");
    labelTextEl.setAttribute("font-size", "11");
    labelTextEl.setAttribute("font-weight", "600");
    labelTextEl.textContent = labelText;

    group.appendChild(labelBox);
    group.appendChild(labelTextEl);
  }

  updateConnection(id, newLabelText, newColorBefore, newColorAfter) {
    const connection = this.connections.get(id);
    if (!connection) {
      console.error(`Connection ${id} not found`);
      return;
    }

    // Recreate the connection
    this.createConnection(
      id,
      connection.selector1,
      connection.selector2,
      newLabelText !== undefined ? newLabelText : connection.labelText,
      newColorBefore !== undefined ? newColorBefore : connection.colorBefore,
      newColorAfter !== undefined ? newColorAfter : connection.colorAfter
    );
  }

  removeConnection(id) {
    const connection = this.connections.get(id);
    if (connection && connection.group && connection.group.parentNode) {
      connection.group.remove();
    }
    this.connections.delete(id);
  }

  refreshAllConnections() {
    // Recreate all connections (useful for window resize)
    const connectionData = Array.from(this.connections.entries());
    this.connections.clear(); // Clear current connections before recreating

    connectionData.forEach(([id, data]) => {
      this.createConnection(
        id,
        data.selector1,
        data.selector2,
        data.labelText,
        data.colorBefore,
        data.colorAfter
      );
    });
  }

  clearAllConnections() {
      this.connections.forEach((connection, id) => {
          this.removeConnection(id);
      });
  }

  createVerticalConnection(
    id,
    selector1,
    selector2,
    labelText,
    colorBefore,
    colorAfter,
    xOffsetPercentage = 0.5 // Default to center (0.5)
  ) {
    // Remove existing connection if it exists
    this.removeConnection(id);

    const element1 = document.querySelector(selector1);
    const element2 = document.querySelector(selector2); // This will be the score element

    if (!element1 || !element2) {
      console.error(`Elements not found for vertical connection: ${selector1}, ${selector2}`);
      return null;
    }

    // Calculate positions
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect(); // Score element rect
    const containerRect = this.svg.getBoundingClientRect(); // Use this.svg's rect

    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.bottom - containerRect.top;

    // Calculate the horizontal position based on the xOffsetPercentage of the target element
    const targetX = rect2.left + (rect2.width * xOffsetPercentage) - containerRect.left;
    const targetY = rect2.top - containerRect.top; // Top of the score element

    const boxWidth = Math.max(30, labelText.length * 8 + 16);
    const boxHeight = 24;

    // Position the label box centered on the vertical line
    const labelBoxX = x1 - boxWidth / 2; // Center horizontally at x1
    const labelBoxY = (y1 + targetY) / 2 - boxHeight / 2; // Center vertically between y1 and targetY

    // Single vertical line segment
    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x1); // Keep x-coordinate same for vertical line
    line.setAttribute("y2", targetY); // Go down to the target element's top
    line.setAttribute("stroke", colorAfter); // Use colorAfter for the single line
    line.setAttribute("stroke-width", "2");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-linecap", "round");

    console.log(`Drawing vertical connection from (${x1}, ${y1}) to (${line.getAttribute('x2')}, ${line.getAttribute('y2')})`);
    console.log(`Label box at (${labelBoxX}, ${labelBoxY})`);
    console.log(`Label text at (${x1}, ${(y1 + targetY) / 2 + 4})`);

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("data-connection-id", id);

    group.appendChild(line);

    // Label box (centered on the horizontal segment)
    const labelBox = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    labelBox.setAttribute("x", labelBoxX);
    labelBox.setAttribute("y", labelBoxY);
    labelBox.setAttribute("width", boxWidth);
    labelBox.setAttribute("height", boxHeight);
    labelBox.setAttribute("rx", 6);
    labelBox.setAttribute("ry", 6);
    labelBox.setAttribute("fill", colorAfter);
    labelBox.setAttribute("stroke", colorAfter);
    labelBox.setAttribute("stroke-width", 1);
    labelBox.setAttribute("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    // Label text (centered on the horizontal segment)
    const labelTextEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    labelTextEl.setAttribute("x", x1); // Center text horizontally at x1
    labelTextEl.setAttribute("y", (y1 + targetY) / 2 + 4); // Center text vertically between y1 and targetY
    labelTextEl.setAttribute("text-anchor", "middle");
    labelTextEl.setAttribute("fill", "#5D4037");
    labelTextEl.setAttribute("font-family", "Arial, sans-serif");
    labelTextEl.setAttribute("font-size", "11");
    labelTextEl.setAttribute("font-weight", "600");
    labelTextEl.textContent = labelText;

    group.appendChild(labelBox);
    group.appendChild(labelTextEl);

    this.svg.appendChild(group); // Append to this.svg

    // Store connection data (optional, depends if we need to update these)
    this.connections.set(id, {
      selector1,
      selector2,
      labelText,
      colorBefore,
      colorAfter,
      group,
    });

    return group;
  }
}
