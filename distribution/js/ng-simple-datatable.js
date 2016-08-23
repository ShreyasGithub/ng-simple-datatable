(function(){
	'use strict';

	var module = angular.module('NgSimpleDatatable',[]);
	module.directive('ngSimpleDatatable', ['$timeout', '$compile', function($timeout, $compile){
		return {
		      restrict : 'AE',
		      link : function($scope, element, attributes) {
		    	  if(attributes.id == undefined || attributes.id == null) {
		    		  console.error("id attribute is required for ng-simple-datatable as it is used to track datatable instances");
		    		  return false;
		    	  }
		    	  element.hide();
		    	  
		    	  if($scope.$parent.ngSimpleDatatable == undefined) {
		    		  $scope.$parent.ngSimpleDatatable = {
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
    				    var optionsCopy = angular.copy(options);
    				    var userCreatedRowFunction = optionsCopy.createdRow;
  				      optionsCopy.createdRow = function(row, data, index) {
  				        if(userCreatedRowFunction) {
  						      userCreatedRowFunction(row, data, index);
  				        }
  						    $compile(row)($scope);
  					    }
    				    
    					  if($scope.ngSimpleDatatable.datatables[attributes.id] != undefined){
    						  element.hide();
	    					  $scope.ngSimpleDatatable.datatables[attributes.id].destroy();
	    					  $scope.ngSimpleDatatable.datatables[attributes.id] = element.DataTable(optionsCopy);
	    					  element.show();
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
		    				  element.show();
		    			  }
		    		  });
		    	  });
		    	  
		      }
		 };
	}]);
})()