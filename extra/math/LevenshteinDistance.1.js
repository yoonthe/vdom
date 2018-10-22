/**
 * 
 * @param {String} source 
 * @param {String} target 
 */
const LevenshteinDistance = (source, target) => {
	const matrix = [];	
  let n = source.length;
  let m = target.length;
  
  if (n === 0)  return m;
  
  if (m === 0) return n;
  //初始化矩阵
  for (let i = 0; i <= n; i++) {
    matrix[i] = [i];
  }

  for (let j = 1; j <= m; j++) { //初始化第一行
    matrix[0][j] = j;
  }
  let temp;
  for (let i = 1; i <= n; i++) { //遍历source
    const ch1 = source[i - 1];
    //匹配target
    for (let j = 1; j <= m; j++) {
      const ch2 = target[j - 1];
      if (ch1 === ch2) temp = 0;
      else temp = 1;
      //左+1,上+1,左上+temp 取最小
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + temp);
    }
  }
  return matrix;
};
// console.log('last', LevenshteinDistance('abc','adc'));
const log = (solve, source, target) => {
  const result = solve(source, target);
  console.log('#\t',' \t', ...(Object.assign([], target).map(t => `${t}\t`)));
  for (let i = 0; i <= source.length; i++) {
    console.log(`${source[i - 1] || ' '}\t`, ...(result[i].map(t => `${t}\t`)));
  }
}
log(LevenshteinDistance,'LevenshteinDistance','LevenshtDistance');
