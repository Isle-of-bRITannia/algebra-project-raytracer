const match = (matchFunctions) => (operation) => {
  if (operation._tag === undefined) {
    return operation;
  } else {
    if (operation._tag in matchFunctions === false) {
      throw new Error(`No matching function provided for _tag === "${operation._tag}"`);
    }
    return matchFunctions[operation._tag](operation);
  }
};

export { match };
