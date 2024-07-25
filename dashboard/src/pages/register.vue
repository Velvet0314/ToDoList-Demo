<script setup>
import "~/assets/bg-bubbles-square.css";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import { inject } from "vue";
const axios = inject("axios");


const timer = ref(0);  // 剩余时间
const canSend = ref(true);  // 是否可以发送验证码

const registerFormRef = ref(null);

const sendVerifyCode = () => {
  if (!canSend.value) {
    ElMessage({
      type: "info",
      message: "请稍候，正在冷却中...",
    });
    return;
  }

  if (!registerForm.userid) {
    ElMessage({
      type: "error",
      message: "请输入邮箱地址！",
    });
    return;
  }

  console.log("发送验证码给:", registerForm.userid);
  axios
    .post(`/user/getVerificationCode?userid=${encodeURIComponent(registerForm.userid)}`)
    .then((response) => {
      // 设置倒计时
      timer.value = 120;
      canSend.value = false;
      const countdownInterval = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) {
          clearInterval(countdownInterval);
          canSend.value = true;  // 重置发送状态
        }
      }, 1000);

      ElMessage({
        type: "success",
        message: "验证码已发送，请查收！",
      });
    })
    .catch((error) => {
      ElMessage({
        type: "error",
        message: `发送失败: ${error.message}`,
      });
    });
};

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (registerForm.checkPass !== "") {
      if (!registerFormRef.value) return;
      registerFormRef.value.validateField("checkPass");
    }
    callback();
  }
};

const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== registerForm.pass) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const registerForm = reactive({
  userid: "",
  verifycode: "",
  pass: "",
  checkPass: "",
});

const registerFormRules = reactive({
  userid: [{ validator: validatePass, trigger: "blur" }],
  verifycode: [{ validator: validatePass, trigger: "blur" }],
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
});

const register = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
    }
  });
};

const open = () => {
  ElMessageBox.confirm(
    "<font size=4 color=black><strong>DEMO 服务条款</strong></font><br>\
    <font size=3>关于我们</font><br>\
    <font size=3>1. 介绍</font><br>\
    欢迎使用我们的任务管理系统（以下简称“本系统”）。在您使用本系统之前，请仔细阅读本服务条款。通过访问或使用本系统，您同意受这些条款的约束。<br>\
    <font size=3>2. 服务</font><br>\
    本系统提供任务管理、日程安排、提醒设置等功能，旨在帮助用户高效管理日常任务。<br>\
    <font size=3>3. 用户账户</font><br>\
    为使用本系统的全部功能，用户需要注册账户。用户必须提供真实、准确、最新和完整的信息。账户安全由用户负责。<br>\
    <font size=3>4. 使用规范</font><br>\
    用户在使用本系统时，必须遵守所有适用的法律法规。用户不得利用本系统进行任何非法或未经授权的活动。<br>\
    <font size=3>5. 内容所有权</font><br>\
    本系统包含的所有内容，包括但不限于文本、图像、用户界面、视觉界面、信息内容以及软件编码，其知识产权归本公司所有。<br>\
    <font size=3>6. 第三方链接</font><br>\
    本系统可能包含指向第三方网站或服务的链接，这些链接仅为方便用户而提供。使用第三方服务须遵守第三方的条款和政策。<br>\
    <font size=3>7. 联系我们</font><br>\
    如有任何问题或建议，请与我们联系。<br>\
",
    "服务条款",
    {
      confirmButtonText: "我同意",
      cancelButtonText: "关闭",
      showcancelbutton: true,
      dangerouslyUseHTMLString: true,
      customClass: "message-box",
    }
  ).catch(() => {
    ElMessage({
      type: "info",
      message: "已取消",
    });
  });
};
</script>

<template>
  <div class="wrapper">
    <el-row style="width: 450px; height: auto">
      <el-col
        style="z-index: 2"
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        class="animate__animated animate__fadeIn"
      >
        <el-card
          class="justify-center"
          style="border-radius: 10px"
          shadow="always"
        >
          <div class="text-center my-5">
            <div class="text-2xl font-bold mb-xs">创建您的账户</div>
            <span class="text-sm text-gray-400">已经有账户了？</span>
            <span class="login">
              <router-link to="/login">在此登入</router-link>
            </span>
          </div>
          <div
            class="text-xs text-gray-400 text-center flex items-center justify-center space-x-3 mb-1"
          >
            <span
              class="h-[1px] w-40 bg-gray-200"
              style="display: inline-block"
            ></span>
            <span>OR</span>
            <span
              class="h-[1px] w-40 bg-gray-200"
              style="display: inline-block"
            ></span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <el-form
              ref="registerFormRef"
              style="max-width: 600px"
              :model="registerForm"
              status-icon
              :rules="registerFormRules"
              label-width="200px"
              label-position="top"
              class="register_form"
            >
              <el-form-item label="邮箱" prop="userid">
                <el-input
                  size="large"
                  v-model="registerForm.userid"
                  type="text"
                  autocomplete="off"
                  placeholder="请正确输入你的邮箱"
                  class="inputbox"
                />
              </el-form-item>
              <el-form-item label="验证码" prop="verifycode">
                <el-input
                  size="large"
                  v-model="registerForm.verifycode"
                  type="text"
                  autocomplete="off"
                  placeholder="请输入你的验证码"
                  class="inputbox-varify"
                >
                  <template #append>
                    <el-button
                      color="#2283e5"
                      v-model="registerForm.verifycode"
                      @click="sendVerifyCode(registerFormRef)"
                      class="varify-button"
                      :disabled="!canSend"
                      >{{ canSend ? '获取' : ` ${timer} s` }}</el-button
                    >
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input
                  size="large"
                  v-model="registerForm.pass"
                  type="password"
                  autocomplete="off"
                  placeholder="请正确输入你的密码"
                  class="inputbox"
                />
              </el-form-item>
              <el-form-item label="重复密码" prop="checkPass">
                <el-input
                  size="large"
                  v-model="registerForm.checkPass"
                  type="password"
                  autocomplete="off"
                  placeholder="请再次正确输入你的密码"
                  class="inputbox"
                />
              </el-form-item>
              <el-form-item>
                <el-checkbox
                  v-model="checked1"
                  label="我同意"
                  size="large"
                  style="margin-top: 0.95px"
                />
                <span>&nbsp;</span>
                <span
                  class="text-blue-500"
                  @click="open"
                  style="cursor: pointer"
                  >服务条款</span
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="register(registerFormRef)"
                  class="text-sm h-[40px] w-[350px] mt-2 mb-8"
                  color="#2283e5"
                >
                  创建账户
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <ul class="square-bg-bubbles">
      <li v-for="n in 10" :key="n"></li>
    </ul>
  </div>
</template>

<style scoped>
.login {
  @apply text-sm font-bold;
  color: #2283e5;
}
.inputbox {
  @apply mb-1;
}
.animate__animated.animate__fadeInDown {
  --animate-duration: 2s;
}
:deep(.el-input__wrapper) {
  border-radius: 5px;
}
:deep(.el-button--primary.is-disabled) {
  background-color: #64a8ed;
  border-color: #64a8ed;
}
:deep(.inputbox-varify > .el-input__wrapper) {
  border-radius: 5px 0px 0px 5px;
}
:deep(.el-input-group__append) {
  color: white;
  background-color: #2283e5;
  border-radius: 0px 5px 5px 0px;
}
:deep(.register_form .el-form-item__label) {
  font-weight: 400;
  color: #000000;
  width: 350px;
  margin-top: 25px;
}
:deep(.el-message-box__header) {
  font-weight: bold;
}
</style>

<style>
.message-box {
  --el-messagebox-width: 500px;
  --el-messagebox-padding-primary: 30px;
  --el-messagebox-border-radius: 10px;
  --el-messagebox-font-size: 22px;
}
.el-message-box__title {
  font-weight: bold;
}
.el-input-group__append:hover {
  background-color: #64a8ed;
}
</style>
