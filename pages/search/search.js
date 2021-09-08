import request from '../../utils/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
      placeholderContent:'',//placeholder的内容
      searchList:[],//关键字模糊匹配的数据
      searchContent:'',//表单项数据内容
      hotList:[],//热搜榜数据
      historyList:[],//历史记录列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getinitData();
    this.getHistoryList()
  },

  // 初始化搜索框数据函数
  async getinitData(){
        let placeholderContentData =await request('/search/default');
        let hotListData = await request('/search/hot/detail');
        this.setData({
          placeholderContent:placeholderContentData.data.showKeyword,
       hotList:hotListData.data

        })
  },

  //历史记录函数
  getHistoryList(){
  let historyList=  wx.getStorageSync('searchHistory')
    if(historyList){
      this.setData({
        historyList
      })
    }
  },
  // 表单项数据绑定
  handleInputChange(event){
    console.log(event);
    // 更新searchContent的状态
          this.setData({
            searchContent:event.detail.value.trim()
          });
          // 函数节流
          if(isSend){
            return
          }
          isSend=true;
          this.getSearchList();
          setTimeout(()=>{
            isSend = false;
          },300)
  },

  // 获取搜索数据的功能函数
  async getSearchList(){
    if(!this.data.searchContent){
      this.setData({
        searchList:[]
      })
      return;
    }
    let {searchContent,historyList} = this.data
    let searchListData= await request('/search',{keywords:searchContent,limit:10})
    this.setData({
      searchList:searchListData.result.songs
    })
  //  将搜索的关键字添加到搜索历史记录中
  if(historyList.indexOf(searchContent) !== -1){
    // 当搜素关键字重复时删除原先再unshift
    historyList.splice(historyList.indexOf(searchContent),1)
  }
  historyList.unshift(searchContent);
  this.setData({
    historyList
  })
  wx.setStorageSync('searchHistory', historyList)

  },

  // 清空表单项
  clearSearchContent(){
     this.setData({
       searchContent:'',
       searchList:[]
     })
  },
// 清空历史记录

deleteSearchHistory(){
  wx.showModal({
    content: '确定删除吗？',
    success:(res)=>{
      if(!res.confim){
        // 清空data中的historyList
  this.setData({
    historyList:[]
  })
  // 移除本地的历史记录缓存
  wx.removeStorageSync('searchHistory')
      }
      
    }
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