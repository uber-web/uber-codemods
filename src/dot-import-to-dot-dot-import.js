export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ImportDeclaration)
    .map(path => {
      path.node.source.value = path.node.source.value.replace(/^\.\//g, '../');
      return path;
    })
    .toSource({quote: 'single'});
}
