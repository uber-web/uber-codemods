import r from 'r-dom';
import Component from './';

r.br();
r.span('basic element');
r(Component, 'basic component');
r.span({
  className: 'class-name'
}, 'element with props');
r(Component, {
  className: 'class-name'
}, 'component with props');
r.ol(
  [
    r.li('Item 1'),
    r.li('Item 2'),
    r.li('Item 3')
  ]
);
