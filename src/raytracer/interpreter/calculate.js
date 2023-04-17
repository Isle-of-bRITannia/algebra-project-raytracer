import { pipe, match, mapObject } from '../utility/index.js';

const matchFunctions = {
  Map: ({ list, func }) => {
    const calculatedList = calculate(list).map(calculate);
    return calculatedList.map(calculate(func)).map(calculate);
  },
  Filter: ({ list, func }) => calculate(list).map(calculate).filter(calculate(func)),
  Reduce: ({ list, func }) => {
    const calculatedList = calculate(list);
    return calculatedList.length !== 0 ? calculate(calculatedList.map(calculate).reduce(calculate(func))) : null;
  },
  Flatten: ({ list }) => calculate(list).map(calculate).flat(1),
  IsNull: ({ value }) => calculate(value) === null,
  Ternary: ({ boolean, ifTrue, ifFalse }) => calculate(boolean) ? calculate(ifTrue) : calculate(ifFalse),
  Multiply: ({ valueA, valueB }) => calculate(valueA) * calculate(valueB),
  Add: ({ valueA, valueB }) => calculate(valueA) + calculate(valueB),
  Reciprocal: ({ value }) => 1 / calculate(value),
  SqrtPositive: ({ value }) => Math.sqrt(calculate(value)),
  PlusMinus: ({ value }) => {
    const calculated = calculate(value);
    if (isNaN(calculated)) return [];
    return [-calculated, calculated];
  },
  GreaterThanZero: ({ value }) => calculate(value) > 0,
  Scale: ({ vector, scale }) => {
    const vectorCalc = calculate(vector);
    const scaleCalc = calculate(scale);
    return [
      vectorCalc[0] * scaleCalc,
      vectorCalc[1] * scaleCalc,
      vectorCalc[2] * scaleCalc,
    ];
  },
  VectorAdd: ({ vectorA, vectorB }) => {
    const vectorACalc = calculate(vectorA);
    const vectorBCalc = calculate(vectorB);
    return [
      vectorACalc[0] + vectorBCalc[0],
      vectorACalc[1] + vectorBCalc[1],
      vectorACalc[2] + vectorBCalc[2],
    ];
  },
  DotProduct: ({ vectorA, vectorB }) => {
    const vectorACalc = calculate(vectorA);
    const vectorBCalc = calculate(vectorB);
    return vectorACalc[0] * vectorBCalc[0] + vectorACalc[1] * vectorBCalc[1] + vectorACalc[2] * vectorBCalc[2];
  },
  ColorMultiply: ({ colorA, colorB }) => {
    const colorACalc = calculate(colorA);
    const colorBCalc = calculate(colorB);
    return [
      colorACalc[0] * colorBCalc[0],
      colorACalc[1] * colorBCalc[1],
      colorACalc[2] * colorBCalc[2],
    ];
  },
  ApplyTransformMatrix: ({ vector, matrix }) => {
    const vectorCalc = calculate(vector);
    const matrixCalc = calculate(matrix).map(calculate);
    return [
      matrixCalc[0][0] * vectorCalc[0] + matrixCalc[1][0] * vectorCalc[1] + matrixCalc[2][0] * vectorCalc[2],
      matrixCalc[0][1] * vectorCalc[0] + matrixCalc[1][1] * vectorCalc[1] + matrixCalc[2][1] * vectorCalc[2],
      matrixCalc[0][2] * vectorCalc[0] + matrixCalc[1][2] * vectorCalc[1] + matrixCalc[2][2] * vectorCalc[2],
    ];
  },
  CheckerEvenSpace: ({ position, spaceSize }) => {
    const positionCalc = calculate(position);
    const spaceSizeCalc = calculate(spaceSize);
    return Math.abs(
      Math.floor(positionCalc[0] / spaceSizeCalc) +
      Math.floor(positionCalc[1] / spaceSizeCalc)
    ) % 2 < 1;
  },
  RotateZ: ({ vector, theta }) => {
    const vectorCalculated = calculate(vector);
    const x = vectorCalculated[0];
    const y = vectorCalculated[1];
    const thetaCalculated = calculate(theta);
    const cosTheta = Math.cos(thetaCalculated);
    const sinTheta = Math.sin(thetaCalculated);
    return [
      x * cosTheta - y * sinTheta,
      x * sinTheta + y * cosTheta,
      vectorCalculated[2],
    ];
  },
  RearrangeList: ({ originalList, indexesFromOriginal }) => {
    const calculatedOriginalList = calculate(originalList).map(calculate);
    const calculatedIndexesFromOriginal = calculate(indexesFromOriginal).map(calculate);
    const calculatedIndexesFromOriginalLength = calculatedIndexesFromOriginal.length;
  
    const newList = [];
    for (let i = 0; i < calculatedIndexesFromOriginalLength; i++) {
      newList.push(calculatedOriginalList[calculatedIndexesFromOriginal[i]]);
    }
    return newList;
  },
  Entry: ({ list, index }) => calculate(list)[calculate(index)],
  CombineShaders: ({ shaderA, shaderB, combiner }) => {
    const shaderACalculated = calculate(shaderA);
    const shaderBCalculated = calculate(shaderB);
    const combinerCalculated = calculate(combiner);
    return (...params) => calculate(combinerCalculated(shaderACalculated(...params), shaderBCalculated(...params)));
  },
  ApplyHitShader: ({ hit, geometries, skyShader, bouncesLeft }) => {
    const hitCalculated = calculate(hit);
    if ( hitCalculated === null) return null;
    const calculatedColor = calculate(calculate(hitCalculated.shader)(mapObject(hitCalculated.hitInfo, calculate), calculate(geometries), calculate(skyShader), calculate(bouncesLeft)));
    return calculatedColor;
  },
};

const calculate = match(matchFunctions);

export { calculate }
