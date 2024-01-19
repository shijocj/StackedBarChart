/*	Scale class is used to create the
 *	d3 scale by using arguments thats
 *	specified. This scale can support
 * {linear, ordinal etc}.
 * @class AvisoCharts.Scales
 *	@constructor
 */
AvisoCharts.Scale = function () {};

/**
 * To get the scale based on the type 
 * @method getScales
 * @param {Object} args
 */
AvisoCharts.Scale.prototype.getScales = function (args) {
   var expr = args.scale,
      scale = '';
   switch (expr) {
      case LINEAR:
         scale = this.linearScale(args);
         break;
      case ORDINAL:
         scale = this.scaleBand(args);
         break;
      case CATEGORY:
         scale = this.scaleCategory(args);
         break;
      default:
         console.log('scale not found');
   }
   return scale ? scale : {};
};
/**
 * To generate linear scale.
 * @method linearScale
 * @param {Object} args
 */
AvisoCharts.Scale.prototype.linearScale = function (args) {
   var scaleLinear = d3.scaleLinear()
      .domain(args.domain)
      .range(args.range)
      .nice(true);
   return scaleLinear;
};
/**
 * To generate ordinal scale.
 * @method scaleBand
 * @param {Object} args
 */
AvisoCharts.Scale.prototype.scaleBand = function (args) {
   return d3.scaleBand()
      .domain(args.domain)
      .range(args.range)
      .padding(0.2);
};
/**
 * To generate categorical scale.
 * @method scaleCategory
 * @param {Object} args
 */
AvisoCharts.Scale.prototype.scaleCategory = function (args) {
   return d3.scaleOrdinal()
      .domain(args.domain)
      .range(args.range);
};
/**
 * Method helps to generate domain for each axis
 * @method generateDomains
 * @param {Object} args
 */
AvisoCharts.Scale.prototype.generateDomains = function () {
   var me = this,
      series = me.series,
      k;
   try {
      me.domainObj = {};
      me.seriesObj = {};
      me.axis.forEach(function (d) {
         var di = d.dataIndex;
         me.domainObj[di] = [];
         me.seriesObj[di] = {};

         me.seriesObj[di]['scale'] = d.scale;
         me.seriesObj[di]['plotIndex'] = d.index;
         me.seriesObj[di]['chartType'] = d.chartType;
      });
      /* creates domain for axis. */
      for (k = 0; k < me.data.length; k++) {
         var s = series[k] ? series[k] : series[0],
            segment = me.data[k].SEGMENT,
            segmentLen = segment.length || 0;
         for (i = 0; i < segmentLen; i++) {
            d = segment[i];
            me.getdomainforIndex(me.seriesObj[s.xField], s.xField, d.data, me.domainObj);
            me.getdomainforIndex(me.seriesObj[s.yField], s.yField, d.data, me.domainObj);
         }
      }
      return me.domainObj;
   } catch (e) {
      console.log(e.message);
   }
};
/**
 *	Method to domain min/max data indexes with the series.
 *	Once individual domain values are generated for each series, they are
 *	consolidated with other series which exist on the same scale.
 *	@method getdomainforIndex
 *	@param {Object} dom domain object containing domain properties object
 *	@param {String} field the name of the field for which domain needs to be calculated
 *	@param {Object} data dataset from which the domain needs to be derived
 * @param {Object} domainObj object which hold domain values
 */
AvisoCharts.Scale.prototype.getdomainforIndex = function (dom, field, data, domainObj) {
   var me = this,
      extent;
   var domainIndex = dom.plotIndex,
      scale = dom.scale;
   try {
      var dataIndex = me.dataIndex.indexOf(domainIndex);
      switch (scale) {
         case LINEAR:
            if (!domainObj[field].length)
               domainObj[field] = me.getLinearDomain(data, dataIndex, domainObj[field]);
            else {
               extent = me.getLinearDomain(data, dataIndex, domainObj[field]);
               domainObj[field][0] = domainObj[field][0] > extent[0] ? extent[0] : domainObj[field][0];
               domainObj[field][1] = domainObj[field][1] < extent[1] ? extent[1] : domainObj[field][1];
            }
            break;
         case ORDINAL:
            if (!domainObj[field].length)
               domainObj[field] = data.map(function (r) {
                  return r[dataIndex];
               });
            else {
               extent = data.map(function (r) {
                  return r[dataIndex];
               });
               domainObj[field] = domainObj[field].concat(extent);
               domainObj[field] = domainObj[field].filter(function (item, i, ar) {
                  return ar.indexOf(item) === i;
               });
            }
            break;
      }
   } catch (err) {
      console.log(err.message);
   }
};
/**
 *	Method to find domain for linear scale type.
 * @method getLinearDomain
 *	@param {Object} data 
 *	@param {String} index 
 *	@param {Array} dom 
 * @return {Array} domain
 */
AvisoCharts.Scale.prototype.getLinearDomain = function (data, index, dom) {
   var domain = [],
      domArr = [],
      dataLen = data.length || 0,
      i, d;
   try {
      for (i = 0; i < dataLen; i++) {
         d = data[i];
         if (!EMPTY_OBJECT[d[index]]) {
            domArr.push(Number(d[index]));
         }
      }
      if (domArr.length) {
         domain = d3.extent(domArr);
      } else {
         domain = dom && dom.length ? d3.extent(dom) : [0, 0];
      }
      return domain;
   } catch (err) {
      console.log(err.message);
   }
};