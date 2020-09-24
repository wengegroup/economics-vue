<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import { getSession } from "@/utils/assist";
import axios from "@/api";
export default {
  created() {
    this.setToken();
  },
  methods: {
    setToken() {
      let userInfo = getSession("userInfo");
      let local = getSession("locale");
      let langs = getSession("language");
      if (langs && local) {
        axios.instance.defaults.headers["Accept-Language"] = langs[local];
      } else {
        axios.instance.defaults.headers["Accept-Language"] = local
          ? local
          : "zh-HK";
      }

      if (userInfo) {
        axios.instance.defaults.headers.Authorization ='Bearer '+ userInfo.access_token;
        axios.instance.defaults.headers.AuthId = userInfo.userId;
        axios.instance.defaults.headers["Auth-Account"] = userInfo.account;
      }
    }
  }
};
</script>
<style lang="scss">

</style>



