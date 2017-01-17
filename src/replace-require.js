function replaceImport(source, j, opts) {
  return j(source)
    .find(j.ImportDeclaration)
    .find(j.Literal, {
      value: opts.toReplace
    })
    .replaceWith(
      p => {
        return j.literal(opts.replaceWith);
      }
    )
  .toSource({quote: 'single'});
}

function replaceRequire(source, j, opts) {
  return j(source)
    .find(j.VariableDeclaration)
    .find(j.Literal, {
      value: opts.toReplace
    })
    .replaceWith(
      p => {
        return j.literal(opts.replaceWith);
      }
    )
  .toSource({quote: 'single'});
}

export default function transform(file, api, opts) {
  const j = api.jscodeshift;
  const source = file.source;

  let newSource = replaceImport(source, j, opts);
  newSource = replaceRequire(newSource, j, opts);

  return newSource;
}
