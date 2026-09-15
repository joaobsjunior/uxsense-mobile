JSON.clone = function (data) {
  return JSON.parse(JSON.stringify(data));
};
String.prototype.test = function (regex) {
  var patt = new RegExp(regex);
  return patt.test(this.valueOf());
};
var UXSense = angular.module('UXSense', ['ionic', 'pascalprecht.translate', 'ui.utils.masks', 'ngLocale']);
UXSense.run(function ($ionicPlatform, $rootScope, $http, $location, $timeout, $ionicLoading, $translate, $ionicModal, $state, $ionicPopup, $ionicHistory, requestService, $window) {
  $rootScope.starckLoading = [];
  $rootScope.authHeader = localStorage.getItem('authHeader');
  $rootScope.authHeader = ($rootScope.authHeader) ? JSON.parse($rootScope.authHeader) : {};
  $rootScope.authData = localStorage.getItem('authData');
  $rootScope.authData = ($rootScope.authData) ? JSON.parse($rootScope.authData) : {};
  $rootScope.terms = localStorage.getItem('terms');
  $rootScope.terms = ($rootScope.terms) ? JSON.parse($rootScope.terms) : {};
  $rootScope.zeroFill = function (str, size) {
    if (str) {
      size = size || 11;
      str = str.toString();
      var add = size - str.length;
      for (var i = 0; i < add; i++) str = '0' + str;
    }
    return str;
  };
  $rootScope.updateDataStorage = function () {
    localStorage.setItem('authData', JSON.stringify($rootScope.authData));
    localStorage.setItem('terms', JSON.stringify($rootScope.terms));
    localStorage.setItem('authHeader', JSON.stringify($rootScope.authHeader));
  };
  $rootScope.getAPI = function (path) {
    var url = "http://api.uxsense.com.br/api/app/";
    return url + path;
  };
  $rootScope.request = function (method, _url, _params, showLoading) {
    showLoading = (showLoading === null) ? false : showLoading;
    var header = {
      'Content-Type': 'application/json'
    };
    angular.extend(header, $rootScope.authHeader);
    _url = $rootScope.getAPI(_url);
    var config = {
      timeout: 30000,
      method: method,
      url: _url,
      headers: header,
      beforeSend: function () {
        $timeout(function () {
          if (showLoading) {
            $rootScope.starckLoading.push(1);
            if ($rootScope.starckLoading.length == 1) {
              $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
              }).then(function () {});
            }
          }
        }, 0);
      },
      complete: function () {
        $timeout(function () {
          if (showLoading) {
            $rootScope.starckLoading.pop();
            if (!$rootScope.starckLoading.length) {
              $ionicLoading.hide().then(function () {});
            }
          }
        }, 200);
      },
      loading: showLoading,
      data: _params,
      params: (method.toUpperCase() == 'GET' || method.toUpperCase() == 'DELETE') ? _params : {},
      cache: false,
      responseType: "json"
    };
    return $http(config);
  };

  $rootScope.termVersion = "1.0";

  $rootScope.checkAuth = function (stateName) {
    if (!$rootScope.terms || !$rootScope.terms[$rootScope.termVersion]) {
      $state.go('term');
      return;
    }
    if ($rootScope.authData.authenticated) {
      if (stateName) {
        switch (stateName) {
          case "login":
          case "signup":
          case "test":
            $state.go('home');
            break;
        }
      }
    } else {
      switch (stateName) {
        case "login":
        case "signup":
        case "lostPassword":
          break;
        default:
          $state.go('login');
      }
    }
  };
  $ionicPlatform.ready(function () {
    $rootScope.checkAuth("test");
    if (window.Keyboard && window.Keyboard.hideFormAccessoryBar) {
      window.Keyboard.hideFormAccessoryBar(false);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
});
UXSense.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $rootScopeProvider, $translateProvider, $httpProvider, $ionicConfigProvider) {
  /*ROUTING - keep "#/" urls (AngularJS >= 1.6 defaults to "#!/")*/
  $locationProvider.hashPrefix('');
  /*HTTP INTERCEPTION*/
  $httpProvider.interceptors.push('httpInterceptionService');
  /*TRANSLATE*/
  $translateProvider.useSanitizeValueStrategy('escapeParameters');
  $translateProvider.translations('pt', Locale.pt);
  $translateProvider.preferredLanguage('pt');
  /*ROUTES*/
  $stateProvider.state('main', {
    templateUrl: 'view/main.html',
    controller: 'MainController'
  }).state('term', {
    parent: 'main',
    url: '/term',
    views: {
      'mainContent@main': {
        templateUrl: 'view/term.html'
      }
    }
  }).state('login', {
    parent: 'main',
    url: '/login',
    views: {
      'mainContent@main': {
        templateUrl: 'view/login.html'
      }
    }
  }).state('signup', {
    parent: 'main',
    url: '/signup',
    views: {
      'mainContent@main': {
        templateUrl: 'view/signup.html'
      }
    }
  }).state('lostPassword', {
    parent: 'main',
    url: '/lost-password',
    views: {
      'mainContent@main': {
        templateUrl: 'view/lost-password.html'
      }
    }
  }).state('app', {
    parent: 'main',
    abstract: true,
    views: {
      'mainContent@main': {
        templateUrl: 'view/app.html',
        controller: 'AppController'
      }
    }
  }).state('home', {
    parent: 'app',
    url: '/home',
    views: {
      'home@app': {
        templateUrl: 'view/home.html'
      }
    }
  }).state('myAccount', {
    parent: 'app',
    url: '/my-account',
    views: {
      'myAccount@app': {
        templateUrl: 'view/my-account.html',
        controller: 'MyAccountController'
      }
    }
  }).state('teams', {
    parent: 'app',
    url: '/teams',
    views: {
      'teams@app': {
        templateUrl: 'view/teams.html'
      }
    }
  }).state('teams.newTeam', {
    url: '/new-team',
    views: {
      'teams@app': {
        templateUrl: 'view/new-team.html'
      }
    }
  }).state('answer', {
    parent: 'app',
    url: '/answer',
    views: {
      'answer@app': {
        templateUrl: 'view/answer.html'
      }
    }
  }).state('answer.send', {
    url: '/send',
    views: {
      'answer@app': {
        templateUrl: 'view/answer-send.html'
      }
    }
  });
  $ionicConfigProvider.backButton.text("");
});
