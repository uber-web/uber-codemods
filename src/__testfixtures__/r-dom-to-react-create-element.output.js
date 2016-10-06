import Component from './';

React.createElement('br');
React.createElement('span', {}, 'basic element');
React.createElement(Component, {}, 'basic component');
React.createElement('span', {
  className: 'class-name'
}, 'element with props');
React.createElement(Component, {
  className: 'class-name'
}, 'component with props');
React.createElement('ol', {}, [
  React.createElement('li', {}, 'Item 1'),
  React.createElement('li', {}, 'Item 2'),
  React.createElement('li', {}, 'Item 3')
]);
