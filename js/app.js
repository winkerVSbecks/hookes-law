angular.module('hookesLaw', [])
  .controller('MainCtrl', function($interval){

    var vm = this;

    vm.vibration = 'vibrey-lg-off';

    $interval(function() {
      vm.vibration = vm.vibration === 'vibrey-lg-off' ?
        'vibrey-lg-on' : 'vibrey-lg-off';
    }, 100)

  });
