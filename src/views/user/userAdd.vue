<template>
  <div>
    <Modal v-model="modal1" title="新增用户"   :loading="loading" @on-ok="handleSubmit('formValidate')" >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="描述" prop="desc">
          <Input
            v-model="formValidate.desc"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="请输入描述"
          ></Input>
        </FormItem>
        <FormItem>
          <!-- <Button type="primary" @click="handleSubmit('formValidate')">提交 </Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import userApi from "@/api/user";
import { fetchApi } from "@/utils/assist";
export default {
  props: {
    "modal1-show": Boolean
  },
  inject: ['app'],
  data() {
    return {
      modal1: false,
      loading: true,
      formValidate: {
        name: "",
        desc: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],

        desc: [
           {
            required: true,
            message: "描述不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    addUser() {
      let param = { name: this.formValidate.name, description: this.formValidate.description};
      fetchApi(userApi.addUser, param, this).then(res => {
        if(res.code == 200){
            this.$Message.success('新增成功！');
            this.modal1 = false;
            location.reload()
        }
      });
    },
    handleSubmit (name) {
       this.$refs[name].validate((valid) => {
            if (valid) {
                this.addUser();
            } else {
                this.loading = false;
                this.$Message.error('Fail!');
            }
      })
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    }
  }
};
</script>
