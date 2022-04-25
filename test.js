let test = [[1, 0], [1, 2], [2, 0], [2, 1], [2, 2], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2], [0, 2], [1, 1], [2, 0]]
const quantity = {};

for (let point of test) {
    let key = `${point[0]}${point[1]}`
    if (key in quantity) {
        quantity[key] += 1;
    } else {
        quantity[key] = 1;
    }
}

let arr = Object.values(quantity);
let max = Math.max(...arr);

const bestPoints = test.filter(elem => quantity[`${elem[0]}${elem[1]}`] === max);
const bestPoint = bestPoints[Math.floor(bestPoints.length * Math.random())];