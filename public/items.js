angular.module('items',[])
  .controller('itemCtrl',ItemCtrl)
  .factory('itemApi',itemApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function ItemCtrl($scope,itemApi){
   $scope.items=[]; //Initially all was still
   $scope.errorMessage='a';
   $scope.isLoading=isLoading;
   $scope.refreshItems=refreshItems;
   $scope.itemClick=itemClick;

   var loading = false;
   var test = "This is a test";


   function isLoading(){
    return loading;
   }
  function refreshItems(){
    loading=true;
    $scope.errorMessage='';
    itemApi.getItems()
      .success(function(data){
         $scope.items=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Items: request failed";
          loading=false;
      });
 }
  function itemClick($event){
     $scope.errorMessage='';
     itemApi.clickItem($event.target.id)
        .success(function(){})
        .error(function(){$scope.errorMessage="Unable click";});
  }
  refreshButtons();  //make sure the buttons are loaded

}

function itemApi($http,apiUrl){
  return{
    getItems: function(){
      var url = apiUrl + '/items';
      return $http.get(url);
    },
    clickItem: function(id){
      var url = apiUrl+'/clickitem?id='+id;
//      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    }
 };
}
