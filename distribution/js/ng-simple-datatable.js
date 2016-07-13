(function(){
	'use strict';

	var module = angular.module('NgSimpleDatatable',[]);
	module.directive('ngSimpleDatatable', function(){
		return {
		      restrict: 'AE',
		      link: function(scope, element, attributes) {
		    	  scope.$watch(attributes.options, function (options) {
		    		  console.log(options);
		    	  });
		    	  
		    	  reDrawTable(element);
		    	  
		    	  function reDrawTable(element, options) {
		    		  $(document).ready(function(){
		    			    element.DataTable(options);
		    		  });
		    	  }
		      }
		 };
	});
})()