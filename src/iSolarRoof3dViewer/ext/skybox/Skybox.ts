

import * as THREE from 'three';

const createSky = () => {
    // SKYDOME
    const doc: any = document
    const vertexShader: any = doc.getElementById('vertexShader').textContent;
    const fragmentShader: any = doc.getElementById('fragmentShader').textContent;
    const uniforms = {
        topColor: { value: new THREE.Color('rgb(20%, 52%, 100%)') },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
    };



    const skyGeo = new THREE.SphereGeometry(1000, 15, 32);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
 varying vec3 vWorldPosition;
 void main() {
 vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
 vWorldPosition = worldPosition.xzy;
 gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`,
        fragmentShader: `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {

float h = normalize( vWorldPosition + offset ).y;
gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

 }
`,
        side: THREE.DoubleSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);

    // sky.rotateZ(Math.PI / 2)
    return sky;
};

export {
    createSky
}
