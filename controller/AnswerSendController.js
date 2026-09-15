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
