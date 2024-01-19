/**
 *	Class that helps to create axis with multiple
 *	orientation. Axis will support the orientation in
 *	{bottom,left-Y0, right-Y1}
 *	@class AvisoCharts.Axis
 *	@constructor
 */
AvisoCharts.Axis = function (args) {
	this.mixins = {
		Util: 'Util'
	};
	AvisoBase.call(this);
	this.attachMixin();
	this.svg = args.svg || {};
	this.scale = args.scale || {};
	this.width = args.width || {};
	this.height = args.height || {};
	this.paddingLeft = args.paddingLeft;
	this.paddingRight = args.paddingRight;
	this.bottom = args.bottom || 0;
	this.top = args.top || 0;
	this.left = args.left || 0;
	this.right = args.right || 0;
	this.axisIdx = args.axisIndx || XAXIS_IDX;
	this.config = args.config || {};
	this.axisTitle = args.title || '';
	this.plotIndex = args.plotIndex || undefined;
};
/**
 *	Method helps to  draw axis in the bottom
 *	with the specified configuration.
 *	@method axis_X0
 *  @param {Object} args
 */
AvisoCharts.Axis.prototype.axis_X0 = function (args) {
	var me = this,
		axisConfig = d3.axisBottom(me.scale).tickSizeInner(5).tickSizeOuter(7);
	try {
		var axis = me.svg.append("g")
			.attr('class', AVISO_CHART_AXIS_CLS + ' ' + AVISO_CHART_AXIS_X0)
			.attr("transform", "translate( " + me.paddingLeft + "," + me.height + ")")
			.style("font-family", FONT_FAMILY)
			.style("fill", NONE)
			.style("font-size", FONT_SIZE + "px")
			.call(axisConfig);

		var txtpos = me.getTextWidth(me.axisTitle),
			pos = me.width / 2 - txtpos / 2;
		// creates axis title
		me.X0AxisTitle = me.svg.append("text")
			.attr("transform", "translate(" + (pos) + " ," + ((me.height + me.bottom) - 5) + ")")
			.attr('class', AVISO_CHART_AXIS_HEADER + ' ' + AVISO_CHART_AXIS_X0_TITLE)
			.style("font-family", FONT_FAMILY)
			.style("fill", BLACK)
			.style("font-size", FONT_SIZE + "px")
			.style("cursor", POINTER)
			.style("font-weight", FONT_WEIGHT)
			.style("opacity", OPACITY)
			.text(me.axisTitle);

		me.axisCmp = axis;
		return me;
	} catch (err) {
		console.log(err.message);
	}
};

/**
 *	To draw axis on left side of the graph
 *	with vertical orientation. Axis ticks are pointed inside.
 *	@method axis_Y0
 *  @param {Object} args
 */
AvisoCharts.Axis.prototype.axis_Y0 = function (args) {
	var me = this,
		height = me.height - 10,
		axisConfig = d3.axisLeft(me.scale).tickSizeInner(5).tickSizeOuter(7).tickFormat(d3.format("($.2s"));
	try {
		var axis = me.svg.append("g")
			.attr('class', AVISO_CHART_AXIS_CLS + ' ' + AVISO_CHART_AXIS_Y0)
			.attr("transform", "translate( " + (me.paddingLeft) + "," + me.paddingRight + ")")
			.style("font-family", FONT_FAMILY)
			.style("fill", NONE)
			.style("font-size", FONT_SIZE + "px")
			.call(axisConfig);

		var txtpos = me.getTextWidth(me.axisTitle),
			pos = (height / 2 + txtpos / 2) > height ? height : (height / 2 + txtpos / 2);
		// creates axis title
		me.Y0AxisTitle = me.svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", me.paddingLeft + -me.left)
			.attr("x", -(pos))
			.attr("dy", "1em")
			.attr('class', AVISO_CHART_AXIS_HEADER + " " + AVISO_CHART_AXIS_Y0_TITLE)
			.style("font-family", FONT_FAMILY)
			.style("fill", BLACK)
			.style("font-size", FONT_SIZE + "px")
			.style("cursor", POINTER)
			.style("font-weight", FONT_WEIGHT)
			.style("opacity", OPACITY)
			.text(me.axisTitle);

		me.axisCmp = axis;
		return me;
	} catch (err) {
		console.log(err.message);
	}
};

/**
 *	To draw axis on right side of the graph
 *	with vertical orientation. Axis ticks are pointed inside.
 *	@method axis_Y1
 *  @param {Object} args
 */
AvisoCharts.Axis.prototype.axis_Y1 = function (args) {
	var me = this,
		height = me.height - 10,
		axisConfig = d3.axisRight(me.scale).tickSizeInner(5).tickSizeOuter(7).tickFormat(d3.format(".2s"));
	try {
		var axis = me.svg.append("g")
			.attr('class', AVISO_CHART_AXIS_CLS + " " + AVISO_CHART_AXIS_Y1)
			.attr("transform", "translate( " + (me.width + me.paddingRight) + "," + me.paddingLeft + ")")
			.style("font-family", FONT_FAMILY)
			.style("fill", NONE)
			.style("font-size", FONT_SIZE + "px")
			.call(axisConfig);

		var txtpos = me.getTextWidth(me.axisTitle),
			pos = (height / 2 + txtpos / 2) > height ? height : (height / 2 + txtpos / 2);
		// creates axis title
		me.Y1AxisTitle = me.svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", (me.width - me.paddingRight))
			.attr("x", -(pos))
			.attr("dy", "1em")
			.attr('class', AVISO_CHART_AXIS_HEADER + " " + AVISO_CHART_AXIS_Y1_TITLE)
			.style("font-family", FONT_FAMILY)
			.style("fill", BLACK)
			.style("font-size", FONT_SIZE + "px")
			.style("cursor", POINTER)
			.style("font-weight", FONT_WEIGHT)
			.style("opacity", OPACITY)
			.text(me.axisTitle);

		me.axisCmp = axis;
		return me;
	} catch (err) {
		console.log(err.message);
	}
};