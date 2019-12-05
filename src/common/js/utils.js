import Dayjs from 'dayjs';

Dayjs.install = (Vue, options = {}) => {
  Vue.prototype.$dayjs = Dayjs;
};

// 流式布局分步加载器
function seperateLoader(loadsArray) {
  function* innerGenerator(arr) {
    for (let i = 0, item; item = arr[i++];) {
      if (typeof item === 'function') yield item();
      else yield item;
    }
  };
  let fetching = false;
  const genList = innerGenerator(loadsArray);
  return function () {
    if (fetching) return;
    fetching = true;
    try {
      let result = genList.next().value;
      !result instanceof Promise && (result = Promise.resolve(result));
      result.finally(() => fetching = false);
    } catch (error) {
      fetching = false;
    }
  };
}

export {
  Dayjs,
  seperateLoader
};
