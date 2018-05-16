function sortName(arr, key) {
  return arr.sort(
    function compareFunction(param1, param2) {
      return param1[key].localeCompare(param2[key],"zh");
    }
  )
};
module.exports = sortName;
