//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
      this.login()
    }

    this.globalData = {}
    this.getUserInfo()
    this.getOpenid()
    
  },
  //获取用户详情
  getUserInfo(){
    return new Promise((resolve,reject) => {
      wx.getUserInfo({
        success: res => resolve(res)
      })
    })
  },
  //获取用户openid
  getOpenid(){
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login'
      }).then(res => resolve(res))
    })
  },
  async getUser(){
    let { userInfo, signature, cloudID,} = await this.getUserInfo()
    let { result: { appid, openid}} = await this.getOpenid()

    return {
      ...userInfo,
      signature, 
      cloudID, 
      appid, 
      openid,
    }
  },
  login(){
    wx.login({
      success: async (res) => {
        if (res.code) {
          //发起网络请求
          const user = await this.getUser()
          wx.setStorage({
            key: 'user',
            data: JSON.stringify(user),
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
})
