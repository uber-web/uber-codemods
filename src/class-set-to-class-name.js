import console from 'global/console';

function getExpression(expression, wrapped = true, j) {
  const keysExpression = j(`Object.keys(xClassSet).map((key) => {
  if (xClassSet[key]) {
    classArr.push(key);
  }
});`)
    .find(j.ExpressionStatement)
    .nodes()[0];
  const returnStatement = j.returnStatement(
    j.callExpression(
      j.memberExpression(
        j.identifier('classArr'),
        j.identifier('join')
      ),
      [
        j.literal(' ')
      ]
    )
  );
  const callExpression = j.callExpression(
    j.parenthesizedExpression(
      j.arrowFunctionExpression(
        [],
        j.blockStatement([
          j.variableDeclaration(
            'const',
            [j.variableDeclarator(
              j.identifier('classArr'),
              j.arrayExpression([])
            )]
          ),
          j.variableDeclaration(
            'const',
            [j.variableDeclarator(
              j.identifier('xClassSet'),
              expression
            )]
          ),
          keysExpression,
          returnStatement
        ])
      )
    ),
    []
  );
  if (wrapped) {
    return j.expressionStatement(
      callExpression
    );
  }
  return callExpression;
}

/* eslint-disable max-statements */
function wrapInIIFE(path, j) {
  let identifier;
  switch (path.node.type) {
  case 'VariableDeclarator': {
    identifier = path.node.id;
    path.node.init = getExpression(path.node.init, true, j);
    break;
  }
  case 'MemberExpression': {
    if (path.parent.name === 'expression') {
      identifier = path.node.property;
      path.parent.node.right = getExpression(path.parent.node.right, true, j);
    }
    break;
  }
  case 'Property': {
    identifier = path.node.key;
    path.node.value = getExpression(path.node.value, false, j);
    break;
  }
  default: {
    console.error(`Unhandled type: ${path.node.type}`);
  }
  }
  if (identifier) {
    identifier.name = 'className';
  }
  return path;
}
/* eslint-enable max-statements */

function replaceClassSetWithClassName(source, j) {
  return {
    source: j(source)
      .find(j.Identifier)
      .filter(identifier => {
        return identifier.node.name === 'classSet';
      })
      .forEach(path => {
        wrapInIIFE(path.parentPath, j);
      })
      .toSource({quote: 'single'})
  };
}

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const {source} = replaceClassSetWithClassName(file.source, j);

  return j(source)
    .find(j.EmptyStatement)
    .remove()
    .toSource({quote: 'single'});
}
