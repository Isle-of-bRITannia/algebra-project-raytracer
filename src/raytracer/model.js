import { Alg } from './algebra.js';
import { pipe } from './utility/index.js';

const RAY_EPSILON = 0.001;

const API = {
  // Straight from algebra, simply destructure
  ...Alg,
  // Combinations: single-variable
  nullishCoalescing: (preferred, fallback) => API.ternary(API.isNull(preferred), fallback, preferred),
  negative: (value) => API.multiply(value, -1),
  multiplyMany: (...values) => API.reduce(values, API.multiply),
  addMany: (...values) => API.reduce(values, API.add),
  square: (value) => API.multiply(value, value),
  sqrts: (value) => API.plusMinus(API.sqrtPositive(value)),
  divide: (numerator, denominator) => API.multiply(numerator, API.reciprocal(denominator)),
  subtract: (valueA, valueB) => API.add(valueA, API.negative(valueB)),
  clampAboveZero: (value) => API.ternary(
    API.greaterThanZero(value),
    value,
    0,
  ),
  degToRad: (value) => API.multiply(value, Math.PI / 180),
  // Combinations: complex single-variable formulas
  quadratic: (a, b, c) => API.map(
    API.sqrts(
      API.subtract(
        API.square(b),
        API.multiplyMany(4, a, c),
      ),
    ),
    sqrt => API.divide(
      API.subtract(sqrt, b),
      API.multiply(2, a),
    ),
  ),
  // Combinations: vectors
  rayParametric: (point, vector, t) => API.vectorAdd(point, API.scale(vector, t)),
  vectorNegative: (vector) => API.scale(vector, -1),
  vectorSubtract: (vectorA, vectorB) => API.vectorAdd(vectorA, API.vectorNegative(vectorB)),
  lengthNoSqrt: (vector) => API.dotProduct(vector, vector),
  length: (vector) => API.sqrtPositive(API.lengthNoSqrt(vector)),
  normalize: (vector) => API.scale(vector, API.reciprocal(API.length(vector))),
  projectAssumingNormalized: (toProject, onto) => API.scale(onto, API.dotProduct(toProject, onto)),
  reflectAssumingNormalized: (incoming, normal) => API.vectorAdd(incoming, API.scale(API.projectAssumingNormalized(incoming, normal), -2)),
  rotateX: (vector, theta) =>
    API.rearrangeList(
      API.rotateZ(
        API.rearrangeList(
          vector,
          [1, 2, 0],
        ),
        theta),
      [2, 0, 1],
    ),
  rotateY: (vector, theta) =>
    API.rearrangeList(
      API.rotateZ(
        API.rearrangeList(
          vector,
          [2, 0, 1],
        ),
        theta),
      [1, 2, 0],
    ),
  z: (vector) => API.entry(vector, 2),
  // Combinations: geometry
  sphere: (center, radius, shader) => (point, vector) => {
    // https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html
    const centerToPoint = API.vectorSubtract(point, center);
    return API.map(
      API.quadratic(
        API.lengthNoSqrt(vector),
        API.dotProduct(API.scale(centerToPoint, 2), vector),
        API.subtract(API.lengthNoSqrt(centerToPoint), API.square(radius)),
      ),
      (t) => {
        const position = API.rayParametric(point, vector, t);
        return {
          t,
          hitInfo: {
            position,
            normal: API.scale(API.vectorSubtract(position, center), API.reciprocal(radius)),
            incoming: vector,
          },
          shader,
        };
      },
    );
  },
  groundPlane: (groundZ, shader) => (point, vector) => {
    return API.map(
      [API.divide(API.subtract(groundZ, API.z(point)), API.z(vector))],
      (t) => {
        const position = API.rayParametric(point, vector, t);
        return {
          t,
          hitInfo: {
            position,
            normal: [0, 0, 1],
            incoming: vector,
          },
          shader,
        };
      }
    )
  },
  // Combinations: colors (for simplicity's sake these are stored just like vectors; more or less a similar idea)
  colorAdd: (colorA, colorB) => API.vectorAdd(colorA, colorB),
  colorSubtract: (colorA, colorB) => API.vectorSubtract(colorA, colorB),
  colorBrightness: (color, brightness) => API.scale(color, brightness),
  colorLerp: (colorA, colorB, t) => API.colorAdd(colorA, API.colorBrightness(API.colorSubtract(colorB, colorA), t)),
  // Combinations: shaders
  // https://www.techspot.com/article/1998-how-to-3d-rendering-lighting-shadows/
  sunLight: (sunVector, sunColor) => (hitInfo, geometries) =>
    API.colorBrightness(
      sunColor,
      API.ternary(
        pipe(API.castRay, API.isNull)(hitInfo.position, API.vectorNegative(sunVector), geometries),
        pipe(API.dotProduct, API.negative, API.clampAboveZero)(hitInfo.normal, sunVector),
        0,
      ),
    ),
  ambientLight: (color) => () => color,
  mirrorAssumingNormalized: () => (hitInfo, geometries, skyShader, bouncesLeft) =>
    API.rayColor(
      hitInfo.position,
      API.reflectAssumingNormalized(hitInfo.incoming, hitInfo.normal),
      bouncesLeft > 0 ? geometries : [],
      skyShader,
      bouncesLeft - 1,
    ),
  checkerColor: (spaceSize, colorOdd, colorEven) => (hitInfo) =>
    API.ternary(
      API.checkerEvenSpace(hitInfo.position, spaceSize),
      colorEven,
      colorOdd,
    ),
  standardSky: (sky, horizon, ground) => (hitInfo) => {
    const z = API.z(hitInfo.incoming);
    return API.ternary(
      API.greaterThanZero(z),
      API.colorLerp(horizon, sky, z),
      ground,
    )
  },
  multiplyShaders: (shaderA, shaderB) => API.combineShaders(shaderA, shaderB, API.colorMultiply),
  addShaders: (shaderA, shaderB) => API.combineShaders(shaderA, shaderB, API.colorAdd),
  multiplyManyShaders: (...shaders) => API.reduce(shaders, API.multiplyShaders),
  addManyShaders: (...shaders) => API.reduce(shaders, API.addShaders),
  // Combinations: rendering!
  castRay: (point, vector, geometries) =>
    API.reduce(
      API.filter(
        API.flatten(
          API.map(
            geometries,
            geometry => geometry(point, vector),
          ),
        ),
        hit => hit.t > RAY_EPSILON,
      ),
      (hitA, hitB) => hitA.t <= hitB.t ? hitA : hitB,
    ),
  rayColor: (point, vector, geometries, skyShader, bouncesLeft) =>
    API.applyHitShader(
      API.nullishCoalescing(
        API.castRay(point, vector, geometries),
        {
          hitInfo: {
            incoming: vector,
          },
          shader: skyShader,
        },
      ),
      geometries,
      skyShader,
      bouncesLeft,
    ),
};

export {
  API as Rt
}
