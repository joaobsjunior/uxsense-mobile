UXSense.controller('MainController', function ($scope, $state, $rootScope, $translate, requestService, $timeout, $ionicPopup, $ionicHistory, $ionicNavBarDelegate, $window) {
  console.log("MainController");
  $rootScope.showBackButton = true;
  $rootScope.isSended = false;
  var onPush = function (stateName) {
    switch (stateName) {
      case "teams":
        $rootScope.isTeams = true;
        break;
      case "answer":
      case "answer.send":
        if ($rootScope.showBackButton) {
          $ionicNavBarDelegate.showBackButton(false);
          $rootScope.showBackButton = false;
        }
        break;
      default:
        if (!$rootScope.showBackButton) {
          $ionicNavBarDelegate.showBackButton(true);
          $rootScope.showBackButton = true;
        }
    }
  };
  $rootScope.checkAuth($state.current.name);
  $scope.$on('$ionicView.enter', function () {
    onPush($state.current.name);
    $rootScope.checkAuth($state.current.name);
  });
  $scope.setLang = function (lang) {
    if ($translate.use() != lang && Locale.hasOwnProperty(lang)) {
      $translate.use(lang);
    }
  };

  $rootScope.tokenFCM = null;

  $rootScope.generateTokenFCM = function (callback) {
    if (!$window.FirebasePlugin) {
      callback(null);
      return;
    } else {
      getRefreshToken(callback);
    }
  };

  var updateToken = function (token, callback) {
    if (token) {
      if (token != $rootScope.tokenFCM && $rootScope.authData.authenticated) {
        requestService.updateRegistration({
          registration_id: token
        }, {
          success: function (data) {
            $rootScope.tokenFCM = token;
            callback(token);
          },
          error: function (error) {
            console.log("Error updateToken:" + JSON.stringify(error, null, 3))
            callback(token);
          }
        });
      } else {
        $rootScope.tokenFCM = token;
        callback(token);
      }
    }
  }

  var getRefreshToken = function (callback) {
    $window.FirebasePlugin.onTokenRefresh(function (token) {
        console.log("getRefreshToken:" + token);
        updateToken(token, callback);
      },
      function (error) {
        console.log("Error getRefreshToken:" + JSON.stringify(error, null, 3))
      });
  }

  $rootScope.notificationConfig = function () {
    if (!$window.FirebasePlugin) {
      return;
    }
    $window.FirebasePlugin.grantPermission();
    $window.FirebasePlugin.onNotificationOpen(function (notification) {
        $window.FirebasePlugin.setBadgeNumber(0);
        $rootScope.isSended = false;
        $rootScope.checkNewQuestion();
        console.log("Notification:" + JSON.stringify(notification, null, 3));
      },
      function (error) {
        console.log('Error registering onNotification callback: ' + JSON.stringify(error, null, 3));
      });
  };

  $rootScope.getPosition = function () {
    $rootScope.location = {};
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        if (position.coords) {
          $rootScope.location.latitude = position.coords.latitude;
          $rootScope.location.longitude = position.coords.longitude;
        } else {
          $rootScope.location.latitude = position.latitude;
          $rootScope.location.longitude = position.longitude;
        }
      }, function (data) {
        $timeout(function () {
          $rootScope.getPosition();
        }, 5000);
      }, {
        timeout: 5000,
        enableHighAccuracy: true
      });
    }
  };

  $rootScope.chekindQuestions = false;
  $rootScope.checkNewQuestion = function () {
    if ($window.FirebasePlugin) {
      $window.FirebasePlugin.setBadgeNumber(0);
    }
    if ($rootScope.authData.authenticated && !$rootScope.isSended && !$rootScope.chekindQuestions) {
      $rootScope.chekindQuestions = true;
      requestService.getQuestion({
        success: function (data) {
          if (data.id) {
            $rootScope.notification = data;
            $ionicPopup.show({
              template: $translate.instant('msgOldPushNotification'),
              title: $translate.instant('popupWarning'),
              buttons: [{
                text: $translate.instant('labelThenAnswer'),
                onTap: function (e) {
                  delete $rootScope.notification;
                }
              }, {
                text: '<b>' + $translate.instant('labelAnswer') + '</b>',
                type: 'button-positive',
                onTap: function (e) {
                  $state.go('answer.send');
                }
              }]
            });
          }
          $rootScope.isSended = true;
          $rootScope.chekindQuestions = false;
        },
        error: function () {
          $rootScope.isSended = false;
          $rootScope.chekindQuestions = false;
          $rootScope.checkNewQuestion();
        }
      });
    }
  };

  $rootScope.clearData = function () {
    $rootScope.authData = {};
    $rootScope.authHeader = {};
    $rootScope.tokenFCM = "";
    $rootScope.updateDataStorage();
  };

  $rootScope.logoutApp = function (isRequest, statusCode) {
    var logout = function () {
      $rootScope.clearData();
      $state.go('login');
    }
    if (isRequest) {
      $ionicPopup.alert({
        title: $translate.instant('popupError'),
        template: $translate.instant('server-error' + statusCode)
      }).then(function () {
        logout();
      });
    } else {
      requestService.logout({
        success: function (data) {
          logout();
        },
        error: function (data) {
          $ionicPopup.show({
            title: $translate.instant('popupError'),
            template: data.message,
            buttons: [{
              text: $translate.instant('labelCancel')
            }, {
              text: $translate.instant('labelRetry'),
              type: 'button-positive',
              onTap: function (e) {
                $rootScope.logoutApp(isRequest);
              }
            }]
          });
        }
      });
    }
  };
  $rootScope.alphaNumeric = function ($element, $key) {
    if (typeof $element[$key] === 'string') {
      $element[$key] = $element[$key].replace(/[^0-9a-z\.\_]/gi, '');
    }
  }
  if (navigator.splashscreen) {
    navigator.splashscreen.hide();
  }
});
