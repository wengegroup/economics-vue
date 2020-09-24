<template>
  <div>
   <Button type="primary" icon="ios-add" :style="{ marginBottom: '10px' }" @click="addUser"> 新增用户 </Button>
    <Table border :columns="columns12" :data="data6">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="remove(index)">删除</Button>
      </template>
    </Table>
  </div>
</template>
<script>
import userApi from "@/api/user";
import { fetchApi } from "@/utils/assist";
export default {
  inject: ['app'],
  data() {
    return {
      columns12: [
        {
          title: "创建人",
          key: "createdBy"
        },
        {
          title: "创建时间",
          key: "createdTime"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "描述",
          key: "description"
        },
        {
          title: "删除",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      data6: []
    };
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: "s"
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    },
    addUser(){
        this.app.addUser();
    },
    getUser() {
      fetchApi(userApi.getUser, "", this).then(res => {
         if(res.code == "200"){
             this.data6 = res.data;
         }
      });
    },
  },
  mounted(){
      this.getUser();
  }
};
</script>
