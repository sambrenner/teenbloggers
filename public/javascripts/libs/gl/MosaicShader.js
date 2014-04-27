THREE.MosaicShader = {

  uniforms: {

    "tDiffuse": { type: "t", value: null },
    "size": { type: "f", value: 400.0 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D tDiffuse;",
    "uniform float size;",

    "varying vec2 vUv;",

    "void main() {",

      "if(size == 400.0) {",
        "gl_FragColor = texture2D(tDiffuse, vUv);", //off
      "} else {",
        "vec2 uv = floor(vUv * size)/size;",
        "gl_FragColor = texture2D(tDiffuse, uv);", //on
      "}",
    "}"

  ].join("\n")

};
