var app = angular.module('app', ['ngRoute','ngCookies','timer']);
app.value('apiURI', 'http://127.0.0.1:8000');

// APP Configurations
app.config(['$routeProvider','$locationProvider','$httpProvider',
	function ($routeProvider,$locationProvider,$httpProvider){
		$routeProvider.
				when('/statics',{
					templateUrl: 'view/statics.html',
					controller: 'viewController'
				})
				.when('/timer',{
					templateUrl: 'view/timer.html',
					controller: 'timerController'
				}).
				otherwise({
					redirectTo: '/'
				});
		$locationProvider.html5Mode(true);

		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

	}]);

// APP Controllers
app.controller('viewController',function ($scope,$http, apiURI){
	console.log(' request running');
})

app.controller('apiController',function ($scope,$http,$cookies, apiURI){
	$scope.timerJson = function(){
		$http({
			url:apiURI+'/timer/',
			method:'GET',
			headers:{'Content-Type':'application/json; charset=UTF-8','Authorization': 'JWT ' + $cookies.AuthToken }	
		}).
		success(function(data,status,headers,config){
			$scope.timerData = data;
			$cookies.TimerData = data;
		}).
		error(function(data,status,headers,config){
			console.log('timer request failed');
		});
	}

	$scope.set = function (timerData){
		$scope.current = timerData;
	}

	$scope.login = function (loginData){
		$http({
			url:apiURI+'/api-token-auth/',
			data:loginData,
			method:'POST',
			headers : {'Content-Type':'application/json; charset=UTF-8' }
		}).
		success(function (data){
			console.log('Login Request Successed!', data);
			$cookies.AuthToken = data.token;
		}).
		error(function (err){
			console.log('Login Request FAILED!', err);
		})
	}

})

app.controller('timerController', function ($scope,$http,$cookies, apiURI) {
    $scope.timerRunning = false;
    $scope.timerOwner = {'owner': 2}
    
    $scope.startTimer = function (){
        $http({
        	url: apiURI+'/timer/',
        	data: $scope.timerOwner,
        	method:'POST',
        	headers : {'Content-Type':'application/json; charset=UTF-8','Authorization': 'JWT ' + $cookies.AuthToken }
        }).
        success(function (data){
        	console.log('Timer request successed.', data);

	        $scope.$broadcast('timer-start');
	        $scope.timerRunning = true;	
        }).
        error( function (data){
        	console.log('Timer request failed.');
        })
    }
    $scope.resetTimer = function() {
        $scope.$broadcast('timer-reset');
        $scope.timerRunning = false;
    }
    $scope.$on('timer-stopped', function (event, data){
        console.log('Timer Stopped - data = ', data);
    });
    
});
