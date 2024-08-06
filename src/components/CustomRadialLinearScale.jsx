import { RadialLinearScale } from "chart.js";
import {
  TAU,
  addRoundedRectPath,
  isNullOrUndef,
  renderText,
  toFont,
  toPadding,
  toTRBLCorners,
} from "chart.js/helpers";

const DEBUG = false;

function drawBackground(ctx, chartArea, backgroundColor) {
  ctx.save();
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
  ctx.restore();
}

function drawPointLabels(scale, labelCount) {
  const {
    ctx,
    options: { pointLabels },
  } = scale;

  const backdropColors = [
    ...Array(6).fill("rgba(150, 50, 226, 0.3)"),   // Vous aujourd'hui
    ...Array(12).fill("rgba(135, 0, 0, 0.3)"),     // Vos valeurs
    ...Array(9).fill("rgba(0, 38, 142, 0.2)"),     // Etat d'esprit
    ...Array(9).fill("rgba(226, 50, 50, 0.2)"),    // Communication
    ...Array(9).fill("rgba(226, 168, 50, 0.3)"),   // Confiance
    ...Array(10).fill("rgba(226, 220, 50, 0.2)"),   // Conflit
    ...Array(10).fill("rgba(168, 220, 50, 0.3)"),   // Résilience
    ...Array(16).fill("rgba(50, 226, 185, 0.4)"),  // Vous-même
     ...Array(8).fill("rgba(83, 109, 254, 0.2)"),   // Dans le futur
  ];

  const centerX = scale.xCenter;
  const centerY = scale.yCenter;
  const radius = scale.drawingArea;
  const labelPadding = 40;

  for (let i = 0; i < labelCount; i++) {
    const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
    const plFont = toFont(optsAtIndex.font);
    const angle = (Math.PI * 2 / labelCount) * i - Math.PI / 2;

    const labelX = centerX + Math.cos(angle) * (radius + labelPadding);
    const labelY = centerY + Math.sin(angle) * (radius + labelPadding);

    ctx.save();
    ctx.translate(labelX, labelY);

    const angleDegrees = (angle * 180) / Math.PI;
    let textAlign = "center";
    let textBaseline = "middle";
    let rotationAngle = angle;

    if (angleDegrees > 90 && angleDegrees < 270) {
      rotationAngle += Math.PI;
    }

    ctx.rotate(rotationAngle);

    const padding = toPadding(optsAtIndex.backdropPadding);
    const backdropColor = backdropColors[i];

    if (!isNullOrUndef(backdropColor)) {
      const borderRadius = toTRBLCorners(optsAtIndex.borderRadius);

      ctx.fillStyle = backdropColor;

      const textWidth = ctx.measureText(scale._pointLabels[i]).width;
      const textHeight = plFont.lineHeight;
      const backdropWidth = textWidth + padding.width;
      const backdropHeight = textHeight + padding.height;
      const backdropLeft = -backdropWidth / 2 - padding.left;
      const backdropTop = -backdropHeight / 2 - padding.top;

      if (Object.values(borderRadius).some((v) => v !== 0)) {
        ctx.beginPath();
        addRoundedRectPath(ctx, {
          x: backdropLeft,
          y: backdropTop,
          w: backdropWidth,
          h: backdropHeight,
          radius: borderRadius,
        });
        ctx.fill();
      } else {
        ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
      }
    }
    renderText(
      ctx,
      scale._pointLabels[i],
      0,
      0,
      plFont,
      {
        color: optsAtIndex.color,
        textAlign,
        textBaseline,
      }
    );
    ctx.restore();
  }
}

function drawGroupLabels(scale, groupLabels) {
  const {
    ctx,
    xCenter,
    yCenter,
    drawingArea,
    options: { pointLabels },
  } = scale;

  const radius = drawingArea + 80;
  const angleStep = (Math.PI * 2) / scale._pointLabels.length;
  const segmentSize = Math.floor(scale._pointLabels.length / groupLabels.length);

  for (let i = 0; i < groupLabels.length; i++) {
    const startIndex = i * segmentSize;
    const endIndex = (i + 1) * segmentSize;
    const midIndex = Math.floor((startIndex + endIndex) / 2);

    const angle = (angleStep * midIndex) - (Math.PI / 2);

    const labelX = xCenter + Math.cos(angle) * radius;
    const labelY = yCenter + Math.sin(angle) * radius;

    ctx.save();
    ctx.translate(labelX, labelY);

    let rotationAngle = angle;

    if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
      rotationAngle += Math.PI;
    }

    ctx.rotate(rotationAngle);

    const plFont = toFont(pointLabels.font);

    renderText(
      ctx,
      groupLabels[i],
      0,
      0,
      plFont,
      {
        color: pointLabels.color,
        textAlign: "center",
        textBaseline: "middle",
      }
    );

    ctx.restore();
  }
}

function drawRadiusLine(scale, gridLineOpts, radius, labelCount, borderOpts, fillStyle, index) {
  const ctx = scale.ctx;
  const circular = gridLineOpts.circular;

  const { color, lineWidth } = gridLineOpts;

  if ((!circular && !labelCount) || !color || !lineWidth || radius < 0) {
    return;
  }

  ctx.save();

  if (fillStyle && index >= 0 && index < 9) {
    const previousRadius = scale.getDistanceFromCenterForValue(scale.ticks[index - 1]?.value || 0);
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(scale.xCenter, scale.yCenter);
    ctx.arc(scale.xCenter, scale.yCenter, radius, 0, Math.PI * 2);
    ctx.arc(scale.xCenter, scale.yCenter, previousRadius, Math.PI * 2, 0, true);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(borderOpts.dash);
  ctx.lineDashOffset = borderOpts.dashOffset;

  ctx.beginPath();
  pathRadiusLine(scale, radius, circular, labelCount);
  ctx.closePath();
  ctx.stroke();

  if (index === 7) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = lineWidth * 3; // Épaisseur du trait doublée
    ctx.setLineDash(borderOpts.dash);
    ctx.lineDashOffset = borderOpts.dashOffset;
    ctx.beginPath();
    pathRadiusLine(scale, radius, circular, labelCount);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
}

function pathRadiusLine(scale, radius, circular, labelCount) {
  const { ctx } = scale;
  if (circular) {
    ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
  } else {
    let pointPosition = scale.getPointPosition(0, radius);
    ctx.moveTo(pointPosition.x, pointPosition.y);

    for (let i = 1; i < labelCount; i++) {
      pointPosition = scale.getPointPosition(i, radius);
      ctx.lineTo(pointPosition.x, pointPosition.y);
    }
  }
}

function drawSegment(ctx, startAngle, endAngle, innerRadius, outerRadius, fillStyle) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, outerRadius, startAngle, endAngle);
  ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
}

class CustomRadialLinearScale extends RadialLinearScale {
  drawGrid() {
    const ctx = this.ctx;
    const opts = this.options;
    const { angleLines, grid, border } = opts;
    const labelCount = this._pointLabels.length;

    let i, offset, position;

    const segmentColors = [
      '#607d8b', 
      '#78909c',  
      '#90a4ae',  
      '#b0bec5',  
      '#cfd8dc',  
      '#eceff1',  
      '#e0e0e0',  
      '#eeeeee',  
      '#f5f5f5',  
      '#fafafa',  
    ];

    const groupLabels = [
      // "Vous aujourd'hui", 'Vos valeurs', "Etat d'esprit", 'Communication', 'Confiance', 'Conflit', 'Résilience', 'Vous-même', 'Dans le futur'
    ];

    if (opts.pointLabels.display) {
      drawPointLabels(this, labelCount);
    }

    drawGroupLabels(this, groupLabels);

    if (grid.display) {
      this.ticks.forEach((tick, index) => {
        if (index !== 0) {
          offset = this.getDistanceFromCenterForValue(tick.value);
          const context = this.getContext(index);
          const optsAtIndex = grid.setContext(context);
          const optsAtIndexBorder = border.setContext(context);

          drawRadiusLine(
            this,
            optsAtIndex,
            offset,
            labelCount,
            optsAtIndexBorder,
            segmentColors[index - 1],
            index
          );
        }
      });
    }

    if (angleLines.display) {
      ctx.save();

      for (i = labelCount - 1; i >= 0; i--) {
        const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
        const { color, lineWidth } = optsAtIndex;

        if (!lineWidth || !color) {
          continue;
        }

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;

        ctx.setLineDash(optsAtIndex.borderDash);
        ctx.lineDashOffset = optsAtIndex.borderDashOffset;

        offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max);
        position = this.getPointPosition(i, offset);
        ctx.beginPath();
        ctx.moveTo(this.xCenter, this.yCenter);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
      }

      ctx.restore();
    }
  }
}

CustomRadialLinearScale.id = "derivedRadialLinearScale";
CustomRadialLinearScale.defaults = RadialLinearScale.defaults;

export default CustomRadialLinearScale;
