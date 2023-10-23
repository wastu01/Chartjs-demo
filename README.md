learning how to add motion graphic（real time render） base on it (Pingtest).

graphic like : 
https://playground.anychart.com/docs/samples/CRUD_01
https://www.chartjs.org/docs/latest/charts/line.html

Learning Source : 

https://ithelp.ithome.com.tw/articles/10198687
http://ccsig.blogspot.com/2019/01/chartjs.html
https://alicialin2020.medium.com/chart-js-%E8%87%AA%E5%AD%B8%E5%88%86%E4%BA%AB-243e11851a47

# pingtest

Browser-based UDP ping, using Janus Gateway. Displays ping, jitter and packet
loss. Also has a graphical meter showing connection quality, which displays
moving average statistics on mouse hover.

## Demo

https://www.groupworld.net/pingtest.html

## Installation

Configure [Janus Gateway](https://github.com/meetecho/janus-gateway), including the text-room plugin.

## Cleanup

Each time a user connects, it creates a Janus TextRoom. You can use the cleanrooms.js script to remove empty rooms:

    npm install janus-gateway-js
    node cleanrooms.js
