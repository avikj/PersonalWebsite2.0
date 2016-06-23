module.exports = function(a, b) {
  var result = [];
  while(a.length * b.length != 0) {
    if(a[0].score > b[0].score) {
      result.push(a.shift());
    } else {
      result.push(b.shift());
    }
  }
  return result.concat(a, b);
}