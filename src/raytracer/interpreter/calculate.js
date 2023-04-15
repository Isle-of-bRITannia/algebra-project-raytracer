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
  Join: ({ list, separator }) => calculate(list).map(calculate).join(calculate(separator)),
  IsNull: ({ value }) => calculate(value) === null,
  Ternary: ({ boolean, ifTrue, ifFalse }) => calculate(boolean) ? calculate(ifTrue) : calculate(ifFalse),
  IsEven: ({ value }) => {
    const valCalculated = calculate(value);
    return Math.abs(valCalculated) % 2 < 1
  },
  Multiply: ({ valueA, valueB }) => calculate(valueA) * calculate(valueB),
  Add: ({ valueA, valueB }) => calculate(valueA) + calculate(valueB),
  Reciprocal: ({ value }) => 1 / calculate(value),
  SqrtPositive: ({ value }) => Math.sqrt(calculate(value)),
  PlusMinus: ({ value }) => {
    const calculated = calculate(value);
    if (isNaN(calculated)) return [];
    return [-calculated, calculated];
  },
  Min: ({ valueA, valueB }) => Math.min(calculate(valueA), calculate(valueB)),
  Floor: ({ value }) => Math.floor(calculate(value)),
  GreaterThan: ({ value, threshold }) => calculate(value) > calculate(threshold),
  EntryWiseCombine: ({ listA, listB, func }) => {
    const calculatedListA = calculate(listA).map(calculate);
    const calculatedListALength = calculatedListA.length;
    const calculatedListB = calculate(listB).map(calculate);
    const calculatedListBLength = calculatedListB.length;
    if (calculatedListALength !== calculatedListBLength) throw new Error(`Tried to do an entry-wise combination of one list of length ${calculatedListALength} and another of length ${calculatedListBLength}`);

    const calculatedFunc = calculate(func);
    const newList = [];
    for (let i = 0; i < calculatedListALength; i++) {
      newList.push(calculate(calculatedFunc(calculatedListA[i], calculatedListB[i])));
    }
    return newList;
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
