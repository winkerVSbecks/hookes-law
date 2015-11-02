/**
 * Main Controller
 */
export default function MainCtrl($interval) {

  this.vibration = 'vibrey-lg-off';
  this.k = 40;

  $interval(() => {
    this.vibration = this.vibration === 'vibrey-lg-off' ?
      'vibrey-lg-on' : 'vibrey-lg-off';
  }, 100);

};
