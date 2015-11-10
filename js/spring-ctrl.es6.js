import * as rebound from 'rebound';
import * as R from 'ramda';

/**
 * Spring Controller
 */
export default function SpringCtrl($element, $scope, $window) {

  const h = 64;
  let w, MAX_OFFSET;

  var applySize = (isInit) => {
    const elementInfo = $element[0].getBoundingClientRect();
    w = elementInfo.width;
    MAX_OFFSET = w * 0.5;
    console.log(w, MAX_OFFSET);
    this.y = (elementInfo.height - h) * 0.5;
    this.render(0);
    this.end = getEnd(w, h);
    if (!isInit) {
      $scope.$apply();
    }
  };

  // Bind to window resize
  angular.element($window).bind('resize', applySize);

  this.render = (offset) => {
    requestAnimationFrame(() => {
      const start = getStart(w, offset);
      this.springPath = buildSpring(w, h, start);
      this.x = start - h - 4;
      this.formulaX = rebound.MathUtil
        .mapValueInRange(Math.abs(offset), 0, MAX_OFFSET, 0, 100);
    });
  };

  // Build and attach spring
  const springSystem = new rebound.SpringSystem();
  this.spring = springSystem.createSpring();
  this.spring.addListener({
    onSpringUpdate: (spring) => {
      const val = spring.getCurrentValue();
      const mappedVal = rebound.MathUtil
        .mapValueInRange(val, 0, 1, 0, this.offset);
      this.render(mappedVal);
    }
  });

  // Update spring if the stiffness is changed
  $scope.$watch('ctrl.k', () => {
    const springConfig = rebound.SpringConfig
      .fromOrigamiTensionAndFriction(this.k, 3);
    this.spring.setSpringConfig(springConfig);
  });

  // Interaction handlers
  this.onDragStart = (e) => {
    this.isDragging = true;
    this.xStart = e.x;
  };

  this.onDrag = (e) => {
    if (this.isDragging) {
      this.offset = -Math.min(MAX_OFFSET, Math.max(0, this.xStart - e.x));

      const val = rebound.MathUtil
        .mapValueInRange(this.offset, 0, -MAX_OFFSET, 0, 1);
      this.spring.setCurrentValue(val).setAtRest();
      this.render(this.offset);
    }
  };

  this.onDragEnd = (e) => {
    if (this.isDragging) {
      this.spring.setEndValue(0);
      this.isDragging = false;
    }
  };

  // Init
  applySize(true);

}

/**
 * Utilities
 */
function buildSpring(w, h, start) {

  const count = 128;
  const pitch = (w - start) / count;
  const amplitude = h / 4;

  const startSection =  [
    'M', start, h * 0.5,
    'L', start - 10, h * 0.5
  ].join(' ');

  const wave = R.map(function(idx) {
    return [
      start + pitch * idx,
      (h * 0.5) + amplitude * Math.round(Math.sin(Math.PI * idx / 2))
    ];
  }, R.range(0, count - 1));

  const springBody = R.flatten(R.addIndex(R.map)(function(pt, idx) {
    return ['L', pt[0], pt[1]];
  }, wave)).join(' ');

  const endSection =  [
    'M', w - 2 * pitch, h * 0.5,
    'L', w - 2, h * 0.5
  ].join(' ');

  return startSection + springBody + endSection;

}

function getStart(w, offset) {
  return  w * 0.8 + offset;
}

function getEnd(w, h) {
  return [
    'M', w - 2, 2,
    'L', w - 2, h - 2
  ].join(' ');
}
