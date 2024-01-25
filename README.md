Chartjs 動態圖表呈現網路品質狀態 Ping RTT
https://wastu01.github.io/Chartjs-demo

learning how to put dynmaic data into chart base on original Pingtest project.

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
