var app = angular.module('app', ['ngCookies','timer']);
//app.value('apiURI', 'http://127.0.0.1:8000');
app.value('apiURI', 'http://192.168.2.5:8000/api-v1');

// APP Configurations
app.config(['$locationProvider','$httpProvider',
	function ($locationProvider,$httpProvider){
		$locationProvider.html5Mode(true);

		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

	}]);

app.controller('apiController',function ($scope,$http,$cookies,$cookieStore,apiURI){
	$scope.init = function (value){
    	$scope.start_page = 'login';
    }

	$scope.set = function (timerData){
		$scope.current = timerData;
	}

    $scope.setFormSw = function (value){
    	$scope.start_page = value;
    }

	$scope.dashBoard_login = function(data){
		socket.emit('login', data[0]);
	}
	$scope.dashBoard_logout = function(data){
		socket.emit('logout', data);
	}

	$scope.getUser = function (){
		$http({
			url: apiURI + '/user/',
			method:'GET',
			headers:{'Content-Type':'application/json; charset=UTF-8','Authorization': 'JWT ' + $cookies.AuthToken }
		}).
		success(function (data){
			$cookies.ownerID = data[0].id;
			$cookies.ownerName = data[0].username;
			$scope.dashBoard_login(data);
			window.location.reload();
		}).
		error(function (err){
			console.log('User request failed',err);
		})
	}

	$scope.statics = function(){
		$http({
			url:apiURI+'/statics/' + $cookies.ownerID +'/?status=DN',
			method:'GET',
			headers:{'Content-Type':'application/json; charset=UTF-8','Authorization': 'JWT ' + $cookies.AuthToken }
		}).
		success(function (data){
			console.log('Statics here',data);
			$scope.staticsData = data;
		}).
		error(function (err){
			console.log('Statics failed',err);
		})
	}

	$scope.register = function(CreateUserData){
		$http({
			url:apiURI+'/register/',
			data:CreateUserData,
			method:'POST',
			headers : {'Content-Type':'application/json; charset=UTF-8' }
		}).
		success(function (data){
			console.log('Register Request Successed!', data);
		}).
		error(function (err){
			console.log('Register Request FAILED!', err);
		})
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
			$scope.getUser();
		}).
		error(function (err){
			console.log('Login Request FAILED!', err);
		})
	}

	$scope.logout = function (){
		$cookieStore.remove('AuthToken');
		$scope.dashBoard_logout($cookies.ownerID);
		window.location.reload();
	}

	$scope.checkLogin = function (){
		if($cookies.AuthToken){
			$scope.authStatus = true;
		}else{
			$scope.authStatus = false;
		}
	}

})	


app.controller('timerController', function ($scope,$http,$cookies,apiURI) {
	$scope.remainingTime = 0;
	$scope.userObject = {'username':$cookies.ownerName,'id':$cookies.ownerID};

	$scope.init = function (value){
    	$scope.timer_type = 'ST';
    	$scope.timerRunning = false;
    }

    $scope.setTimer = function (value){
    	$scope.timer_type = value;
    }

    $scope.get_timer = function (){
    	return $scope.remainingTime;
    }

    $scope.remainingTimer = function (){
    	$http({
			url:apiURI+'/timer/remaining/' + $cookies.ownerID + '/',
			method:'GET',
			headers:{'Content-Type':'application/json; charset=UTF-8','Authorization': 'JWT ' + $cookies.AuthToken }	
		}).
		success(function(data,status,headers,config){
			$scope.remainingTime = data.remaining;
			$cookies.remainingTime = data.remaining;
			$scope.get_timer();
		}).
		error(function(data,status,headers,config){
			console.log('timer request failed');
		});
    }

    $scope.startTimer = function (){
        $http({
        	url: apiURI+'/timer/',
        	data: {'owner': $cookies.ownerID,'types': $scope.timer_type},
        	method:'POST',
        	headers : {'Content-Type':'application/json; charset=UTF-8','Authorization': 'JWT ' + $cookies.AuthToken }
        }).
        success(function (data){
        	console.log('Timer request successed.', data);
        	$cookies.timerID = data.id;
        	socket.emit('start-timer', $scope.timer_type,$scope.userObject);
	        $scope.$broadcast('timer-start');
	        $scope.timerRunning = true;
        }).
        error( function (err){
        	console.log('Timer request failed.',err);
        	alert(err['detail']);
        })
    }

    $scope.resetTimer = function() {
    	$http({
    		url: apiURI + '/timer/check/' + $cookies.timerID + '/',
    		method: 'PUT',
    		data:{},
    		headers : {'Content-Type':'application/json; charset=UTF-8','Authorization': 'JWT ' + $cookies.AuthToken }
    	}).
    	success(function (data){
    		console.log('Timer reset request successed', data);
 		    $scope.$broadcast('timer-reset');
        	$scope.timerRunning = false;
        	socket.emit('reset-timer', $scope.userObject);
    	}).
    	error( function (data){
    		console.log('Timer reset failed!!');
    	})
    }
    
    $scope.$on('timer-stopped', function (event, data){
        $http({
    		url: apiURI + '/timer/check/' + $cookies.timerID + '/',
    		method: 'PUT',
    		data:{},
    		headers : {'Content-Type':'application/json; charset=UTF-8','Authorization': 'JWT ' + $cookies.AuthToken }
    	}).
    	success(function (data){
    		console.log('Timer done request successed', data);
 		    $scope.$broadcast('timer-reset');
 		    $scope.timerRunning = false;
    	}).
    	error( function (data){
    		console.log('Timer done failed!!');
    	})
    });

});
