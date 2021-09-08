/**
 * 登录步骤：
 * 1.收集表单项数据
 * 2.前端验证
 *    1）验证用户信息（账号，密码）是否合法
 *    2）前端验证不通过就提示用户，不需要发请求给后端
 *    3）前端验证通过，发请求（携带账号密码）给服务器端
 * 3.后端验证
 *    1）验证用户是否存在
 *    2）用户不存在直接返回，告诉前端用户不存在
 *    3）用户存在需要校验密码是否正确
 *    4）密码不正确返回给前端提示密码不正确
 *    5）密码正确返回个前端数据，提示用户登录成功，（携带用户信息）
 */

 import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
       phone:'',
       password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 表单项内容发生改变的回调
  handleInput(event){
    // 方法一：id传参
    // let type = event.currentTarget.id;//取值 phone || password

    // 方法二：data-key=value
    let type=event.currentTarget.dataset.type;
    this.setData({
      [type]:event.detail.value
    })
  },
  /**
   * 前端验证：
   *  1.手机号不能为空
   *  2.密码格式正确
   *  3.手机号格式正确，验证通过
   */
  // 登陆的回调
  async login(){
    let { phone,password} = this.data;
    if(!phone ){
      wx.showToast({
        title: '手机号不能为空',
        icon:'none'
      })
      return;
      
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon:'none'
      })
      return ;
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'none'
      })
      return;
    }
    wx.showToast({
      title: '前端验证通过',
    })

    // 后端验证  ?phone=15711140593&password=123456yzy
    let result = await request('/login/cellphone',{phone,password,isLogin:true})
    if(result.code===200){
      wx.showToast({
        title: '登陆成功',
      })
      // 将用户信息存储至本地
   wx.setStorageSync('userInfo', JSON.stringify(result.profile))

      //跳转至个人中心personal页面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if(result.code===400){
      wx.showToast({
        title: '手机号错误',
        icon:'none'
      })
    }else if(result.code===502){
      wx.showToast({
        title: '密码错误',
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '登陆失败，请重新登陆',
        icon:'none'
      })
    }
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