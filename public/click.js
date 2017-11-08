angular.module('register',[])
  .controller('registerCtrl',registerCtrl)
  .factory('registerApi',registerApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function registerCtrl($scope,registerApi){
   $scope.buttons=[]; //Initially all was still
   $scope.items=[];
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.buttonClick=buttonClick;

   var loading = false;

   function isLoading(){
    return loading;
   }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    registerApi.getButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
         console.log(items);
      })
      .error(function () {
          $scope.errorMessage="Unable to load Buttons:  Database request failed";
          loading=false;
      });
 }
  function buttonClick($event){
     $scope.errorMessage='';
     registerApi.clickButton($event.target.id)
        .success(function(){})
        .error(function(){$scope.errorMessage="Unable click";});
  }
  refreshButtons();  //make sure the buttons are loaded



function itemClick($event){
  $scope.errorMessage='';
  registerApi.clickItem($event.target.id)
    .success(function(){registerApi.getItems()})
    .error(function(){$scope.errorMessage="Error clicking on item -- Can't Delete!"})
}
}
function registerApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    getItems: function(){
      var url = apiUrl + '/items';
      return $http.get(url)
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
//      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    },
    clickItem: function(id){
      var url = apiUrl +'/itemclick?id='+id
      return $http.get(url);
    }
 };
}
