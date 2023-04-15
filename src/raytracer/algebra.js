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
  join: (list, separator) => ({
    _tag: 'Join',
    list,
    separator,
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
  isEven: (value) => ({
    _tag: 'IsEven',
    value,
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
  min: (valueA, valueB) => ({
    _tag: 'Min',
    valueA,
    valueB,
  }),
  floor: (value) => ({
    _tag: 'Floor',
    value,
  }),
  greaterThan: (value, threshold) => ({
    _tag: 'GreaterThan',
    value,
    threshold,
  }),
  entryWiseCombine: (listA, listB, func) => ({
    _tag: 'EntryWiseCombine',
    listA,
    listB,
    func,
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