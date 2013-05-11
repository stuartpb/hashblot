//Fun, kinda angle-y. Tends to make a lot of birds.
window.hashblot = function fiveQuadraticsPath (hash){
  var pathNodes = [];
  pathNodes[0] = 'M '+parseInt(hash.slice(-4,-2),16)
    +','+parseInt(hash.slice(-2),16);
  for(var i = 1; i < hash.length / 8; i++) {
    var base = (i-1)*8;
    pathNodes[i]='Q '+parseInt(hash.slice(base,base+2),16)
      +','+parseInt(hash.slice(base+2,base+4),16)
      +' '+parseInt(hash.slice(base+4,base+6),16)
      +','+parseInt(hash.slice(base+6,base+8),16);
  }
  return pathNodes.join(' ');
}