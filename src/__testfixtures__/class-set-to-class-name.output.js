const isComplete = false;
const isActive = true;
const isFirst = true;
const className = (() => {
  const classArr = [];

  const xClassSet = {
    'side-nav__item': true,
    'side-nav__item--complete': isComplete || isActive,
    first: isFirst,
    'side-nav__item--incomplete': !isComplete && !isActive,
    'side-nav__item--active': isActive
  };

  Object.keys(xClassSet).map((key) => {
    if (xClassSet[key]) {
      classArr.push(key);
    }
  });
  return classArr.join(' ');
})();

const props = {};
props.className = (() => {
  const classArr = [];

  const xClassSet = {
    'side-nav__item': true,
    'side-nav__item--complete': isComplete || isActive,
    first: isFirst,
    'side-nav__item--incomplete': !isComplete && !isActive,
    'side-nav__item--active': isActive
  };

  Object.keys(xClassSet).map((key) => {
    if (xClassSet[key]) {
      classArr.push(key);
    }
  });
  return classArr.join(' ');
})();

const props2 = {
  className: (() => {
    const classArr = [];

    const xClassSet = {
      'side-nav__item': true,
      'side-nav__item--complete': isComplete || isActive,
      first: isFirst,
      'side-nav__item--incomplete': !isComplete && !isActive,
      'side-nav__item--active': isActive
    };

    Object.keys(xClassSet).map((key) => {
      if (xClassSet[key]) {
        classArr.push(key);
      }
    });
    return classArr.join(' ');
  })()
};

const props3 = {};
props.className = (() => {
  const classArr = [];

  const xClassSet = extend(this.props.classSet, {
    breadcrumb: true
  });

  Object.keys(xClassSet).map((key) => {
    if (xClassSet[key]) {
      classArr.push(key);
    }
  });
  return classArr.join(' ');
})();
