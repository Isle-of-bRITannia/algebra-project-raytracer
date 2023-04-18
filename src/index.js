import { Rt } from './raytracer/model.js';
import { calculate } from './raytracer/interpreter/calculate.js';
import { renderToCanvas } from './raytracer/interpreter/renderToCanvas.js';

const width = 640, height = 480;
// const width = 384, height = 288;
// const width = 192, height = 144;
// const width = 64, height = 48;
const canvas = document.querySelector('#canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas?.getContext('2d');

const myLights = calculate(Rt.addManyShaders(
  Rt.ambientLight([
    0.25,
    0.3,
    0.35,
  ]),
  Rt.sunLight(
    [
      0.269704,
      0.719857,
      -0.639582,
    ],
    [
      0.8,
      0.8,
      0.8,
    ],
  ),
));

const head = [
  [0, 1.75, 7.32238],
  [-0.92001, 0.782627, 6.05608],
  [-1.48862, 0.782627, 7.80605],
  [0, 0.782627, 8.88762],
  [1.48862, 0.782627, 7.80605],
  [0.92001, 0.782627, 6.05608],
  [-1.48862, -0.782627, 6.8387],
  [-0.92001, -0.782626, 8.58868],
  [0.92001, -0.782627, 8.58868],
  [1.48862, -0.782627, 6.8387],
  [0, -0.782626, 5.75713],
  [0, -1.75, 7.32238],
].map(center => Rt.sphere(
  center,
  1,
  calculate(Rt.multiplyShaders(
    myLights,
    () => [0.967, 0.412, 0.008],
  )),
));

const ears = [
  [-1.69861, 0.494547, 9.64351],
  [1.69861, 0.494547, 9.64351],
].map(center => Rt.sphere(
  center,
  1,
  calculate(Rt.multiplyShaders(
    myLights,
    () => [0.1, 0.1, 0.1],
  )),
));

const sclera = [
  [-1.34316, -1.94917, 7.82842],
  [1.34316, -1.94917, 7.82842],
].map(center => Rt.sphere(
  center,
  0.563577,
  calculate(Rt.multiplyShaders(
    myLights,
    () => [1, 1, 1],
  )),
));

const pupils = [
  [-1.35485, -2.02138, 7.82812],
  [1.35485, -2.02138, 7.82812],
].map(center => Rt.sphere(
  center,
  0.499329,
  calculate(Rt.multiplyShaders(
    myLights,
    () => [0.1, 0.1, 0.1],
  )),
));

const nose = Rt.sphere(
  [0, -2.30023, 7.32238],
  0.499329,
  calculate(Rt.multiplyShaders(
    myLights,
    () => [0.1, 0.1, 0.1],
  )),
);

const blep = Rt.sphere(
  [0, -1.14993, 5.92791],
  0.659217,
  calculate(Rt.multiplyShaders(
    myLights,
    () => [0.967, 0.008, 0.008],
  )),
);

const palms = [
  [4.36986, -2.55717, 3.82943],
  [-4.30152, -4.21584, 5.79678],
].map(center => Rt.sphere(
  center,
  1,
  calculate(Rt.multiplyShaders(
    myLights,
    () => [0.967, 0.412, 0.008],
  )),
));

const kidsNamedFinger = [
  [-4.63589, -4.73854, 6.94801],
  [-3.46634, -4.73135, 6.70691],
  [-5.31512, -3.97318, 6.59497],
  [4.97037, -3.53869, 4.45101],
  [5.47839, -2.45439, 4.38451],
  [3.93374, -3.71547, 4.42236],
].map(center => Rt.sphere(
  center,
  0.63636,
  calculate(Rt.multiplyShaders(
    myLights,
    () => [0.967, 0.412, 0.008],
  )),
));

const mirrorBalls = [
  [4.40554, -2.51629, 5.9505],
  [2.99489, -2.5316, 13.5262],
  [-3.78981, -2.84184, 10.1415],
].map(center => Rt.sphere(
  center,
  1.367,
  Rt.mirrorAssumingNormalized(),
));

const myObjects = [
  head,
  ears,
  sclera,
  pupils,
  nose,
  blep,
  palms,
  kidsNamedFinger,
  mirrorBalls,
  Rt.groundPlane(
    0,
    calculate(Rt.multiplyShaders(
      myLights,
      Rt.checkerColor(
        4,
        [0.5, 0.5, 0.5],
        [0.75, 0.75, 0.75],
      ),
    )),
  ),
].flat(1).map(calculate);

const mySkyShader = calculate(Rt.standardSky(
  [0.35, 0.5, 0.75],
  [0.5, 0.75, 1.0],
  [0.5, 0.5, 0.5],
));

renderToCanvas({
  ctx,
  width,
  height,
  cameraPosition: [5.6232, -20.7507, 8],
  cameraPitch: 90,
  cameraYaw: 15,
  cameraFOV: 60,
  objects: myObjects,
  skyShader: mySkyShader,
  maxBounces: 2,
});
