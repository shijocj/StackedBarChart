/**
 * AvisoBase class helps to create global namespace
 *	for AvisoCharts library. AvisoCharts will be the access
 *	point for all the operation.
 * @property AvisoCharts
 */
var AvisoCharts = AvisoCharts || {};

/**
 *	Global constructor function that helps to attach
 *	mixins to achive multiple inheritance in javascript.
 * Invoking the AvisoBase constructor will create closure
 *	function to perform attachMixin. From called class
 *	can access the attachMixin function and pass the mixins
 *	argument. attachMixin function will iterate each mixins
 *	object and attach the properties into corresponding
 *	class properties.
 * @class AvisoBase
 *	@constructor
 */
var AvisoBase = function () {
   var me = this;
   me.attachMixin = function () {
      for (var item in this.mixins) {
         if (!me['has' + item]) {
            if (AvisoCharts[this.mixins[item]]) {
               var avObj = AvisoCharts[this.mixins[item]].prototype;
               me['has' + item] = true;
               for (var key in avObj) {
                  this[key] = avObj[key];
               }
            } else {
               console.log(item + '.js file missing');
            }
         }
      }
      return me;
   };
};