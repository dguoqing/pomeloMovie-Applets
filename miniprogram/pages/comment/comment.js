// pages/comment/comment.js
import moment from 'moment'
moment.locale('zh-cn');
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail:{},
    movieid:'',
    score:0,
    content:'',
    imagesPaths:[],
    fileIDs:[],
    radio:'1',
    assessList:[],//评价,
    _user:{}
  },
  fetchDetail({ movieid }){
    wx.cloud.callFunction({
      name: 'fetchMovieDetail',
      data: {
        movieid
      }
    }).then((res => {
      this.setData({
        movieDetail: JSON.parse(res.result)
      })
      console.log(JSON.parse(res.result))
    }))
      .catch(err => console.error(err))
  },
  // score
  scoreChange({detail}){
    this.setData({
      score:detail
    })
  },
  onContentChange({ detail}){
    this.setData({
      content: detail
    })
  },

  uploadImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          imagesPaths: this.data.imagesPaths.concat(tempFilePaths)
        })
      }
    })
  },
  submit(){
    const { content, score,imagesPaths, movieid,fileIDs,_user } = this.data;
    wx.showLoading({
      title: '评论中',
    })
    const promises = imagesPaths.map(v => {
      let suffix = /\.\w+$/.exec(v); // 正则表达式，返回文件扩展名
      return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: v, // 文件路径
        }).then(res => {
          console.log(res.fileID)
          this.setData({
            fileIDs:this.data.fileIDs.concat(res.fileID)
          })
          resolve()
        }).catch(error => {
          reject()
          console.log(err)
        })
      })
    })
    Promise.all(promises).then(res => {
      db.collection('comment').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          content,
          score,
          movieId:movieid,
          fileIDs:this.data.fileIDs,
          due: moment(),
          dueStr: moment().format('YYYY-MM-DD HH:mm:ss'),
          ..._user
        }
      })
        .then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '评价成功',
          })
          this.setData({
            content:'',
            score:0,
            imagesPaths: [],
            fileIDs: [],
          })
          this.getAssessList({ movieId: movieid})
          console.log(res)
        })
        .catch(err => {
          console.log(err)
          wx.hideLoading()
          wx.showToast({
            title: '评价失败',
          })
        })
    })

  },
  //筛选按钮
  filterBtn(event){
    console.log(event)
  },
  getUserStorage(){
    wx.getStorage({
      key: 'user',
      success: (_user) => {
        console.log(JSON.parse(_user.data))
        this.setData({
          _user:JSON.parse(_user.data)
        })
      },
    })
  },
  //获取评价
  getAssessList(obj = {}){
    db.collection('comment').where(obj).get().then(res => {     
      if (res.errMsg == 'collection.get:ok'){
        console.log(res.data)
        this.setData({
          assessList: res.data,
        })
      }else{
        console.error(res.errMsg)
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchDetail(options)
    this.setData(options)
    console.log(options)
    this.getUserStorage()
    this.getAssessList({
      movieId: options.movieid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})