export default {
  // 语言切换
  changeLang: function (lang) {
    let cacheLang = this.getLocal("locale")
    if (lang) {
      this.setLocal("locale", lang)
    }
    return lang || cacheLang || this.browserLang()
  },
  browserLang: function () {
    let lang = (navigator.language || navigator.browserLanguage).toLowerCase();
    let str = ""
    if (lang.indexOf("en") > -1) {
      str = 'en-US'
    } else {
      str = 'zh-HK'
    }
    return str
  },
  getSession: function (name) {
    if (!name) return
    return window.sessionStorage.getItem(name)
  },
  setSession: function (name, content) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.sessionStorage.setItem(name, content)
  },
  removeSession: function (name) {
    if (!name) return
    window.sessionStorage.removeItem(name)
  },
  getLocal: function (name) {
    if (!name) return
    return window.sessionStorage.getItem(name)
  },
  setLocal: function (name, content) {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.sessionStorage.setItem(name, content)
  },
  removeLocal: function (name) {
    if (!name) return
    window.sessionStorage.removeItem(name)
  }
}
