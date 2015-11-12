import * as angular from 'angular';
import 'angular-touch';
import MainCtrl from './main-ctrl';
import SpringCtrl from './spring-ctrl';

/**
 * Hooke's Law
 */
angular.module('hookesLaw', [
  'ngTouch'
])
  .controller('MainCtrl', ['$interval', MainCtrl])
  .controller('SpringCtrl', ['$element', '$scope', '$window', SpringCtrl])
  .directive('spring', () => {
    return {
      restrict: 'E',
      replace: true,
      templateNamespace: 'svg',
      bindToController: true,
      scope: {
        k: '=',
        formulaX: '='
      },
      controllerAs: 'ctrl',
      controller: 'SpringCtrl',
      templateUrl: 'js/spring.html'
    };
  });
