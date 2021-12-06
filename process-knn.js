const KNN = require('ml-knn');
const fs = require('fs');

let knn;

async function run()

{

const csvFilePath = 'exdataset2.csv';
const data = fs.readFileSync(csvFilePath).toString().split("\n").slice(1).map(l=>l.trim()).map(l=>l.split(",").slice(0,-1).map(parseFloat));
const labels = fs.readFileSync(csvFilePath).toString().split("\n").slice(1).map(l=>l.trim()).map(l=>l.split(",").slice(-1));
labels1d = [].concat(...labels);

// console.log(data);
// console.log(labels1d);

knn = new KNN(data, labels1d, {k:1});

//Person 53
test = [[82,71,124,72,132,72,75,66,147,125,118,103,66,115,155,156,80,117,61,120,93,131,112,88,86,82,96,65,158,98,64,132,91,118,102,151,159,97,109,70,66,128,153,60,92,62,102,101,79,141,79,93,74,135]];
//Random Person
test_fake = [[110,76,127,101,129,104,117,152,77,148,138,68,144,154,92,148,123,144,160,92,81,117,126,67,153,87,111,91,111,153,83,110,115,121,99,75,89,62,145,104,106,141,133,93,73,160,103,138,134,115,124,156,149,148]];
//Slightly shifted from Person 53
test_shift = [[92,71,104,72,132,72,75,66,147,125,118,103,69,115,155,156,80,117,61,125,93,131,112,88,86,82,96,65,158,98,64,152,91,118,102,151,159,97,109,70,66,128,153,60,92,62,102,101,79,141,79,93,74,135]];
//Random shifted from Person 53
test_random = test;

min=0;
max=25;

//test_random[0].forEach(function(part, index) {
//    test_random[index]=test_random[index];
//})

test_random[0]=test_random[0].map(l=>l+Math.floor(Math.random()*(max-min)+min));

//console.log(test_random);

var ans = knn.predict(test_random);
console.log("Classification result:");
console.log(ans);
}
run();