export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
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
