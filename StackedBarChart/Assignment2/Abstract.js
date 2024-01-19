/**
 *	Function helps to create chart
 *	with the specified configuration.
 * @class AvisoCharts.Chart
 *	@constructor
 */
AvisoCharts.Chart = function (args) {
   if (!(this instanceof AvisoCharts.Chart))
      return new AvisoCharts.Chart(args);

   this.data = args.data || [];
   this.axis = args.axis || [];
   this.divId = args.divId || "chart";
   this.W = Number(args.width) || 500;
   this.H = Number(args.height) || 500;
   this.series = args.series || [];
   this.tooltipCfg = args.tooltipConfig || {};
   this.dataIndex = args.dataIndex || [];

   this.mixins = {
      Util: 'Util',
      Scale: 'Scale'
   };
   this.hasOwnProperty('attachMixin') ?
      this.attachMixin() :
      AvisoBase.call(this);

   this.attachMixin();
   this.initCharts();
}

/**
 *	method helps to initialise charts.
 *	@method initCharts
 */
AvisoCharts.Chart.prototype.initCharts = function () {
   var me = this;
   try {
      me.setMargin();
      me.setSVG();
      me.setScaleAxis();
      me.draw();
      me.setLegend();
      me.setChartTitle();
   } catch (err) {
      console.log(err.message);
   }
};
/**
 *	method helps to set scale and create each axis.
 *	@method setScaleAxis
 */
AvisoCharts.Chart.prototype.setScaleAxis = function () {
   var me = this,
      domainObj = me.generateDomains(),
      axisLen = me.axis.length,
      i;
   try {
      for (i = 0; i < axisLen; i++) {
         var d = axis[i],
            di = d.dataIndex,
            domain = me.getDomain(di, domainObj[di]),
            range = me.getRange(di, axisLen, me.width, me.height),
            axisPadding = me.getAxisPadding(di),
            axisObj;
         // generate scale for each axis
         me['scale_' + di] = me.getScales({
            domain: domain,
            range: range,
            scale: d.scale
         });
         // create axis object
         axisObj = new AvisoCharts.Axis({
            config: d,
            svg: me.svgGroup,
            scale: me['scale_' + di],
            width: me.width,
            height: me.height,
            bottom: me.margin.bottom,
            top: me.margin.top,
            left: me.margin.left,
            right: me.margin.right,
            grid: false,
            axisIndx: XAXIS_IDX,
            title: d.title,
            paddingLeft: axisPadding.left,
            paddingRight: axisPadding.right,
            plotIndex: d.index
         });
         me['axisObj_' + di] = axisObj['axis_' + di](me);
      }
   } catch (err) {
      console.log(err.message);
   }
};
/**
 * Function helps to set the margin for the svg
 *	@method	setMargin
 */
AvisoCharts.Chart.prototype.setMargin = function () {
   var me = this;
   try {
      me.margin = {
         top: 40,
         right: 60,
         bottom: 40,
         left: 60
      };
      me.width = me.W - (me.margin.left + me.margin.right);
      me.height = me.H - (me.margin.top + me.margin.bottom);
   } catch (err) {
      console.log(err.message);
   }
};
/**
 *	Method helps to create svg element
 *	@method setSVG
 */
AvisoCharts.Chart.prototype.setSVG = function () {
   var me = this,
      margin = me.margin,
      chartHeight = me.H,
      chartWidth = me.W;
   try {
      var maindiv = d3.select("#" + me.divId)
         .append("div")
         .attr('class', AVISO_CHART_MAIN_CLS);

      me.svg = maindiv.append("svg")
         .attr('class', AVISO_CHART_SVG_CLS)
         .attr('id', AVISO_CHART_SVG_ID + me.divId);

      me.svg.append("rect")
         .attr("x", 0)
         .attr("y", 0)
         .attr("height", chartHeight)
         .attr("width", chartWidth)
         .attr("class", AVISO_CHART_BOUND_RECT)
         .style("fill", CHART_THEME_COLOR);

      me.svgGroup = me.svg
         .attr('width', chartWidth)
         .attr('height', chartHeight)
         .attr('chartType', AXIS_CHART)
         .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      me.toolContr = maindiv.append("div")
         .attr('class', AVISO_CHART_TPL_CLS)
         .attr('id', AVISO_CHART_TPL_CLS + "-" + me.divId);
   } catch (e) {
      console.log(e.message);
   }
};
/**
 *	Method helps to draw rectangle
 *	@method drawBar
 */
AvisoCharts.Chart.prototype.draw = function () {
   var me = this,
      seriesLen = me.series.length,
      i;
   try {
      me.setClipPath();

      for (i = 0; i < seriesLen; i++) {
         var series = me.series[i],
            xObj = me['axisObj_' + me.series[i].xField],
            xConfig = xObj.config,
            yObj = me['axisObj_' + me.series[i].yField],
            yConfig = yObj.config,
            xScale, xIndx, xScaleType,
            yScale, yIndx, yScaleType, chartType, yScaleIndex;
         if (xConfig.dataIndex == series.xField) {
            xScale = xObj.scale;
            xIndx = me.dataIndex.indexOf(xConfig.index);
            xScaleType = xConfig.scale;
         }
         if (yConfig.dataIndex == series.yField) {
            yScale = yObj.scale;
            yIndx = me.dataIndex.indexOf(yConfig.index);
            yScaleType = yConfig.scale;
            chartType = yConfig.chartType;
            yScaleIndex = series.yField;
         }

         var chartdata = me.data[i] && me.data[i].SEGMENT || [],
            options = {
               xScale: xScale,
               yScale: yScale,
               xScaleType: xScaleType,
               yScaleType: yScaleType,
               xIndx: xIndx,
               yIndx: yIndx,
               legendField: yScaleIndex,
               chartType: chartType,
               color: COLORS[i] || COLORS[0],
               data: chartdata
            };
         me.drawChart(options);
      }
   } catch (e) {
      console.log(e.message);
   }
};
/**
 *	Method helps to render chart based on its type
 * @method drawChart
 * @param {Object} config
 */
AvisoCharts.Chart.prototype.drawChart = function (config) {
   var me = this,
      chartType = config.chartType;
   try {
      switch (chartType) {
         case LINE_CHART:
            me.drawPath(config);
            me.drawCircle(config);
            break;
         case BAR_CHART:
            me.drawStackBar(config);
            break;
         default:
            me.drawCircle(config);
            break;
      }
   } catch (e) {
      console.log(e.message);
   }
};
/**
 *	Method helps to render stacked bar chart.
 * @method drawStackBar
 * @param {Object} config
 */
AvisoCharts.Chart.prototype.drawStackBar = function (config) {
   var me = this,
      xScale = config.xScale,
      yScale = config.yScale,
      data = config.data,
      categories = Array.from(new Set(data.map(item => item.groupIndex)));
   try {

      data = me.getStackData(data);
      // set color for each stack
      me.colorScale = me.getScales({
         domain: categories,
         range: COLORS,
         scale: CATEGORY
      });

      var stackedData = d3.stack().keys(categories)(data),
         barWidth = xScale.bandwidth() > 50 ? 50 : xScale.bandwidth(),
         pos = (xScale.bandwidth() - barWidth) / 2;

      me[DEFS_GRP + me.divId]
         .append("g")
         .attr('class', AVISO_CHART_STACK_GRP)
         .selectAll("." + AVISO_CHART_BAR_GRP)
         .data(stackedData)
         .enter().append("g")
         .attr("class", AVISO_CHART_BAR_GRP)
         .attr("fill", function (d) {
            return me.colorScale(d.key)
         })
         .attr("key-index", function (d) {
            return d.key;
         })
         .selectAll("rect")
         .data(function (d) {
            return d;
         })
         .enter().append("rect")
         .attr("x", function (d) {
            return barWidth == 50 ? pos + xScale(d.data.category) : xScale(d.data.category);
         })
         .attr("width", barWidth)
         .attr("y", function (d) {
            return yScale(d[1])
         })
         .attr("height", function (d) {
            return yScale(d[0]) - yScale(d[1])
         })
         .style("cursor", "pointer")
         .on("mouseover", function (d) {
            me.showTooltip(this, d);
         })
         .on("mouseout", function () {
            me.hideTooltip();
         });
   } catch (err) {
      console.log(err.message);
   }
};
/**
 *	Method helps to render line chart.
 * @method drawPath
 * @param {Object} config
 */
AvisoCharts.Chart.prototype.drawPath = function (config) {
   var me = config.scope || this,
      data = config.data,
      xScaleType = config.xScaleType;
   try {
      data = d3.merge(data.map(function (d) {
         return d.data;
      }));

      me[DEFS_GRP + me.divId]
         .append("g")
         .attr('class', AVISO_CHART_PATH_GRP)
         .append("path")
         .data([data])
         .attr("class", AVISO_CHART_LINE)
         .attr("d", me['line' + (xScaleType == ORDINAL ? 'Ordinal' : '')](config))
         .style("stroke", LINE_COLOR)
         .style("fill", NONE)
         .style("stroke-width", "1px");
   } catch (err) {
      console.log(err.message);
   }
};
/**
 *	Method helps to render circle chart.
 * @method drawCircle
 * @param {Object} config
 */
AvisoCharts.Chart.prototype.drawCircle = function (config) {
   var me = this,
      xScale = config.xScale,
      yScale = config.yScale,
      xIndex = config.xIndx,
      yIndex = config.yIndx,
      data = config.data,
      xScaleType = config.xScaleType,
      strokeColor = config.color,
      xbw = xScaleType == ORDINAL ? xScale.bandwidth() / 2 : 0;
   try {
      data = d3.merge(data.map(function (d) {
         return d.data;
      }));
      me[DEFS_GRP + me.divId]
         .append("g")
         .attr('class', AVISO_CHART_CIRCLE_GRP)
         .selectAll('.dot')
         .data(data)
         .enter().append('circle')
         .attr('class', AVISO_CHART_CIRCLE)
         .attr("r", RADIUS)
         .attr("cx", function (d) {
            var xVal = d[xIndex],
               cx = (xScale(xVal) + xbw);
            return cx;
         })
         .attr("cy", function (d) {
            var yVal = d[yIndex],
               cy = yScale(yVal);
            return cy;
         })
         .style("fill-opacity", 1)
         .style("fill", WHITE_COLOR)
         .style('stroke', strokeColor)
         .style("cursor", "pointer")
         .on('mouseover', function (d) {
            me.showTooltip(this, d);
         })
         .on('mouseout', function (d) {
            me.hideTooltip();
         });
   } catch (err) {
      console.log(err.message);
   }
};

/**
 *	Method helps to render linear line chart.
 * @method line
 * @param {Object} config
 */
AvisoCharts.Chart.prototype.line = function (config) {
   var xScale = config.xScale,
      yScale = config.yScale,
      xIndex = config.xIndx,
      yIndex = config.yIndx;
   return d3.line()
      .x(function (d) {
         var xVal = d[xIndex];
         return xScale(xVal);
      })
      .y(function (d) {
         var yVal = d[yIndex];
         return (yScale(yVal) + 0.5);
      });
};
/**
 *	Method helps to render ordinal line chart.
 * @method lineOrdinal
 * @param {Object} config
 */
AvisoCharts.Chart.prototype.lineOrdinal = function (config) {
   var xScale = config.xScale,
      yScale = config.yScale,
      xIndex = config.xIndx,
      yIndex = config.yIndx,
      xScaleType = config.xScaleType,
      bw = xScaleType == ORDINAL ? xScale.bandwidth() / 2 : 0;
   try {

      return d3.line()
         .x(function (d) {
            var val = d[xIndex],
               xPos = xScale(val) + bw;
            return xPos >= 0 ? xPos : NaN;
         })
         .y(function (d) {
            return yScale(d[yIndex]);
         });
   } catch (err) {
      console.log(err.message);
   }
};
/**
 *	Method helps to set clip path region for the chart.
 * @method setClipPath
 */
AvisoCharts.Chart.prototype.setClipPath = function () {
   var me = this,
      svg = me.svgGroup;
   try {
      var xPos = me.getAxisLeftPadding(),
         clipWidth = me.getScale_X0().range()[1] - xPos + 10;
      if (me[DEFS_GRP + me.divId]) {
         d3.select("#" + AVISO_CHART_GRP + me.divId).remove();
      } else {
         var def = svg.append("defs");
         def.append("clipPath")
            .attr("id", AVISO_CHART_CLIP + me.divId)
            .append("rect")
            .attr("x", xPos)
            .attr("y", 0)
            .attr("width", clipWidth)
            .attr("height", me.height);
      }
      me[DEFS_GRP + me.divId] = svg.append("g")
         .attr("id", AVISO_CHART_GRP + me.divId)
         .attr("clip-path", "url(#" + AVISO_CHART_CLIP + me.divId + ")");

   } catch (err) {
      console.log(err.message);
   }
};
/**
 * Method helps to set legend for the chart.
 * @method setLegend
 */
AvisoCharts.Chart.prototype.setLegend = function () {
   var me = this,
      categories = me.colorScale.domain();
   try {
      var legend = me.svgGroup
         .append("g")
         .attr('class', AVISO_CHART_LEGEND_GRP)
         .attr("transform", "translate(" + (me.width / 2) + ", -30)");

      legend.selectAll("rect")
         .data(categories)
         .enter().append("rect")
         .attr("x", function (d, i) {
            return i * LEGEND_TEXT_WIDTH;
         })
         .attr("width", LEGEND_RECT_SIZE)
         .attr("height", LEGEND_RECT_SIZE)
         .style("fill", function (d) {
            return me.colorScale(d)
         });

      legend.selectAll("text")
         .data(categories)
         .enter().append("text")
         .attr("x", function (d, i) {
            return i * LEGEND_TEXT_WIDTH + 20;
         })
         .attr("y", 9)
         .attr("dy", ".35em")
         .text(function (d) {
            return d;
         })
         .style("font-family", FONT_FAMILY)
         .style("font-size", TITLE_FONT_SIZE + "px");

   } catch (err) {
      console.log(err.message);
   }
};
/**
 * Method helps to set title for the chart.
 * @method setChartTitle
 */
AvisoCharts.Chart.prototype.setChartTitle = function () {
   var me = this;
   try {
      var chartTitle = me.svgGroup.append("g")
         .attr("class", AVISO_CHART_HEADER_CLS)
         .attr("transform", "translate(" + (10) + ", -20)");

      chartTitle.append("text")
         .text(AVISO_CHART_TITLE)
         .attr("font-weight", FONT_WEIGHT)
         .style("font-family", FONT_FAMILY)
         .style("font-size", TITLE_FONT_SIZE + "px");
   } catch (err) {
      console.log(err.message);
   }
};