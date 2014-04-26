var game = game || {};

game.threejs = (function(window, document) {
  var _renderer, _camera, _scene, _composer, _plane;
  var _width, _height;

  var _render = function() {
    requestAnimationFrame(_render);
    //_composer.render();
    _renderer.render(_scene, _camera);
  };

  var _initComposer = function() {
    var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
    var renderTarget = new THREE.WebGLRenderTarget(_width, _height, renderTargetParameters);

    _composer = new THREE.EffectComposer(_renderer, renderTarget);
    _composer.addPass( new THREE.RenderPass(_scene, _camera));

    _mosaicShader = new THREE.ShaderPass(THREE.MosaicShader);
    _mosaicShader.renderToScreen = true;
    _composer.addPass(_mosaicShader);
  };

  var self = {
    init: function() {
      var $container = $('#game');
      _width = 640;
      _height = 480;

      _renderer = new THREE.WebGLRenderer({
        alpha: true
      });

      var aspectRatio = _width/_height;

      _camera = new THREE.OrthographicCamera(_width / - 2, _width / 2, _height / 2, _height / - 2, 1, 1000);
      _camera.position.set(0,0,100);

      _scene = new THREE.Scene();
      _scene.add(_camera);

      var plane = new THREE.Mesh(new THREE.PlaneGeometry(_width, _height), new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide}));
      _scene.add(plane);

      _renderer.setSize(_width, _height);

      $container.append(_renderer.domElement);

      _initComposer();
      _render();
    },

    setTexture: function(pixelData) {
      //_renderer.context gives access to GL calls

      
    }
  };

  return self;
})(this, this.document)