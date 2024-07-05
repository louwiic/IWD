import { RadarController } from "chart.js";

// https://www.chartjs.org/docs/latest/developers/charts.html#extending-existing-chart-types
class CustomRadarController extends RadarController {
  draw() {
    //super.draw(arguments);
    const ctx = this.chart.ctx;
    ctx.save();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    const meta = this.getMeta();
    for (let i = 0; i < meta.data.length; i++) {
      const point = meta.data[i];
      const { x, y } = point.getProps(["x", "y"]);
      const { radius } = point.options;
      ctx.strokeRect(x - radius, y - radius, 2 * radius, 2 * radius);
    }
    ctx.restore();
  }
}

CustomRadarController.id = "derivedRadar";
CustomRadarController.defaults = RadarController.defaults;

export default CustomRadarController;
