const waze = require('waze-traffic');
 
waze.getTraffic({
    top: '-6.89206',
    right: '107.64529',
    bottom: '-6.89883',
    left: '107.63186',
}).then(info => {
    console.log(info);
});