(function () {
  var app = angular.module('chatbot', ['angular-inview']);


  app.controller('chatbotCtrl', ['$scope', '$http', '$filter', '$window', '$rootScope', '$q', '$timeout', 'httpDataService', function ($scope, $http, $filter, $window, $rootScope, $q, $timeout, httpDataService) {

    $scope.init = function () {
      $scope.chatToggle('close');
      $scope.userId = guid();
      $scope.rootUrlBot = 'http://35.231.92.3:8081/Score';
      $scope.messageList = [];
      $scope.realEstatesDataSeller = {};
      $scope.realEstatesDataBuyer = [];
      $scope.showChatBox = true;
      $scope.itemArray = [];
      $scope.showautofillFiltered = false;
      $scope.resetChatBot();
      
      
    };
    $scope.chatToggle = function (state) {
      if ($scope.messageList && $scope.messageList.length > 1) {
        //	$scope.resetChatBot();
      }
      if (state === 'open') {
        $scope.showChatBox = true;
        $scope.showChatBot = true;

      } else {
        $scope.showChatBot = false;
        $scope.popup = [];
        //$scope.showChatBox = false;
      };
    };


    $scope.resetChat = function () {
      $scope.resetChatBot();
      $scope.popup = [];
      $scope.itemArray = [];
      $(".resetColorOnChecked").removeClass("resetColorOnChecked");
    };

    /*popup minimizeButtn*/
    $scope.minimizeButtn = function () {
      $scope.showChatBot = true;
      $scope.showautofillFiltered = !$scope.showautofillFiltered;
    };
    $scope.pluginResponseData = {};
    $scope.floatButtonClick = function () {
      $scope.showQuickAccessMenu = !$scope.showQuickAccessMenu;
      httpDataService.getApiReponse().then(function (data) {
        httpDataService.getResponse(data).then(function (responseData) {
          $scope.pluginResponseData = responseData.data.plugin.data;
        });
      });
    }

    /* Reset chatBot */
    $scope.resetChatBot = function () {

      $http.get('http://ip-api.com/json/')
        .success(function (coordinates) {
          $scope.myCoordinates = {};
          $scope.myCoordinates.state = coordinates.regionName;
          $scope.myCoordinates.city = coordinates.city;
          $scope.userId = guid();
          var data = {
            "messageSource": "userInitiatedReset",
            "messageText": "",
            "user_id": $scope.userId,
            "state": $scope.myCoordinates.state,
            "city": $scope.myCoordinates.city
          };

          $scope.messageList = [];
          $scope.realEstatesDataBuyer = [];
          $scope.realEstatesDataSeller = {};
          $scope.sellerChatActive = false;
          $scope.autofill = {};
          $scope.autofillHide = false;

          $http.post($scope.rootUrlBot,data).then(function successCallback(response) {

            if (response && response.data && response.data.messageText && response.data.messageSource) {
              response.data.messageTime = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
              $scope.messageList.push(response.data);
              ////console.info(response.data);
              $scope.messageText = null;
            } else {
              $scope.messageList = [];
            }

          }, function errorCallback(response) {
            $scope.messageList = [];
          });
        })







    };

    /* create uuid */
    function guid() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    $scope.sendMessage = function (event) {
      if (event && event.keyCode === 13) {
        event.preventDefault();
        $scope.realEstatesDataBuyer = [];
        $scope.realEstatesDataSeller = {};
        $scope.sendMessageToBot();
        $scope.popup = [];
      } else if (event && event.keyCode && (event.keyCode === 40 || event.keyCode === 38) && $scope.autofill && $scope.autofill.data && $scope.messageText) {
        event.preventDefault();
        var limit = 8;
        var autofillArray = $filter('autofill')($scope.autofill.data, $scope.messageText);
        // limit filter result to limited value
        if (autofillArray && autofillArray.slice(0, limit)) {
          autofillArray = autofillArray.slice(0, limit);
        }
        if (event.keyCode === 40 && autofillArray.length > $scope.autofillActive + 1) {
          $scope.autofillActive++;
        } else if (event.keyCode === 38 && $scope.autofillActive > 0) {
          $scope.autofillActive--;
        }



      }
    };

    $scope.buttonSelection = function (accessFrom, btnvalue) {
      if (accessFrom == 1) {
        $scope.isCheckBoxDisabled = false;
        $scope.isCheckBoxPrefDisabled = false;
        $scope.showQuickAccessMenu = false;
        // $angule.parent().find("a").removeClass("enabled");
        var element = document.getElementsByClassName("autofillList");
        $(".resetColorOnChecked").removeClass("resetColorOnChecked");
        $scope.resetChat();
        $scope.messageText = btnvalue;
        $scope.sendMessageToBot();
      } else if (accessFrom == 2) {

        $scope.messageText = btnvalue;
        $scope.sendMessageToBot();
        if ($scope.resdata && $scope.resdata.plugin && $scope.resdata.plugin.data && $scope.resdata.plugin.data[0] && $scope.resdata.plugin.data[0] === "New Search") {
          $scope.resetChatBot();
          $scope.popup = false;
        }
      }


    }

$scope.openLnk = function(location){
    $window.open(location, '_blank');;
}
$scope.openLink = function(location){
    $window.open(location.JobLink, '_blank');;
}

    /*checkbox clicking*/
    $scope.isCheckBoxDisabled = false;
    $scope.isCheckBoxPrefDisabled = false;
    $scope.selectItems = function (item) {
      if (item.value == 'No preference') {
        $scope.isCheckBoxPrefDisabled = false;
        $scope.isCheckBoxDisabled = item.status;
        item.status != item.status;
        var itemIndex = $scope.itemArray.indexOf(item.value);
        if (item.status == true) {
          if (itemIndex == -1) {
            $scope.itemArray.push(item.value);
          }
        } else {
          $scope.itemArray.splice(itemIndex, 1);
        }

      }
      else {
        $scope.isCheckBoxPrefDisabled = item.status;
        item.status != item.status;

        var itemIndex = $scope.itemArray.indexOf(item.value);
        if (item.status == true) {
          if (itemIndex == -1) {
            $scope.itemArray.push(item.value);
          }
        } else {
          $scope.itemArray.splice(itemIndex, 1);
        }

      }

    }
    $scope.textSelection = function (item) {
      if (item.value == 'No preference') {
        $scope.isCheckBoxPrefDisabled = false;
        $scope.isCheckBoxDisabled = item.status;
        item.status != item.status;
        var itemIndex = $scope.itemArray.indexOf(item.value);
        if (item.status == true) {
          if (itemIndex == -1) {
            $scope.itemArray.push(item.value);
          }
        } else {
          $scope.itemArray.splice(itemIndex, 1);
        }
      } else {
        $scope.isCheckBoxPrefDisabled = item.status;
        item.status != item.status;
        var itemIndex = $scope.itemArray.indexOf(item.value);
        if (item.status == true) {
          if (itemIndex == -1) {
            $scope.itemArray.push(item.value);
          }
        } else {
          $scope.itemArray.splice(itemIndex, 1);
        }
      }
    }

    $scope.chatDone = function () {
      var chatitem = '';
      $scope.itemArray.forEach(function (d, dindex) {
        if (dindex === 0) {
          chatitem = d;
        } else {
          chatitem = chatitem + ',' + d;
          //////console.log(chatitem);
        }

      })
      $scope.messageText = chatitem;
      $scope.sendMessageToBot();
      $scope.popup = [];
      $scope.itemArray=[];
    }
    $scope.checkboxReset = function () {
      $scope.itemArray = [];
      if ($scope.popup) {
        $scope.popup.forEach(function (d) {
          d.status = false;
        });
      }
    }

    $scope.sendMessageToBot = function () {
      if ($scope.messageText) {
        /*autofill filter*/
        if ($scope.autofill && $scope.autofill.data) {
          ////console.info("step 1");
          var autofillArray = $filter('popup')($scope.autofill.data, $scope.messageText);
          if (autofillArray && autofillArray[$scope.autofillActive]) {
            ////console.info("step 2");
            $scope.messageText = autofillArray[$scope.autofillActive];
            ////console.info($scope.messageText);
          } else {
            ////console.info("step 3");
            $scope.messageFromBot(['Unfortunately, we could not find the ' + $scope.autofill.type + ' you are searching for!', ' Please try another one.'], null);
            $scope.autofillHide = true;
            ////console.info("unfortune");
            return;
          };
          ////console.info("step 4");
        };
        var data = {};
        if ($scope.sellerChatActive) {
          ////console.info("step 5");
          data = {
            "messageSource": "sellerFlag",
            "messageText": $scope.messageText,
            "user_id": $scope.userId,
            "state": $scope.myCoordinates.state,
            "city": $scope.myCoordinates.city
          };
        } else {
          ////console.info("step 6");
          if ($scope.messageList[$scope.messageList.length - 1].plugin && $scope.messageList[$scope.messageList.length - 1].plugin.type == "manufacturers") {
            //////console.info("inside step 6 if");
            for (i = 0; i < $scope.messageList[$scope.messageList.length - 1].plugin.data.length; i++) {
              //  //////console.info(i);
              // //////console.info($scope.messageList[$scope.messageList.length-1].plugin.data);
              //////console.info($scope.messageList[$scope.messageList.length - 1].plugin.data[i]);
              //////console.info($scope.messageText);
              var appendedMsg = $scope.messageText.split(",");
              var textString='';
              var isInManList=[];
              angular.forEach(appendedMsg, function (value,key) {
                if ($scope.messageList[$scope.messageList.length - 1].plugin.data[i] == $scope.messageText) {
                  isInManList.push(true);
                }
              });
              if (isInManList.indexOf(false)==-1){
                //////console.info("do i get here");
                data = {
                  "messageSource": "messageFromUser",
                  "messageText": $scope.messageText,
                  "user_id": $scope.userId,
                  "state": $scope.myCoordinates.state,
                  "city": $scope.myCoordinates.city
                };
                $scope.messageFromUser();

                $http.post($scope.rootUrlBot,data).then(function successCallback(response) {
                  //////console.info("step 7");
                  if (response && response.data) {
                    //  response.data = {    "messageText": [        ["Which manufacturer you would like to prefer ?"]    ],    "messageSource": "messengerUser",    "plugin": {        "data": [            "Savage",            "Beretta",            "Winchester",            "Davey Crickett",            "Bersa",            "KEL-TEC",            "H&R 1871",            "Taurus",            "Bond Arms",            "Springfield",            "EAA Corp.",            "Glock",            "Smith & Wesson",            "Armalite",            "Del-Ton",            "Rock River Arms",            "Henry Repeating Arms",            "American Tactical",            "Weatherby",            "Diamondback Firearms",            "Heckler & Koch",            "Kimber",            "Sig Sauer",            "Browning",            "Marlin",            "Zastava Arms",            "FN America",            "Howa",            "Kahr Arms",            "Daniel Defense",            "Hi Point Firearms",            "DPMS",            "Ruger",            "Walther",            "Austrian Sporting Arms",            "Sako",            "Mossberg",            "Magnum Research",            "Benelli",            "Century",            "Heritage Arms",            "Colt",            "Romarm/Cugir",            "Remington",            "Charter Arms",            "Canik",            "Bushmaster",            "CZ-USA"        ],        "type": "items",        "name": "popup"    }};
                    $scope.resdata = response.data;

                    // plugin
                    if (response.data.plugin) {

                      // plugin for autofill
                      if (response.data.plugin.name && response.data.plugin.name === "autofill") {
                        $scope.popupautofill = response.data.plugin.data;

                        // popup
                      } else if (response.data.plugin.name && response.data.plugin.name === "popup") {
                        if (response.data.plugin.type && response.data.plugin.type == "manufacturers"||response.data.plugin.type == "category") {
                          $timeout(function () {
                            $scope.$apply(function () {
                              /*response.data.plugin.data = true;*/
                              $scope.popup = [];

                              if (response.data.plugin.data && response.data.plugin.data.length) {
                                response.data.plugin.data.forEach(function (d) {
                                  $scope.popup.push({ "value": d, "status": false });
                                });
                              }
                            });
                          }, 1300);
                        }
                      }
                    }

                    if (response.data.messageText) {
                      $scope.messageFromBot(response.data.messageText, response.data.link, response.data.plugin);
                    }
                    if (response.data.messageSource && response.data.messageSource === 'sellerFlag') {
                      $scope.sellerChatActive = true;
                    } else {
                      $scope.sellerChatActive = false;
                    }

                    /* result of buyer */
                    if (response && response.data && response.data.ResultBuyer) {
                      $scope.realEstatesDataBuyer = response.data.ResultBuyer;
                      $scope.datalength = $scope.realEstatesDataBuyer.length;
                    }

                    /* result of seller */
                    if (response && response.data && response.data.ResultSeller) {
                      $scope.realEstatesDataSeller = response.data.ResultSeller;
                    }
                  }
                }, function errorCallback(response) {
                  $scope.showMsgLoader = false;
                });
                break;
              }
            }
          } else {
            //////console.info("no manu");
            data = {
              "messageSource": "messageFromUser",
              "messageText": $scope.messageText,
              "user_id": $scope.userId,
              "state": $scope.myCoordinates.state,
              "city": $scope.myCoordinates.city
            };
            $scope.messageFromUser();
         
  
            $http.post($scope.rootUrlBot,data).then(function successCallback(response) {
              //////console.info("step 7");
              if (response && response.data) {
                //  response.data = {    "messageText": [        ["Which manufacturer you would like to prefer ?"]    ],    "messageSource": "messengerUser",    "plugin": {        "data": [            "Savage",            "Beretta",            "Winchester",            "Davey Crickett",            "Bersa",            "KEL-TEC",            "H&R 1871",            "Taurus",            "Bond Arms",            "Springfield",            "EAA Corp.",            "Glock",            "Smith & Wesson",            "Armalite",            "Del-Ton",            "Rock River Arms",            "Henry Repeating Arms",            "American Tactical",            "Weatherby",            "Diamondback Firearms",            "Heckler & Koch",            "Kimber",            "Sig Sauer",            "Browning",            "Marlin",            "Zastava Arms",            "FN America",            "Howa",            "Kahr Arms",            "Daniel Defense",            "Hi Point Firearms",            "DPMS",            "Ruger",            "Walther",            "Austrian Sporting Arms",            "Sako",            "Mossberg",            "Magnum Research",            "Benelli",            "Century",            "Heritage Arms",            "Colt",            "Romarm/Cugir",            "Remington",            "Charter Arms",            "Canik",            "Bushmaster",            "CZ-USA"        ],        "type": "items",        "name": "popup"    }};
                $scope.resdata = response.data;

                // plugin
                if (response.data.plugin) {

                  // plugin for autofill
                  if (response.data.plugin.name && response.data.plugin.name === "autofill") {
                    $scope.popupautofill = response.data.plugin.data;

                    // popup
                  } else if (response.data.plugin.name && response.data.plugin.name === "popup") {
                    if (response.data.plugin.type && response.data.plugin.type == "manufacturers") {
                      $timeout(function () {
                        $scope.$apply(function () {
                          /*response.data.plugin.data = true;*/
                          $scope.popup = [];

                          if (response.data.plugin.data && response.data.plugin.data.length) {
                            response.data.plugin.data.forEach(function (d) {
                              $scope.popup.push({ "value": d, "status": false });
                            });
                          }
                        });
                      }, 1300);
                    }
                  }
                }

                if (response.data.messageText) {
                  $scope.messageFromBot(response.data.messageText, response.data.link, response.data.plugin);
                }
                if (response.data.messageSource && response.data.messageSource === 'sellerFlag') {
                  $scope.sellerChatActive = true;
                } else {
                  $scope.sellerChatActive = false;
                }

                /* result of buyer */
                if (response && response.data && response.data.ResultBuyer) {
                  $scope.realEstatesDataBuyer = response.data.ResultBuyer;
                  $scope.datalength = $scope.realEstatesDataBuyer.length;
                }

                /* result of seller */
                if (response && response.data && response.data.ResultSeller) {
                  $scope.realEstatesDataSeller = response.data.ResultSeller;
                }
              }
            }, function errorCallback(response) {
              $scope.showMsgLoader = false;
            });
          }



        }

      };
    };

    /*messenger - from user*/
    $scope.messageFromUser = function () {
      $scope.showChatBot = true;
      $scope.messageList.push({
        'messageSource': 'messageFromUser',
        'messageText': $scope.messageText,
        'messageTime': new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
      });

      // clear autofill after message is send
      if ($scope.autofill) {
        $scope.autofill = {};
      }
      $scope.messageText = '';
      $scope.showMsgLoader = true;
      $(".chatWrapper").animate({ scrollTop: $(".chatScroller").height() }, 500);
      $(".chatScroller").scrollTop()
    };


    /*messenger - from bot*/
    $scope.messageFromBot = function (message, link, plugin) {
      $scope.showChatBot = true;
      setTimeout(function () {
        $scope.$apply(function () {
          $scope.showMsgLoader = false;
          message.forEach(function (d, dindex) {
            $scope.messageList.push({
              'messageSource': 'messageFromBot',
              'messageText': d,
              'link': link,
/*              'plugin':plugin,
*/              'messageTime': new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
            });

            if (message.length - 1 === dindex) {
              $scope.messageList[$scope.messageList.length - 1].plugin = plugin;
            }
          });
          /*$(".chatScroller").scrollbottom()*/
          $(".chatWrapper").animate({ scrollTop: $(".chatScroller").height() }, 500);
          $(".chatScroller").scrollTop()
          document.querySelector('#messageText').focus();
        });
      }, 100);
    };


    // autofill option clicked
    $scope.autofillSelect = function (item) {
      $scope.messageText = item;
      /*$scope.sendMessageToBot();*/
      $scope.autofillHide = true;
      document.querySelector('#messageText').focus();
    };

    /* Change text in MessageText */
    $scope.changeMessageText = function () {
      $scope.autofillHide = false;

      // reset autofill active
      if ($scope.autofill && $scope.autofill.data) {
        $scope.autofillActive = 0;
      }
    };


    /* Lazy loading start */
    $scope.increLength = 12;
    $scope.lineInView = function () {
      if ($scope.datalength >= $scope.increLength) {
        $scope.increLength = $scope.increLength + 12;
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
          $scope.$apply();
        }
      }
    }
    /* Lazy loading end */


  }]);

  /* Auto fill filter*/
  app.filter('popup', function () {
    return function (items, input) {
      var filtered = [];

      if (input === undefined || input === '') {
        return items;
      }

      angular.forEach(items, function (item) {

        if (item.value.toLowerCase().indexOf(input.toLowerCase()) === 0) {
          filtered.push(item);
        }
      });
      return filtered;
    };
  });

  app.service('httpDataService', function ($http) {
   
  
    var httpDataService = {
      getResponse: function (postMap) {
        return $http.post('http://35.231.92.3:8081/Score',postMap).then(function (data) {

          // $scope.showJobCard=false;
          // if(data.plugin.name === 'link')
          // {
          //   $scope.showJobCard=true;
          // }
         return data;
          
        });
       


      },
      getApiReponse: function () {
        return $http.get('http://ip-api.com/json/').then(function (coordinates) {
          myCoordinates = {};
          myCoordinates.state = coordinates.regionName;
          myCoordinates.city = coordinates.city;
          myCoordinates.userId = guid();
          function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
          }
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          var data = {
            "messageSource": "userInitiatedReset",
            "messageText": "",
            "user_id": myCoordinates.userId,
            "state": myCoordinates.state,
            "city": myCoordinates.city
          };
          return data;
        });


      }
    }
    return httpDataService;
  });


})();
