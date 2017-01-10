function replaceImport(source, j) {
  return j(source)
    .find(j.ImportDeclaration)
    .find(j.Literal, {
      value: 'object.omit'
    })
    .replaceWith(
      p => {
        return j.literal('just-omit');
      }
    )
  .toSource({quote: 'single'});
}

function replaceRequire(source, j) {
  return j(source)
    .find(j.VariableDeclaration)
    .find(j.Literal, {
      value: 'object.omit'
    })
    .replaceWith(
      p => {
        return j.literal('just-omit');
      }
    )
  .toSource({quote: 'single'});
}

export default function main(file, api) {
  const j = api.jscodeshift;
  const source = file.source;

  let newSource = replaceImport(source, j);
  newSource = replaceRequire(newSource, j);

  return newSource;
}
