UXSense.controller('AnswerSendController', function ($scope, $state, $stateParams, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout, $ionicNavBarDelegate, $ionicHistory, $filter) {
  console.log("AnswerSendController");
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $scope.form = {};
  $scope.notificationData = $rootScope.notification;
  (function ($scope) {
    if (!$scope.notificationData) {
      return;
    }
    switch ($scope.notificationData.technique.id) {
      case 3:
        $scope.panas = {};
        break;
      case 4:
        $scope.attrakdiff = {};
        break;
      case 5:
        $scope.premo = {
          desejo: false,
          surpresa_agradavel: false,
          interesse: false,
          deleite: false,
          satisfacao: false,
          admiracao: false,
          fascinio: false,
          desgosto: false,
          indignacao: false,
          desprezo: false,
          surpresa_desagradavel: false,
          insatisfacao: false,
          frustracao: false,
          monotonia: false,
        };
        break;
      case 8:
        $scope.sam = {}
    }
  })($scope);
  $scope.getTechniqueTemplate = function () {
    if (!$scope.notificationData) {
      return '';
    }
    return 'view/technique/tech-' + $scope.notificationData.technique.id + '.html';
  }
  $scope.setResponse = function (e) {
    var answer = {
      max: 0,
      min: 0,
      type: 'number' || 'boolean',
      data: {}
    };
    var element = null;
    if (e.target) {
      element = jQuery(e.target);
    } else {
      element = jQuery('#' + e);
    }
    $scope.form.answer = null;
    if (element.attr('fill-opacity') == '0.5') {
      element.attr('fill-opacity', '0');
    } else {
      element.attr('fill-opacity', '0.5');
    }
    switch ($scope.notificationData.technique.id) {
      /**
       * Técnica Emocards
       */
      case 1:
        var data = element.attr('id');
        var value = parseInt(data[1]);
        answer.max = 1;
        answer.data = {
          excitacao: 0,
          entusiasmo: 0,
          prazer: 0,
          relaxamento: 0,
          sonolencia: 0,
          desanimo: 0,
          desagrado: 0,
          angustia: 0
        }
        switch (value) {
          case 1:
            answer.data.excitacao = 1;
            break;
          case 2:
            answer.data.entusiasmo = 1;
            break;
          case 3:
            answer.data.prazer = 1;
            break;
          case 4:
            answer.data.relaxamento = 1;
            break;
          case 5:
            answer.data.sonolencia = 1;
            break;
          case 6:
            answer.data.desanimo = 1;
            break;
          case 7:
            answer.data.desagrado = 1;
            break;
          case 8:
            answer.data.angustia = 1;
            break;
        }
        if (element.attr('fill-opacity') == "0.5") {
          $scope.form.answer = JSON.stringify(answer);
        }
        break;
        /**
         * Técnica Affect Grid
         */
      case 2:
        var index = element.index() + 1;
        var line = Math.ceil(index / 9);
        var column = Math.round((index / 9 - Math.floor(index / 9)) * 9) || 9;
        line--;
        column--;
        answer.max = 4;
        answer.min = 0;
        answer.data = {
          agradavel: (function (line, column) {
            var _line = column < 4 ? 0 : column - answer.max;
            var _column;
            if (line == 4) {
              _column = _line;
            } else if (line > 4) {
              _column = _line - (line - 4);
            } else {
              _column = _line - ((8 - line) - 4);
            }
            if (column < 4 || _column < -1) {
              _line = 0;
              _column = 0;
            }
            var value = parseFloat(((_line + _column) / 2).toFixed(1));
            value = value < 0 ? 0 : value;
            return value;
          })(line, column),
          excitacao: (function (line, column) {
            var _line = line > 4 ? 0 : answer.max - line;
            var _column = column < 4 ? 0 : column - answer.max;
            if (line > 4 || column < 4) {
              _line = 0;
              _column = 0;
            }
            var value = parseFloat(((_line + _column) / 2).toFixed(1));
            return value;
          })(line, column),
          alta_excitacao: (function (line, column) {
            var _line = line > 4 ? 0 : answer.max - line;
            var _column;
            if (column == 4) {
              _column = _line;
            } else if (column > 4) {
              _column = _line - (column - 4);
            } else {
              _column = _line - ((8 - column) - 4);
            }
            if (line > 4 || _column < -1) {
              _line = 0;
              _column = 0;
            }
            var value = parseFloat(((_line + _column) / 2).toFixed(1));
            value = value < 0 ? 0 : value;
            return value;
          })(line, column),
          estresse: (function (line, column) {
            var _line = line > 4 ? 0 : answer.max - line;
            var _column = column > 4 ? 0 : answer.max - column;
            if (line > 4 || column > 4) {
              _line = 0;
              _column = 0;
            }
            var value = parseFloat(((_line + _column) / 2).toFixed(1));
            return value;
          })(line, column),
          desagradavel: (function (line, column) {
            var _line = column > 4 ? 0 : answer.max - column;
            var _column;
            if (line == 4) {
              _column = _line;
            } else if (line > 4) {
              _column = _line - (line - 4);
            } else {
              _column = _line - ((8 - line) - 4);
            }
            if (column > 4 || _column < -1) {
              _line = 0;
              _column = 0;
            }
            var value = parseFloat(((_line + _column) / 2).toFixed(1));
            value = value < 0 ? 0 : value;
            return value;
          })(line, column),
          depressao: (function (line, column) {
            var _line = line < 4 ? 0 : line - answer.max;
            var _column = column > 4 ? 0 : answer.max - column;
            if (line < 4 || column > 4) {
              _line = 0;
              _column = 0;
            }
            var value = parseFloat(((_line + _column) / 2).toFixed(1));
            return value;
          })(line, column),
          sonolencia: (function (line, column) {
            var _line = line < 4 ? 0 : line - answer.max;
            var _column;
            if (column == 4) {
              _column = _line;
            } else if (column > 4) {
              _column = _line - (column - 4);
            } else {
              _column = _line - ((8 - column) - 4);
            }
            if (line < 4 || _column < -1) {
              _line = 0;
              _column = 0;
            }
            var value = parseFloat(((_line + _column) / 2).toFixed(1));
            value = value < 0 ? 0 : value;
            return value;
          })(line, column),
          relaxamento: (function (line, column) {
            var _line = line < 4 ? 0 : line - answer.max;
            var _column = column < 4 ? 0 : column - answer.max;
            if (line < 4 || column < 4) {
              _line = 0;
              _column = 0;
            }
            var value = parseFloat(((_line + _column) / 2).toFixed(1));
            return value;
          })(line, column)
        }
        if (element.attr('fill-opacity') == "0.5") {
          $scope.form.answer = JSON.stringify(answer);
        }
        break;
        /**
         * Técnica PANAS
         */
      case 3:
        var elements = element.parent().parent().children('tr');
        elements.each(function (index) {
          var element_checked = $(this).children('td[fill-opacity="0.5"]');
          if (!element_checked.length) {
            $(this).addClass('no-validate');
          } else {
            $(this).removeClass('no-validate');
          }
        });
        var value = element.index();
        var total_elements = elements.length;
        var label = element.parent().children('td:first-child').text().toLowerCase();
        if (element.attr('fill-opacity') == "0.5") {
          $scope.panas[label] = value;
        } else {
          delete $scope.panas[label];
        }
        answer.max = 5;
        answer.min = 1;
        if (Object.keys($scope.panas).length == total_elements) {
          answer.data = $scope.panas;
          $scope.form.answer = JSON.stringify(answer);
        }
        break;
        /**
         * Técnica AttrakDiff
         */
      case 4:
        var elements = element.parent().parent().children('.item.range');
        elements.each(function (index) {
          var id = jQuery(this).children('[fill-opacity]').attr('id');
          if (!$scope.attrakdiff[id]) {
            $(this).addClass('no-validate');
          } else {
            $(this).removeClass('no-validate');
          }
        });
        var total_elements = elements.length;
        answer.max = 6;
        answer.min = 0;
        answer.data = $scope.attrakdiff;
        if (Object.keys($scope.attrakdiff).length == total_elements) {
          $scope.form.answer = JSON.stringify(answer);
        }
        break;
        /**
         * Técnica PrEMO
         */
      case 5:
        var keys = Object.keys($scope.premo);
        var isChecked = false;
        checkedLoop: for (var i = 0; i < keys.length; i++) {
          if ($scope.premo[keys[i]] == true) {
            isChecked = true;
            break checkedLoop;
          }
        }
        if (isChecked) {
          answer.type = 'boolean';
          answer.max = true;
          answer.min = false;
          answer.data = $scope.premo;
          $scope.form.answer = JSON.stringify(answer);
        }
        break;
        /**
         * Técnica ESM
         */
      case 6:
        element.attr('fill-opacity', '0.5');
        element.parent().siblings().find('label').attr('fill-opacity', '0');
        var key = element.attr('id');
        answer.type = 'boolean';
        answer.max = true;
        answer.min = false;
        answer.data = {
          muito_satisfeito: false,
          satisfeito: false,
          indiferente: false,
          insatisfeito: false,
          muito_insatisfeito: false
        }
        answer.data[key] = true;
        $scope.form.answer = JSON.stringify(answer);
        break;
        /**
         * Técnica SAM
         */
      case 8:
        var elements = element.parents('.item').parent().children('.item:not(.item-divider)');
        var total_elements = elements.length;
        elements.addClass('no-validate');
        var keys = Object.keys($scope.sam);
        for (var i = 0; i < keys.length; i++) {
          $('#' + keys[i]).parents('.item').removeClass('no-validate');
        }
        answer.max = 8;
        answer.min = 0;
        if (keys.length == total_elements) {
          answer.data = $scope.sam;
          $scope.form.answer = JSON.stringify(answer);
        }
        break;
    }
    element.siblings('rect').attr('fill-opacity', '0');
    element.siblings('td').attr('fill-opacity', '0');
    console.log($scope.form.answer);
  }
  $scope.getNumber = function ($value, $sum) {
    if (!$value) {
      return null;
    }
    return parseInt($value) + $sum;
  }

  /**
   * Método que submete a resposta da técnica escolhida
   */
  $scope.submit = function () {
    if ($scope.formModel.$invalid) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgRequiredOption')
      }).then(function () {});
      return;
    }
    var date = new Date();
    var params = {
      date: $filter('date')(date, "yyyy-MM-dd"),
      time: $filter('date')(date, "HH:mm"),
      answer: $scope.form.answer,
      client_id: $rootScope.authData.client.id,
      scheduler_id: $scope.notificationData.id,
      technique_id: $scope.notificationData.technique.id
    };
    if ($rootScope.location.latitude) {
      angular.extend(params, $rootScope.location);
    }
    requestService.setAnswer(params, {
      success: function () {
        $ionicPopup.alert({
          title: $translate.instant('popupSuccess'),
          template: $translate.instant('msgAnswerSuccess')
        }).then(function () {
          $state.go('answer');
          delete $rootScope.notification;
          $rootScope.isSended = false;
          $rootScope.checkNewQuestion();
        });
      }
    });
  };
  $rootScope.getPosition();
});

UXSense.controller('AnswersController', function ($scope, $state, $stateParams, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout, $ionicHistory) {
  console.log("AnswersController");
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $scope.answers = [];
  $scope.getAnswerList = function (loading) {
    requestService.getAnswers({
      success: function (data) {
        $scope.answers = data.answers;
        $rootScope.isSended = false;
        $rootScope.checkNewQuestion();
      }
    }, loading);
  };
  $scope.getAnswerList(true);
});

UXSense.controller('AppController', function ($scope, $state, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout, $ionicHistory, $ionicTabsDelegate) {
  console.log("AppController");
  $scope.onTabSelected = function (el) {
    switch (el.navViewName) {}
  };
  $scope.onTabDeselected = function (el) {
    switch (el.navViewName) {
      case "teams":
        $rootScope.isTeams = false;
        break;
    }
  };
  $scope.goForward = function () {
    var selected = $ionicTabsDelegate.selectedIndex();
    if ($state.current.name == "answer.send") {
      return;
    }
    if (selected !== -1) {
      $ionicTabsDelegate.select(selected + 1);
    }
  };
  $scope.goBack = function () {
    var selected = $ionicTabsDelegate.selectedIndex();
    if ($state.current.name == "answer.send") {
      return;
    }
    if (selected !== -1 && selected !== 0) {
      $ionicTabsDelegate.select(selected - 1);
    }
  };
});

UXSense.controller('HomeController', function ($scope, $state, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout, $ionicHistory, $window) {
  console.log("HomeController");
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $rootScope.checkNewQuestion();
});

UXSense.controller('LoginController', function ($scope, $state, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout, $ionicHistory, $window) {
  console.log("LoginController");
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $scope.form = {};
  $scope.goToSignUp = function () {
    $state.go('signup');
  };
  $scope.goToLostPassword = function () {
    $state.go('lostPassword');
  };
  $scope.submit = function () {
    if ($scope.formModel.$invalid) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgRequiredFields')
      }).then(function () {});
      return;
    }
    if (!$scope.form.password.test(".{6,16}")) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgPasswordNotValidation')
      }).then(function () {});
      return;
    }
    var params = JSON.clone($scope.form);
    var device = ionic.Platform.device();
    $rootScope.isSended = false;
    $rootScope.generateTokenFCM(function (token) {
      device.registrator_id = token;
      angular.extend(params, device);
      requestService.login(params, {
        success: function (data) {
          $scope.form = {};
          $rootScope.authData = data || {};
          $rootScope.authData.authenticated = true;
          $rootScope.authHeader['GSX-DEVICE'] = data.device.id;
          $rootScope.authHeader['GSX-TOKEN'] = data.device.token;
          $rootScope.updateDataStorage();
          $state.go('home');
        }
      });
    });
  };
});

UXSense.controller('LostPasswordController', function ($scope, $state, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout) {
  console.log("LostPasswordController");
  $scope.form = {};
  $scope.validate = {};
  $scope.submit = function () {
    if ($scope.formModel.$invalid) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgRequiredFields')
      }).then(function () {});
      return;
    }
    var params = JSON.clone($scope.form);
    requestService.lostPassword(params, {
      success: function (data) {
        var message = $translate.instant('msgLostPasswordError');
        if (data.sent === true) {
          message = $translate.instant('msgLostPasswordSuccess');
        }
        $ionicPopup.alert({
          title: $translate.instant('popupSuccess'),
          template: message
        }).then(function (resp) {
          if (resp) {
            $rootScope.clearData();
            $state.go('login');
          }
        });
      }
    });
  };
});

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

UXSense.controller('MyAccountController', function ($scope, $state, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout) {
  console.log("MyAccountController");
  $scope.form = {};
  $scope.validate = {};
  var updateFormData = function () {
    var today = new Date();
    if ($rootScope.authData.client.datebirth) {
      var splitDate = $rootScope.authData.client.datebirth.split('-');
      $scope.form.datebirth = new Date();
      $scope.form.datebirth.setDate(splitDate[2]);
      $scope.form.datebirth.setMonth(parseInt(splitDate[1]) - 1);
      $scope.form.datebirth.setFullYear(parseInt(splitDate[0]));
    } else {
      $scope.form.datebirth = null;
    }
    $scope.form.name = $rootScope.authData.client.name;
    $scope.form.email = $rootScope.authData.client.email;
    $scope.form.register = $rootScope.authData.client.register;
    $scope.form.sex = $rootScope.authData.client.sex;
    today.setDate(today.getDate() - 1);
    $scope.validate.datebirth = today.toISOString().substring(0, 10);
  };
  updateFormData();
  $scope.submit = function () {
    if ($scope.formModel.$invalid) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgRequiredFields')
      }).then(function () {});
      return;
    }
    if (!$scope.form.password) {
      if ($scope.form.newpassword || $scope.form.newpassword_) {
        $ionicPopup.alert({
          title: $translate.instant('popupWarning'),
          template: $translate.instant('msgCurrentPasswordRequired')
        }).then(function () {
          $scope.form.newpassword = "";
          $scope.form.newpassword_ = "";
        });
        return;
      }
    } else {
      if ($scope.form.newpassword !== $scope.form.newpassword_) {
        $ionicPopup.alert({
          title: $translate.instant('popupWarning'),
          template: $translate.instant('msgPasswordNotEquals')
        }).then(function () {});
        return;
      }
    }
    var params = JSON.clone($scope.form);
    if (!$scope.form.datebirth) {
      delete params.datebirth;
    } else {
      params.datebirth = params.datebirth.substring(0, 10);
    }
    requestService.change(params, {
      success: function (data) {
        $rootScope.authData.client = data;
        $rootScope.updateDataStorage();
        $ionicPopup.alert({
          title: $translate.instant('popupSuccess'),
          template: $translate.instant('msgChangeSuccess')
        }).then(function (resp) {
          if (resp) {
            updateFormData();
          }
        });
      }
    });
  };
});

UXSense.controller('NewTeamController', function($scope, $state, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout, $ionicNavBarDelegate, $ionicHistory) {
  console.log("NewTeamController");
  $scope.form = {};
  $rootScope.isTeams = false;
  $scope.submit = function() {
    if ($scope.formModel.$invalid) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgRequiredFields')
      }).then(function() {});
      return;
    }
    var params = {
      client: $rootScope.authData.client.id,
      team: $scope.form.team.id
    };
    requestService.setTeamForClient(params, {
      success: function() {
        $ionicPopup.alert({
          title: $translate.instant('popupSuccess'),
          template: $translate.instant('msgTeamRegisterSuccess')
        }).then(function() {
          $state.go('teams');
          $rootScope.isSended = false;
          $rootScope.checkNewQuestion();
        });
      }
    },true);
  };
  var getGroupList = function() {
    requestService.getGroups({
      success: function(data) {
        $scope.groups = data.groups;
      }
    });
  };
  var getSubgroupList = function(groupId) {
    var params = {
      idGroup: groupId
    };
    requestService.getSubgroupByGroup(params, {
      success: function(data) {
        $scope.subgroups = data.subgroups;
      }
    });
  };
  var getTeamsList = function(subgroupId) {
    var params = {
      idSubgroup: subgroupId
    };
    requestService.getTeamBySubgroup(params, {
      success: function(data) {
        $scope.teams = data.teams;
      }
    });
  };
  $scope.changeGroup = function() {
    $scope.form.subgroup = null;
    $scope.form.team = null;
    $scope.subgroups = [];
    $scope.teams = [];
    if ($scope.form.group) {
      getSubgroupList($scope.form.group.id);
    }
  };
  $scope.changeSubgroup = function() {
    $scope.form.team = null;
    $scope.teams = [];
    if ($scope.form.subgroup) {
      getTeamsList($scope.form.subgroup.id);
    }
  };
  getGroupList();
});

UXSense.controller('SignupController', function ($scope, $state, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout) {
  console.log("SignupController");
  $scope.form = {
    sex: 'NIL'
  };
  $scope.validate = {};
  $scope.form.datebirth = null;
  var today = new Date();
  today.setDate(today.getDate() - 1);
  $scope.validate.datebirth = today.toISOString().substring(0, 10);
  $scope.submit = function () {
    if ($scope.formModel.$invalid) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgRequiredFields')
      }).then(function () {});
      return;
    }
    if (!$scope.form.password.test(".{6,16}") || !$scope.form.password_.test(".{6,16}")) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgPasswordNotValidation')
      }).then(function () {});
      return;
    }
    if ($scope.form.password !== $scope.form.password_) {
      $ionicPopup.alert({
        title: $translate.instant('popupWarning'),
        template: $translate.instant('msgPasswordNotEquals')
      }).then(function () {});
      return;
    }
    var params = JSON.clone($scope.form);
    if (!$scope.form.datebirth) {
      delete params.datebirth;
    } else {
      params.datebirth = params.datebirth.substring(0, 10);
    }
    requestService.signup(params, {
      success: function (data) {
        $rootScope.authData.client = data;
        $ionicPopup.alert({
          title: $translate.instant('popupSuccess'),
          template: $translate.instant('msgSignupSuccess')
        }).then(function (resp) {
          if (resp) {
            $rootScope.updateDataStorage();
            $state.go('login');
          }
        });
      }
    });
  };
});

UXSense.controller('TeamsController', function($scope, $state, $stateParams, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout, $ionicHistory) {
  console.log("TeamsController");
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $scope.teams = [];
  $rootScope.newTeam = function() {
    $state.go('teams.newTeam');
  };
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
    if (toState.name == "teams" && fromState.name == "teams.newTeam") {
      $scope.getTeamList(true);
    }
  });
  $scope.getTeamList = function(loading) {
    var params = {
      idClient: $rootScope.authData.client.id
    };
    requestService.getTeamByClient(params, {
      success: function(data) {
        $scope.teams = data.teams;
      }
    }, loading);
  };
  $scope.getTeamList(true);
  $scope.delete = function(team) {
    $ionicPopup.show({
      title: $translate.instant('popupWarning'),
      template: $translate.instant('msgTeamDeleteConfirm'),
      buttons: [{
        text: $translate.instant('labelCancel')
      }, {
        text: '<b>' + $translate.instant('labelDelete') + '</b>',
        type: 'button-assertive',
        onTap: function(e) {
          var params = {
            client: $rootScope.authData.client.id,
            team: team.id
          };
          requestService.deleteTeamForClient(params, {
            success: function() {
              $scope.getTeamList(true);
            }
          });
        }
      }]
    });
  };
});

UXSense.controller('TermController', function ($scope, $state, $rootScope, requestService, $translate, $ionicModal, $ionicPopup, $timeout, $ionicHistory, $window) {
  console.log("TermController");
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $scope.submit = function () {
    $rootScope.notificationConfig();
    $rootScope.terms = $rootScope.terms || {};
    $rootScope.terms[$rootScope.termVersion] = true;
    $rootScope.updateDataStorage();
    $state.go('login');
  };
});
