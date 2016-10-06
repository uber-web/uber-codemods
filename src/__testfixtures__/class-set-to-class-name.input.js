const isComplete = false;
const isActive = true;
const isFirst = true;
const classSet = {
  'side-nav__item': true,
  'side-nav__item--complete': isComplete || isActive,
  first: isFirst,
  'side-nav__item--incomplete': !isComplete && !isActive,
  'side-nav__item--active': isActive
};

const props = {};
props.classSet = {
  'side-nav__item': true,
  'side-nav__item--complete': isComplete || isActive,
  first: isFirst,
  'side-nav__item--incomplete': !isComplete && !isActive,
  'side-nav__item--active': isActive
};

const props2 = {
  classSet: {
    'side-nav__item': true,
    'side-nav__item--complete': isComplete || isActive,
    first: isFirst,
    'side-nav__item--incomplete': !isComplete && !isActive,
    'side-nav__item--active': isActive
  }
};

const props3 = {};
props.classSet = extend(this.props.classSet, {
  breadcrumb: true
});
