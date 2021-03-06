import WxRequest from '../assets/plugins/wx-request/lib/index'

class HttpService extends WxRequest {
  constructor(options) {
    super(options)
    this.$$prefix = ''
    this.$$path = {
      wechatSignUp: '/user/wechat/sign/up',
      wechatSignIn: '/user/wechat/sign/in',
      profileUpdate: '/user/info',
      decryptData: '/user/wechat/decrypt/data',
      signIn: '/user/sign/in',
      signOut: '/user/sign/out',
      userInfo: '/user/info',
      banner: '/banner',
      classify: '/classify',
      goods: '/goods',
      search: '/goods/search/all',
      cart: '/cart',
      address: '/address',
      order: '/order',
      questions: '/questions',
      matchStart: '/match/start',
      matchGenerate: '/match/generate',
      matchSubmit: '/match/submit',
      matchScore: '/match/score',
      matchDetail: '/match/detail',
      studyDetail: '/study',

      rank: "/user/rank/demo",
      pintu: "/pintu/demo"
    }
    this.interceptors.use({
      request(request) {
        request.header = request.header || {}
        request.header['content-type'] = 'application/json'
        if (request.url.indexOf('/api') !== -1 && wx.getStorageSync('token')) {
          request.header.Authorization = 'Bearer ' + wx.getStorageSync('token')
        }
        wx.showLoading({
          title: '加载中',
        })
        return request
      },
      requestError(requestError) {
        wx.hideLoading()
        return Promise.reject(requestError)
      },
      response(response) {
        wx.hideLoading()
        console.log("response.data", response.data)
        if (response.statusCode === 401 || response.data && response.data && response.data.meta && response.data.meta.code === 401) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index'
          })
        }
        return response
      },
      responseError(responseError) {
        wx.hideLoading()
        console.log(responseError)
        if (responseError.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/index'
          })
        }
        return Promise.reject(responseError)
      },
    })
  }

  wechatSignUp(params) {
    /** 注册 **/
    //查询推荐信息
    return this.postRequest(this.$$path.wechatSignUp, {
      data: params,
    })
  }

  wechatSignIn(params) {
    return this.postRequest(this.$$path.wechatSignIn, {
      data: params,
    })
  }

  wechatDecryptData(params) {
    return this.postRequest(this.$$path.decryptData, {
      data: params,
    })
  }

  profileUpdate(params) {
    return this.postRequest(this.$$path.profileUpdate, {
      data: params,
    })
  }

  signIn(params) {
    return this.postRequest(this.$$path.signIn, {
      data: params,
    })
  }

  signOut() {
    return this.postRequest(this.$$path.signOut)
  }

  userInfo() {
    return this.getRequest(this.$$path.userInfo)
  }

  matchStart(typeId) {
    console.log("typeId", typeId, typeId == undefined)
    if (typeId) {
      return this.getRequest(`${this.$$path.matchStart}?tid=${typeId}`)
    } else {
      return this.getRequest(this.$$path.matchStart)
    }
  }

  matchGenerate() {
    return this.getRequest(this.$$path.matchGenerate)
  }

  matchSubmit(params) {
    return this.postRequest(this.$$path.matchSubmit, {
      data: params
    })
  }

  matchScore(params) {
    return this.postRequest(this.$$path.matchScore, {
      data: params
    })
  }

  matchDetail(id) {
    return this.getRequest(`${this.$$path.matchDetail}/${id}`)
  }
  getStudyDetail(id) {
    return this.getRequest(`${this.$$path.studyDetail}/${id}`)
  }

  getRank() {
    return this.getRequest(this.$$path.rank)
  }

  getPintuIndex() {
    return this.getRequest(this.$$path.pintu)
  }

  getPintuDetail(id) {
    return this.getRequest(`${this.$$path.pintu}/${id}`)
  }

  getBanners(params) {
    return this.getRequest(this.$$path.banner, {
      data: params,
    })
  }

  search(params) {
    return this.getRequest(this.$$path.search, {
      data: params,
    })
  }

  getGoods(params) {
    return this.getRequest(this.$$path.goods, {
      data: params,
    })
  }

  getClassify(params) {
    return this.getRequest(this.$$path.classify, {
      data: params,
    })
  }

  getDetail(id) {
    return this.getRequest(`${this.$$path.goods}/${id}`)
  }

  getCartByUser() {
    return this.getRequest(this.$$path.cart)
  }

  addCartByUser(goods) {
    return this.postRequest(this.$$path.cart, {
      data: {
        goods,
      },
    })
  }

  putCartByUser(id, params) {
    return this.putRequest(`${this.$$path.cart}/${id}`, {
      data: params,
    })
  }

  delCartByUser(id) {
    return this.deleteRequest(`${this.$$path.cart}/${id}`)
  }

  clearCartByUser() {
    return this.postRequest(`${this.$$path.cart}/clear`)
  }

  getAddressList(params) {
    return this.getRequest(this.$$path.address, {
      data: params,
    })
  }

  getAddressDetail(id) {
    return this.getRequest(`${this.$$path.address}/${id}`)
  }

  postAddress(params) {
    return this.postRequest(this.$$path.address, params)
  }

  putAddress(id, params) {
    return this.putRequest(`${this.$$path.address}/${id}`, {
      data: params,
    })
  }

  deleteAddress(id, params) {
    return this.deleteRequest(`${this.$$path.address}/${id}`)
  }

  getDefalutAddress() {
    return this.getRequest(`${this.$$path.address}/default`)
  }

  setDefalutAddress(id) {
    return this.postRequest(`${this.$$path.address}/default/${id}`)
  }

  getOrderList(params) {
    return this.getRequest(this.$$path.order, {
      data: params,
    })
  }

  getOrderDetail(id) {
    return this.getRequest(`${this.$$path.order}/${id}`)
  }

  postOrder(params) {
    return this.postRequest(this.$$path.order, {
      data: params,
    })
  }

  putOrder(id, params) {
    return this.putRequest(`${this.$$path.order}/${id}`, {
      data: params,
    })
  }

  deleteOrder(id, params) {
    return this.deleteRequest(`${this.$$path.order}/${id}`)
  }
}

export default HttpService