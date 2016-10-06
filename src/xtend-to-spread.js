function removeImport(source, j) {
  let extendIdentifier;
  return {
    source: j(source)
      .find(j.ImportDeclaration)
      .filter(importDeclaration => {
        return importDeclaration.value.source.rawValue === 'xtend';
      })
      .filter(importDeclaration => {
        extendIdentifier = importDeclaration.value.specifiers[0].local.name;
        return true;
      })
      .remove()
      .toSource({quote: 'single'}),
    extendIdentifier
  };
}

function convertToSpread(callExpression, j) {
  const returnArr = [];
  callExpression.value.arguments
    .filter(argument => {
      if (argument.type === 'ObjectExpression' && argument.properties.length === 0) {
        return false;
      }
      return true;
    })
    .map(argument => {
      if (argument.type === 'ObjectExpression') {
        argument.properties.map((property, i) => {
          const returnProperty = property;
          if (i === 0 && argument.leadingComments) {
            returnProperty.comments = argument.leadingComments;
            returnProperty.leadingComments = argument.leadingComments;
          }
          returnArr.push(returnProperty);
        });
      } else {
        let leadingComments;
        if (argument.leadingComments) {
          leadingComments = argument.leadingComments;
          delete argument.leadingComments;
          delete argument.comments;
        }
        const spreadArgument = j.spreadProperty(argument);
        if (leadingComments) {
          spreadArgument.leadingComments = leadingComments;
          spreadArgument.comments = leadingComments;
        }
        returnArr.push(spreadArgument);
      }
    });
  return returnArr;
}

function transformUsage(source, extendIdentifier, j) {
  return j(source)
    .find(j.CallExpression)
    .filter(callExpression => {
      return extendIdentifier && callExpression.node.callee.name === extendIdentifier;
    })
    .map(callExpression => {
      return callExpression.replace(j.objectExpression(convertToSpread(callExpression, j)));
    }).toSource({quote: 'single'});
}

function transformer(file, api) {
  const shifted = removeImport(file.source, api.jscodeshift);
  return transformUsage(shifted.source, shifted.extendIdentifier, api.jscodeshift);
}

export default transformer;
