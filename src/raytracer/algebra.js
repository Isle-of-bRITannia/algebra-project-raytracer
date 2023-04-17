const Alg = {
  map: (list, func) => ({
    _tag: 'Map',
    list,
    func,
  }),
  filter: (list, func) => ({
    _tag: 'Filter',
    list,
    func,
  }),
  reduce: (list, func) => ({
    _tag: 'Reduce',
    list,
    func,
  }),
  flatten: (list) => ({
    _tag: 'Flatten',
    list,
  }),
  isNull: (value) => ({
    _tag: 'IsNull',
    value,
  }),
  ternary: (boolean, ifTrue, ifFalse) => ({
    _tag: 'Ternary',
    boolean,
    ifTrue,
    ifFalse,
  }),
  multiply: (valueA, valueB) => ({
    _tag: 'Multiply',
    valueA,
    valueB,
  }),
  add: (valueA, valueB) => ({
    _tag: 'Add',
    valueA,
    valueB,
  }),
  reciprocal: (value) => ({
    _tag: 'Reciprocal',
    value,
  }),
  sqrtPositive: (value) => ({
    _tag: 'SqrtPositive',
    value,
  }),
  plusMinus: (value) => ({
    _tag: 'PlusMinus',
    value,
  }),
  greaterThanZero: (value) => ({
    _tag: 'GreaterThanZero',
    value,
  }),
  scale: (vector, scale) => ({
    _tag: 'Scale',
    vector,
    scale,
  }),
  vectorAdd: (vectorA, vectorB) => ({
    _tag: 'VectorAdd',
    vectorA,
    vectorB,
  }),
  dotProduct: (vectorA, vectorB) => ({
    _tag: 'DotProduct',
    vectorA,
    vectorB,
  }),
  colorMultiply: (colorA, colorB) => ({
    _tag: 'ColorMultiply',
    colorA,
    colorB,
  }),
  applyTransformMatrix: (vector, matrix) => ({
    _tag: 'ApplyTransformMatrix',
    vector,
    matrix,
  }),
  checkerEvenSpace: (position, spaceSize) => ({
    _tag: 'CheckerEvenSpace',
    position,
    spaceSize,
  }),
  rotateZ: (vector, theta) => ({
    _tag: 'RotateZ',
    vector,
    theta,
  }),
  rearrangeList: (originalList, indexesFromOriginal) => ({
    _tag: 'RearrangeList',
    originalList,
    indexesFromOriginal,
  }),
  entry: (list, index) => ({
    _tag: 'Entry',
    list,
    index,
  }),
  combineShaders: (shaderA, shaderB, combiner) => ({
    _tag: 'CombineShaders',
    shaderA,
    shaderB,
    combiner,
  }),
  applyHitShader: (hit, geometries, skyShader, bouncesLeft) => ({
    _tag: 'ApplyHitShader',
    hit,
    geometries,
    skyShader,
    bouncesLeft,
  }),
};

export {
  Alg,
};