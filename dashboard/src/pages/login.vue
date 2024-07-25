<script setup>
import { ref, reactive, inject } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import "~/assets/bg-bubbles-triangle.css";

const axios = inject("axios");

const loginFormRef = ref(null);

const loginForm = reactive({
  username: "",
  password: "",
});

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (loginForm.checkPass !== "") {
      if (!loginFormRef.value) return;
      loginFormRef.value.validateField("checkPass");
    }
    callback();
  }
};

const loginFormRules = reactive({
  username: [{ validator: validatePass, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});

const login = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      axios
        .post("/user/login", {
          username: loginForm.username,
          password: loginForm.password,
        })
        .then((response) => {
          console.log("登录成功:", response);
        })
        .catch((error) => {
          console.error("登录失败:", error);
        });
    } else {
      console.log("表单验证失败!");
    }
  });
};
</script>

<template>
  <el-row class="mainframework animate__animated animate__fadeIn">
    <el-col :lg="16" :md="12" class="leftframework">
      <div class="loginwrapper">
        <div
          class="title animate__animated animate__bounceInLeft animate__delay-1s"
        >
          DEMO
        </div>
        <div
          class="description animate__animated animate__fadeInDown animate__delay-2s"
        >
          轻量级,多样化 ToDoList 系统
        </div>
        <ul class="bg-bubbles">
          <li v-for="n in 10" :key="n"></li>
        </ul>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="rightframework">
      <div class="font-bold text-3xl mb-4">登录</div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        class="w-[250px]"
        label-width="auto"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="login(loginFormRef)"
            class="w-[250px]"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
      <div class="register">
        <router-link to="/register">注册</router-link>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.mainframework {
  @apply min-h-screen;
}
.leftframework {
  @apply bg-indigo-500 flex items-center justify-center text-left;
  position: relative;
  overflow: hidden;
}
.rightframework {
  @apply bg-light-50 flex items-center justify-center flex-col;
  z-index: 3;
}
.title {
  @apply font-bold text-5xl text-light-50 mb-4;
}
.description {
  @apply font-bold text-2xl text-light-50 mb-4;
}
.register {
  @apply text-indigo-400 text-sm;
}
.animate__animated.animate__bounceInLeft {
  --animate-duration: 1.45s;
}
.animate__animated.animate__fadeInDown {
  --animate-duration: 1.15s;
}
.animate__animated.animate__fadeInDown {
  --animate-duration: 2s;
}
:deep(.el-input__wrapper) {
  box-shadow: none;
  border: none;
  border-bottom: 1.75px solid #cccccc;
  border-radius: 0px;
}
</style>
