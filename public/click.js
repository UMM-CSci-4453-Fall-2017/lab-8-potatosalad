angular.module('register',[])
  .controller('registerCtrl',registerCtrl)
  .factory('registerApi',registerApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function registerCtrl($scope,registerApi){
   $scope.buttons=[]; //Initially all was still
   $scope.items=[];
   $scope.total=function(items) {
    var total = 0;
    parseInt(total);
     for (var i = 0; i < items.length; i++) {
       total = parseInt(total) + parseInt(findSum(items[i].price, items[i].quantity));
     }
     return total.toFixed(2);
   };
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.buttonClick=buttonClick;
   $scope.findSum=function(price, quantity) {
     return (price * quantity).toFixed(2);
   }
   $scope.itemClick=itemClick;

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
  function retrieveItems(){
    loading = true;
    $scope.errorMessage='';
    registerApi.getItems()
       .success(function(data){
         $scope.items = data;
         loading=false;

       }
     )
       .error(function(){$scope.errorMessage="Unable click"; loading=false;});
 }



  function buttonClick($event){
     $scope.errorMessage='';
     registerApi.clickButton($event.target.id)
        .success(function(data){
          $scope.buttons = data;
          retrieveItems();
          refreshButtons();
        })
        .error(function(){$scope.errorMessage="Unable click";});

  }
  refreshButtons();  //make sure the buttons are loaded
  retrieveItems();

function itemClick(id){
  $scope.errorMessage='';
  registerApi.clickItem(id)
    .success(function(){
      console.log("Hello");
      retrieveItems();
    })
    .error(function(){$scope.errorMessage="Error clicking on item -- Can't Delete!"});
    //retrieveItems();

}

function findSum(price, quantity) {
  return (price * quantity).toFixed(2);
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

      return $http.get(url); // Easy enough to do this way
    },
    clickItem: function(id){
      console.log("we make it here");

      var url = apiUrl +'/itemclick?id='+id

         console.log("Attempting with "+url);
         console.log(typeof(url));
      return $http.get(url);
    }
 };
}
