const dateObject = new Date() //Tue Jan 23 2024 14:02:07 GMT+0800 (台北標準時間)

const seconds = dateObject.getSeconds(); //幾秒
const date = dateObject.getDate(); //幾日
const day = dateObject.getDay(); //星期幾
const month = dateObject.getMonth(); //幾月
const year = dateObject.getFullYear(); //幾年


const monthNamesZh = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
]
const dayNamesZh = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

//console.log(seconds);

//console.log(dayNamesZh[day]);
//console.log(dateObject);
//console.log(date);
//console.log(monthNamesZh[month]);
//console.log(year);


const timeInMs1 = +new Date()

//console.log(timeInMs1); //某個特殊時間


function getCurrentSeconds() {
    const dateObject = new Date();
    return dateObject.getSeconds().toString();
    console.log(dateObject.getSeconds());
  }



