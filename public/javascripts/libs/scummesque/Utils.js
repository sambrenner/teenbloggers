var Scummesque = Scummesque || {};

Scummesque.Utils = (function() {
  return {
    distanceToTime: function(distance, speed) {
      return (distance / speed) * 1000;
    },
    distance: function(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    }
  }
})();
