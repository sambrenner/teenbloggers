var game = game || {};

game.threejs = (function(window, document) {
  var _renderer, _camera, _scene, _composer, _plane, _mosaicShader;
  var _width, _height;
  var _animationFrameId;
  var _sourceCanvas, _$renderer;

  var _render = function() {
    _animationFrameId = requestAnimationFrame(_render);
    _composer.render();
  };

  var _initComposer = function() {
    var renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat};
    var renderTarget = new THREE.WebGLRenderTarget(_width, _height, renderTargetParameters);

    _composer = new THREE.EffectComposer(_renderer, renderTarget);
    _composer.addPass( new THREE.RenderPass(_scene, _camera));

    _mosaicShader = new THREE.ShaderPass(THREE.MosaicShader);
    _mosaicShader.renderToScreen = true;
    _composer.addPass(_mosaicShader);
  };

  var self = {
    init: function(sourceCanvas) {
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

      _renderer.setSize(_width, _height);

      _$renderer = $(_renderer.domElement);
      $container.append(_$renderer);

      _sourceCanvas = sourceCanvas;
      _initComposer();
    },

    updateTexture: function() {
      if(_plane) _scene.remove(_plane);

      var texture = new THREE.Texture(_sourceCanvas);
      texture.needsUpdate = true;

      var material = new THREE.MeshBasicMaterial({map: texture});
      _plane = new THREE.Mesh(new THREE.PlaneGeometry(_width, _height), material); 
      _scene.add(_plane);
    },

    setMosaicValue: function(value) {
      _mosaicShader.uniforms['size'].value = value;
    },

    prepareForTransition: function() {
      _$renderer.show();
      _render();
    },

    postTransition: function() {
      _$renderer.hide();
      window.cancelAnimationFrame(_animationFrameId);
    }
  };

  return self;
})(this, this.document)