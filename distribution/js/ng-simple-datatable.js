(function(){
	'use strict';

	var module = angular.module('NgSimpleDatatable',[]);
	module.directive('ngSimpleDatatable', ['$timeout',function($timeout){
		return {
		      restrict : 'AE',
		      link : function($scope, element, attributes) {
		    	  if($scope.ngSimpleDatatable == undefined) {
		    		  $scope.ngSimpleDatatable = {
		    				  datatables : {}
		    		  };
		    	  }
		    	  $scope.$watch(attributes.options, function (options) {
		    		  reInitializeDatatable(options);
		    	  }, true);
		    	  
		    	  $scope.$watch(attributes.extensions, function (extensions) {
		    		  if(Array.isArray(extensions)) {
		    			  extensions.forEach(function(extension){	    				  
			    			  if(extension.type == 'search') {
			    				  $.fn.dataTable.ext.search.push(
		    						  function( settings, data, dataIndex ) {
		    							  if(attributes.id == settings.nTable.id) {
		    								  return extension.callback(settings, data, dataIndex);
		    							  }
		    							  
		    							  return true;
		    						  }
			    				  );
			    			  }
			    			  
			    			  
			    			  extension.watch.forEach(function(model){
			    				  $scope.$watch(model,function(value){
			    					  reDrawTable();
			    				  });
			    			  });
			    		  });
		    		  }
		    	  }, true);
		    	  
		    	  
		    	  function reDrawTable() {
		    		  if($scope.ngSimpleDatatable.datatables[attributes.id] != undefined){
		    			  $scope.ngSimpleDatatable.datatables[attributes.id].draw();  
		    		  }
		    	  }
		    	  
		    	  function reInitializeDatatable(options) {
    				  $timeout(function(){
    					  if($scope.ngSimpleDatatable.datatables[attributes.id] != undefined){
	    					  $scope.ngSimpleDatatable.datatables[attributes.id].destroy();
	    					  $scope.ngSimpleDatatable.datatables[attributes.id] = element.DataTable(options);
    					  } else {
    						  $timeout(function(){
    							  reInitializeDatatable(options);
    						  }, 100);
    					  }
    				  });
		    	  }
		
		    	  $(document).ready(function(){
		    		  $timeout(function(){
		    			  if($scope.ngSimpleDatatable.datatables[attributes.id] == undefined){
		    				  $scope.ngSimpleDatatable.datatables[attributes.id] = element.DataTable();
		    			  }
		    		  });
		    	  });
		      }
		 };
	}]);
})()