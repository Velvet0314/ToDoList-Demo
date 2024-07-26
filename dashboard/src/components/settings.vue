<script setup>
import { ref, reactive, inject, onMounted } from "vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";
import getUserInfo from "~/api/getUserInfo";
import { useTokenStore } from "~/stores/tokenstore";
import { ElMessage, ElMessageBox } from "element-plus";

const timer = ref(0);
const userId = ref(null);
const canSend = ref(true);
const axios = inject("axios");
const store = useLayoutStore();
const tokenStore = useTokenStore();
const { isCollapse } = storeToRefs(store);

const passFormRef = ref(null);

const validateCode = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else {
    if (passForm.checkPass !== "") {
      if (!passFormRef.value) return;
      passFormRef.value.validateField("checkPass");
    }
    callback();
  }
};

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else {
    if (passForm.checkPass !== "") {
      if (!passFormRef.value) return;
      passFormRef.value.validateField("checkPass");
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"));
  } else if (value !== passForm.pass) {
    callback(new Error("请确保两次输入的密码相同"));
  } else {
    callback();
  }
};

const passForm = reactive({
  userId: "",
  verifyCode: "",
  pass: "",
  checkPass: "",
});

const passFormRules = reactive({
  verifycode: [{ validator: validateCode, trigger: "blur" }],
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
});

const sendverifyCode = () => {
  if (!canSend.value) {
    ElMessage({
      type: "info",
      message: "请稍候，正在冷却中...",
    });
    return;
  }
  console.log("发送验证码给:", passForm.userId);
  axios
    .post(
      `/user/getUpdatePwdCode?userId=${encodeURIComponent(passForm.userId)}`
    )
    .then((response) => {
      timer.value = 120;
      canSend.value = false;
      const countdownInterval = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) {
          clearInterval(countdownInterval);
          canSend.value = true;
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

const resetPass = async (formEl) => {
  if (!formEl) {
    ElMessage({
      type: "error",
      message: "表单提交错误，请刷新页面重试。",
    });
    return;
  }

  const valid = await formEl.validate().catch(() => false);
  if (valid) {
    console.log("submit!");
    const token = tokenStore.token;
    console.log(token);
    console.log(passForm);
    axios
      .put("/user/newUpdatePwd", passForm, {
        headers: {
          "Authorization": "token",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (!response.data.code) {
          ElMessage({
            type: "success",
            message: "修改成功！请重新登录",
          });
          router.push("/login");
        } else {
          // 服务器可能返回一些错误信息，显示给用户
          console.log(response.data.message);
          ElMessage({
            type: "error",
            message: "请确保验证码填写正确",
          });
        }
      })
      .catch((error) => {
        // 捕获任何在请求中发生的错误，并显示给用户
        ElMessage({
          type: "error",
          message: `修改失败: ${error.message}`,
        });
      });
  } else {
    console.log("error submit!");
    ElMessage({
      type: "error",
      message: "请确保填写的信息完整无误",
    });
  }
};

const imageUrl = ref("");

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw);
};

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

onMounted(async () => {
  const tokenStore = useTokenStore();
  try {
    const id = await getUserInfo(tokenStore, axios);
    userId.value = id;
    passForm.userId = id;
    console.log(passForm.userId);
    // console.log("用户ID:", userId);
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
});
</script>

<template>
  <div
    class="flex text-2xl font-bold w-max mt-2"
    :style="{
      'margin-left': isCollapse ? '20px' : '0px',
      transition: 'margin-left .75s ease',
    }"
  >
    账户信息
  </div>
  <el-divider />
  <el-row class="flex" :gutter="20">
    <el-col
      style="z-index: 2"
      :xs="12"
      :sm="12"
      :md="12"
      :lg="12"
      class="animate__animated animate__fadeIn"
    >
      <el-card
        class="config-password"
        shadow="always"
        :style="{ width: isCollapse ? '600px' : '550px' }"
        :collapse="isCollapse"
      >
        <template #header>
          <div class="font-bold mb-xs" style="font-size: 18px">更改密码</div>
        </template>

        <div class="flex flex-col items-center justify-center">
          <el-form
            ref="passFormRef"
            style="max-width: 600px"
            :model="passForm"
            status-icon
            :rules="passFormRules"
            label-width="100px"
            label-position="left"
            class="register_form mt-5"
          >
            <el-form-item label="当前账户" prop="userId">
              <el-input
                size="large"
                v-model="passForm.userId"
                type="text"
                autocomplete="off"
                :placeholder="userId"
                class="inputbox"
                disabled
              />
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode">
              <el-input
                size="large"
                v-model="passForm.verifyCode"
                type="text"
                autocomplete="off"
                placeholder="请输入你的验证码"
                class="inputbox-varify"
              >
                <template #append>
                  <el-button
                    color="#2283e5"
                    v-model="passForm.verifyCode"
                    @click="sendverifyCode(passFormRef)"
                    class="varify-button"
                    :disabled="!canSend"
                    >{{ canSend ? "获取" : ` ${timer} s` }}</el-button
                  >
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
              <el-input
                size="large"
                v-model="passForm.pass"
                type="text"
                autocomplete="off"
                placeholder="请正确输入你的新密码"
                class="inputbox"
              />
            </el-form-item>
            <el-form-item label="重复新密码" prop="checkPass">
              <el-input
                size="large"
                v-model="passForm.checkPass"
                type="text"
                autocomplete="off"
                placeholder="请再次正确输入你的新密码"
                class="inputbox"
              />
            </el-form-item>
            <el-form-item>
              <div class="flex justify-end w-full">
                <el-button
                  type="primary"
                  @click="resetPass(passFormRef)"
                  class="text-sm h-[40px] w-[90px] mt-4 mb-5"
                  color="#2283e5"
                >
                  确认修改
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <el-card
        style="border-radius: 10px"
        shadow="always"
        :class="isCollapse ? 'config-basic-collapsed' : 'config-basic-expand'"
      >
        <template #header>
          <div class="font-bold mb-xs" style="font-size: 18px">基本信息</div>
        </template>
        <div class="flex flex-col items-center justify-center">
          <el-form
            style="max-width: 600px"
            :model="passForm"
            status-icon
            :passFormRules="passFormRules"
            label-width="80px"
            label-position="left"
            class="register_form mt-5"
          >
            <el-form-item label="昵称" prop="nickname">
              <el-input
                size="large"
                v-model="passForm.nickname"
                type="text"
                autocomplete="off"
                placeholder="请输入你的昵称"
              />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <el-upload
                class="avatar-uploader"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.config-basic-collapsed {
  @apply mr-30;
  width: 650px;
}
.config-basic-expand {
  @apply ml-10;
  width: 550px;
}
.config-password {
  border-radius: 10px;
  width: 550px;
  height: 420px;
  margin-left: 40px;
}
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
  margin-top: 3px;
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
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
