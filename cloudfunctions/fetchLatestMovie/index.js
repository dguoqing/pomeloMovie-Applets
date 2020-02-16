// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const { start = 0, count = 10 } = event
  return rp(`https://douban.uieee.com/v2/movie/new_movies&start=${start}&count=${count}`)
    .then( res => {
      return res
    })
    .catch(function (err) {
      console.log(err)
    });
}