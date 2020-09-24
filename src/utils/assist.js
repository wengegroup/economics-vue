import {
  isNumber
} from 'util';
import CryptoJS from 'crypto-js';
import axios from "@/api";

import Vue from 'vue'
import i18n from '@/i18n'
import {
  router,
  createRouter,
  constantRoutes
} from "@/router";

const vueInstence = new Vue({
  i18n
})

export const oneOf = function (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

export const dateFormat = function (date, fmt = 'yyyy-MM-dd') {
  if (null == date || undefined == date) {
    return '';
  }
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'S': date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
          (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
  }
  return fmt
}

export const fetchApi = function (callback, params, that, pageRoute) {
  return new Promise((resolve, reject) => {
    callback(params).then(res => {
      that.loading = false
      that.modalIsDisabled = false
      if (res) {
        if ((res.code >= 200 && res.code < 300) || res.code === 0 || res.access_token || res.size || res.byteLength) {
          if (res.code == 204) {
            if (pageRoute) {
              that.$router.push(pageRoute);
            } else {
              that.$Message.destroy()
              that.$Message.warning(res.message ? res.message : vueInstence.$t('validateWarning.getEmpty'))
            }
          }
          resolve(res)
        } else {
          resolve(null)
          let msg = res.message ? res.message : res.msg
          that.$Message.destroy()
          that.$Message.error(msg)
        }
      }
    }).catch(err => {
      // that.$Message.warning(err)
    })
  })
}
export const successModal = function (title, routeName, that, msg) {
  let messag = msg ? msg : '保存成功，点击ok返回列表'
  that.$Modal.success({
    title: title,
    content: '<p>' + messag + '</p>',
    okText: 'OK',
    onOk: () => {
      that.$router.replace({
        name: routeName
      })
    }
  });
}
export const conformModal = function (that) {
  return new Promise((resolve, reject) => {
    that.$Modal.confirm({
      title: that.$t('validateWarning.warnning'),
      content: that.$t('validateWarning.delectWarnning'),
      okText: that.$t('confirm'),
      cancelText: that.$t('cancel'),
      onOk: () => {
        resolve('ok')
      }

    })

  })
}
export const flatten = function (arr) {
  return [].concat(...arr.map(x => Array.isArray(x) ? flatten(x) : x))
}
export const removeNull = function (arr) {
  return arr.filter(ele => {
    return ele
  })
}

export const removePolicySession = function (name, sessionName) {

  if (name) {
    if (name != 'policy_list' && name != 'policy_datails') {
      removeSession(sessionName)

    }
  }
}


const mapDate = function (data) {
  let flag = false
  let list = data.map(ele => {
    if (ele instanceof Date) {
      flag = true
      return dateFormat(ele, 'yyyy-MM-dd')
    } else {
      return ele
    }
  })
  if (flag) {
    return list.join()
  } else {
    return list
  }
}

export const dateTransfer = function (list) {

  for (let key in list) {
    if (typeof list[key] === 'object') {
      if (Object.prototype.toString.call(list[key]) === '[object Array]') {
        list[key] = mapDate(list[key]);
      }
      if (list[key] instanceof Date) {
        list[key] = dateFormat(list[key], 'yyyy-MM-dd');
      }
    }
  }
  return list
}

export const validateAccount = function (rule, value, callback) {
  let reg = /^[\da-zA-Z_]+$/
  let val = value.replace(/\s+/g, ''); //去除空格
  if (reg.test(val)) {
    callback();
  } else {
    callback(new Error(vueInstence.$t('validateWarning.accountValidate')));
  }

}
export const validatePwd = function (rule, value, callback) {
  var reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,}$/
  let val = value.replace(/\s+/g, ''); //去除空格
  if (val.length < 8 || val.length > 15) {
    callback(new Error(vueInstence.$t('validateWarning.pwdneedLength')));
  } else if (!reg.test(val)) {
    callback(new Error(vueInstence.$t('validateWarning.passwordWarning')));
  } else {
    callback();
  }
}

export const $tt = function (name) {
  return vueInstence.$t(name)
}

export const isNumberRule = function (rule, value, callback) {
  let val = Number(value)
  if (isNumber(val) && !isNaN(val)) {
    callback();
  } else {
    callback(new Error(vueInstence.$t('validateWarning.numberWarning')));
  }
}

export const onlyNumber = function (rule, value, callback) {
  if (value) {
    let val = Number(value)
    if (isNumber(val) && !isNaN(val)) {
      callback();
    } else {
      callback(new Error(vueInstence.$t('validateWarning.onlyNumber')));
    }
  } else {
    callback();
  }

}

export const isChineseChar = function (rule, value, callback) {
  var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/g;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error(vueInstence.$t('validateWarning.isChineseWarning')));
  }
}

export const isEnNumber = function (rule, value, callback) {
  var reg = /^[a-zA-Z0-9\s]+$/;
  if (value) {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error(vueInstence.$t('validateWarning.isEnWarning')));
    }
  } else {
    callback();
  }

}

export const policyNoFormat = function (rule, value, callback) {
  if (value) {
    let reg = /^TPLHK.*008$/
    if (reg.test(value)) {
      callback();
    } else {
      // vueInstence.$t('validateWarning.formatWarning')
      callback(new Error(vueInstence.$t('validateWarning.policyNoFormatWarning')));
    }
  } else {
    callback();
  }

}

export const startDateLessEnd = function (that, compare, warning) {
  return function (rule, value, callback) {
    if (value) {
      callback();
    } else {
      // if (that.checkForm[compare] instanceof Date) {
      //   callback(new Error(that.$t('validateWarning.' + warning + 'Warnning')));
      // } else {
      //   callback();
      // }
    }
  }
}

export const checkEndDate = function (that, compare, warning) {
  return function (rule, value, callback) {
    if (value) {
      callback();
    } else {
      if (that.checkForm[compare] instanceof Date) {
        callback(new Error(that.$t('validateWarning.' + warning + 'Warnning')));
      } else {
        callback();
      }
    }
  }
}

export const base64 = {
  encode: function (value) {
    return window.btoa(value)
  },
  decode: function (base64Code) {
    return window.atob(base64Code)
  }
}

const keyM = CryptoJS.enc.Latin1.parse('tplhktplhktplhk8');
export const Crypto = {
  encrypt: function (word) {
    let encrypted = CryptoJS.AES.encrypt(
      word,
      keyM, {
        iv: keyM,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      }
    )
    return encrypted.toString()
  },
  // aes解密
  decrypt: function (word) {
    var decrypt = CryptoJS.AES.decrypt(word, keyM, {
      iv: keyM,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()

  }
}


const isJsonString = function (str) {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {}
  return false
}
export const setSession = function (name, value) {
  let val = value
  if (typeof val === 'object') {
    val = JSON.stringify(value)
  }
  window.sessionStorage.setItem(name, val)
}

export const getSession = function (name) {
  let val = window.sessionStorage.getItem(name)
  if (isJsonString(val)) {
    val = JSON.parse(val)
  }
  return val
}

export const removeSession = function (name) {
  window.sessionStorage.removeItem(name)
}


export const jsonDeepCopy = function (data) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * tree 数据转换
 * @param  {Array} tree 待转换的 tree
 * @param  {Object} map  键值对映射
 * @return {Array}      转换后的 tree
 */
export const convertTree = function (tree, map, flag = 'tree') {
  const result = []

  // 遍历 tree
  tree.forEach((item) => {
    // 读取 map 的键值映射
    if (flag === 'tree') {
      const value = item[map.value]
      const title = item[map.title]
      let children = item[map.children]

      // 如果有子节点，递归
      if (children) {
        children = convertTree(children, map)
      }

      result.push({
        value,
        title,
        children
      })
    }
    if (flag === 'transfer') {
      const key = item[map.key]
      const label = item[map.label]
      let children = item[map.children]

      // 如果有子节点，递归
      if (children) {
        children = convertTree(children, map, 'transfer')
      }

      result.push({
        key,
        label,
        children
      })
    }

    if (flag === 'cascader') {
      const value = item[map.value] + ''
      const label = item[map.label]
      let children = item[map.children]

      // 如果有子节点，递归
      if (children) {
        children = convertTree(children, map, 'cascader')
      }

      result.push({
        value,
        label,
        children
      })
    }

  })

  return result
}

/**
 * 获取数组中指定的值
 * @param  {Array} tree 原数据
 * @param  {Array} target  需要选择的节点id数组
 * @return {Array}    取出的值
 */
export const setTeeSelect = function (tree, target) {
  const result = []
  tree.forEach(ele => {
    const value = ele.value
    const title = ele.title
    let children = ele.children
    const checked = target.includes(ele.value) ? true : false
    if (ele.children) {
      children = setTeeSelect(children, target)
    }
    result.push({
      value,
      title,
      checked,
      children
    })
  })
  return result
}



/**
 * 获取数组中指定的值
 * @param  {Array} data 原数据
 * @param  {String} key  需要取的key
 * @return {Array}    取出的值
 */
export const getTargetData = function (data, key) {
  return data.map(ele => {
    return ele[key]
  })
}

/**
 * 获取数组中指定的值
 * @param  {Array} data 原数据
 * @param  {String} key  需要做对比的key
 * @param  {String} value  需要做对比的值
 * @return {Number}  找到的索引,没有找到返回-1
 */
export const findIndex = function (data, key, value) {
  let i = -1
  data.forEach((ele, index) => {
    if (ele[key] === value) {
      i = index
    }
  })

  return i
}

/**
 * 获取数组中指定的值
 * @param  {String} data 文件流
 * @param  {String} fileName  文件名
 */
export const downloadFile = function (data, fileName) {
  let url = window.URL.createObjectURL(new Blob([data]));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 数字三为加逗号
 * @param  {Number} num 
 */
export const toThousands = function (num) {
  let result = '',
    counter = 0;
  if (num == null || num == 0) {
    return num
  }
  let number = num ? (+num).toFixed(2) : num
  var dot = String(number).indexOf('.');
  if (dot != -1) {
    // 获取小数点后面的数字(indexOf和substring都不支持数字，所以要先转字符串才可以用)
    var dotCnt = String(number).substring(dot + 1, number.length);

    // 获取小数点前面的数字
    number = String(number).split('.')[0]
    number = (number || 0).toString();
    for (var i = number.length - 1; i >= 0; i--) {
      counter++;
      result = number.charAt(i) + result;
      if (!(counter % 3) && i != 0) {
        result = ',' + result;
      }
    }
    result = result + '.' + dotCnt;
    return result;

  } else {
    // alert('没有小数点');
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
}


export const removeLocalSession = function () {
  let list = ['menu', 'userInfo', 'menuList', 'tabs', 'tabVal'];
  list.forEach(ele => {
    removeSession(ele);
  });
  axios.instance.defaults.headers.Authorization = '';
  constantRoutes[constantRoutes.length - 1].redirect = "";
  router.matcher = createRouter(constantRoutes).matcher;
  router.addRoutes(constantRoutes);
}


export const removeArrayEmpty = function (arr = []) {
  let arrJson = JSON.stringify(arr)
  return JSON.parse(arrJson).filter(ele => {
    return ele ? true : false
  })

}

/**
 * 获取数组中指定的值
 * @param  {Array} data 原数据
 * @param  {Array} target  tab顺序数组
 * @return {Array}  返回排序之后的数组
 */
export const sortTabList = function (data = [], target = []) {
  let arr = []
  data.forEach(ele => {
    let i = target.indexOf(ele.router);
    if (i > -1) {
      arr[i] = ele
    }
  });
  return removeArrayEmpty(arr);
}
