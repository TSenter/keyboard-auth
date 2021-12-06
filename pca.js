const { PCA } = require('ml-pca');
const dataset = require('ml-dataset-iris').getNumbers();
const csv = require('csvtojson');
const fs = require('fs');
async function run()

{

const csvFilePath = 'exdataset2.csv';
//const csvFromFile = await csv().fromFile(csvFilePath);
const data = fs.readFileSync(csvFilePath).toString().split("\n").slice(1).map(l=>l.trim()).map(l=>l.split(",").slice(0,-1).map(parseFloat));
//console.log(data);


// dataset is a two-dimensional array where rows represent the samples and columns the features
const pca = new PCA(data);
console.log(pca.getExplainedVariance());

const newPoints = [[85,72,125,139,155,92,88,87,86,160,102,111,110,108,117,104,152,102,63,141,102,149,101,83,79,80,153,137,64,84,155,65,140,150,110,137,151,64,129,150,155,95,75,76,139,106,85,117,111,120,94,141,106,128]];
/*
[ 0.9246187232017269,
  0.05306648311706785,
  0.017102609807929704,
  0.005212183873275558 ]
*/
// const newPoints = [
//   [4.9, 3.2, 1.2, 0.4],
//   [5.4, 3.3, 1.4, 0.9],
// ];
console.log(pca.predict(newPoints)); // project new points into the PCA space
/*
[
  [ -2.830722471866897,
    0.01139060953209596,
    0.0030369648815961603,
    -0.2817812120420965 ],
  [ -2.308002707614927,
    -0.3175048770719249,
    0.059976053412802766,
    -0.688413413360567 ]]
*/
  }
  run();