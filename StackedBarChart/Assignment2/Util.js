/**
 * The class that helps to group all
 * commonly used logic in to one place
 * @class AvisoCharts.Util
 */
AvisoCharts.Util = function () {};
/**
 *	Method helps to get the text width
 *	@method getTextWidth
 *	@param	{String} text
 */
AvisoCharts.Util.prototype.getTextWidth = function (text) {
    try {
        var tag = document.createElement("div");
        tag.style.position = "absolute";
        tag.style.left = "-999em";
        tag.style.whiteSpace = "nowrap";
        tag.innerHTML = text;
        document.body.appendChild(tag);
        var resultWidth = tag.clientWidth;
        document.body.removeChild(tag);
        return resultWidth;
    } catch (err) {
        console.log(err.message);
    }
};
/**
 * Method helps to get axis left padding. 
 * @method getAxisLeftPadding
 */
AvisoCharts.Util.prototype.getAxisLeftPadding = function () {
    var me = this,
        axis;
    try {
        axis = me.axis.filter(function (d) {
            return d.dataIndex == S_INDX_Y2;
        }) || [];
        return axis.length ? 40 : 0;
    } catch (err) {
        console.log(err.message);
    }
};
/**
 *	To get the X Scale component
 *	@method	getScale_X0
 */
AvisoCharts.Util.prototype.getScale_X0 = function () {
    var me = this;
    return me.scale_X0 ? me.scale_X0 : WARNING;
};
/**
 *	Method helps to get the range values for the scale
 *	@param {String} dataIndex
 *	@param {Number} axisLength
 *	@param {Number} width
 *	@param {Number} height
 *	@return {Array} range
 *
 */
AvisoCharts.Util.prototype.getRange = function (dataIndex, axisLength, width, height) {
    var me = this,
        range = [],
        type,
        yIndex;
    try {
        if (axisLength && axisLength > 2) {
            type = dataIndex.indexOf(X) !== -1 ? "xRange_Y" + axisLength : "normal_Y0";
        } else {
            type = dataIndex.indexOf(X) !== -1 ? "normal_X0" : "normal_Y0";
        }
        switch (type) {
            case "normal_X0":
                yIndex = me.getYIndex();
                switch (yIndex) {
                    case 'Y0':
                        range = [10, width - 10];
                        break;
                    case 'Y1':
                        range = [10, width - 30];
                        break;
                    default:
                        range = [10, width - 10];
                        break;
                }
                break;
            case "normal_Y0":
                range = [height, 10];
                break;
            case "xRange_Y3":
                yIndex = me.getYIndex();
                switch (yIndex) {
                    case 'Y0Y1':
                        range = [10, width - 30];
                        break;
                }
                break;
            default:
                range = [50, width - 70];
                break;
        }
    } catch (err) {
        console.log(err.message);
    }
    return range;
};
/**
 * Method helps to get Y axis index in chart. 
 * @method getYIndex
 */
AvisoCharts.Util.prototype.getYIndex = function () {
    var me = this,
        yIndexArr;
    try {
        yIndexArr = me.axis.map(function (d) {
            return d.dataIndex.indexOf('Y') > -1 && d.dataIndex || ''
        }).filter(function (d) {
            return d;
        })
        yIndexArr = yIndexArr.sort(d3.ascending);
        return yIndexArr.join("");
    } catch (err) {
        console.log(err.message);
    }
};
/**
 *	Method helps to get the axis padding values based on number of axis.
 *	@method getAxisPadding
 *	@param {String} index
 *	@return {Object} padding
 */
AvisoCharts.Util.prototype.getAxisPadding = function (index) {
    var me = this,
        padding = {};
    try {
        var getVal = {
            'X0': function () {
                padding["left"] = 0;
                padding["right"] = 0;
            },
            'Y0': function () {
                padding["left"] = 0;
                padding["right"] = 0;
            },
            'Y1': function () {
                padding["left"] = 0;
                padding["right"] = -20;
            },
        };
        if (getVal[index]) {
            getVal[index]();
        } else {
            padding["left"] = -100;
            padding["right"] = -100;
        }
        return padding;
    } catch (err) {
        console.log(err.message);
    }
};

/**
 * Method helps to get domain values for the scale.
 * @method getDomain
 * @param {String} di
 * @param {Array} dom
 * @return {Array} dom
 */
AvisoCharts.Util.prototype.getDomain = function (di, dom) {
    var me = this,
        config = me.seriesObj[di];
    try {
        if (config.chartType == BAR_CHART) {
            var seriesLen = me.series.length,
                i;
            for (i = 0; i < seriesLen; i++) {
                var series = me.series[i],
                    yConfig = me.axis.filter(function (d) {
                        return d.dataIndex == series.yField;
                    })[0],
                    data = [];

                if (yConfig.chartType == config.chartType) {
                    data = me.data[i] && me.data[i].SEGMENT || [];

                    var categories = Array.from(new Set(data.map(item => item.groupIndex)));
                    data = me.getStackData(data);

                    var domain = [0, d3.max(data, function (d) {
                        return d3.sum(categories, function (groupIndex) {
                            return d[groupIndex]
                        })
                    })];
                    return domain && domain.length ? domain : dom;
                }

            }
        } else {
            return dom;
        }
    } catch (err) {
        console.log(err.message);
    }
};
/**
 * Method helps to show tooltip on mouse over
 * @method showTooltip
 * @param {HTML Object} cmp
 * @param {Object} d
 */
AvisoCharts.Util.prototype.showTooltip = function (cmp, d) {
    var me = this,
        nodeName = cmp.tagName || cmp.nodeName,
        event = d3.event,
        textVal = "";
    try {
        if (nodeName == 'rect') {
            if (d.length && d[1]) {
                var grpkey = cmp.parentNode.getAttribute("key-index"),
                    value = (d[1] - d[0]),
                    category = d.data && d.data.category || "";
                textVal = QUARTER_TPL + category + BREAK + GROUP_TPL + grpkey + BREAK + VALUE_TPL + value;
            }
        } else {
            if (d.length) {
                textVal = QUARTER_TPL + d[0] + BREAK + DAYS_TPL + d[1];
            }
        }
        me.toolContr.html(textVal)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .style("opacity", OPACITY);
    } catch (e) {
        console.log(e.message);
    }
};

/**
 * Method helps to hide tooltip on mouse out
 * @method hideTooltip
 */
AvisoCharts.Util.prototype.hideTooltip = function (d) {
    var me = this;
    try {
        var tooltip = me.toolContr;
        tooltip.style("opacity", 0);
    } catch (e) {
        console.log(e.message);
    }
};
/**
 *	Method helps to create stack based on data.
 * @method getStackData
 * @param {Object} data
 */
AvisoCharts.Util.prototype.getStackData = function (data) {
    var transposedData,
        finalData;
    try {
        // Transpose the data using zip method
        transposedData = d3.zip.apply(null, data.map(function (d) {
            return d.data.map(function (e) {
                return {
                    category: e[0],
                    [d.groupIndex]: e[1]
                };
            });
        }));

        finalData = transposedData.map(function (d) {
            var obj = {
                category: d[0].category
            };
            d.forEach(function (e) {
                Object.assign(obj, e);
            });
            return obj;
        });
        return finalData;
    } catch (err) {
        console.log(err.message);
    }
};