const tapa = [1, 2];
const tapb = [10, 20];

const data = [];
tapa.forEach((a) => {
  tapb.forEach((b) => {
    data.push([a, b]);
  });
});

console.log(data);
