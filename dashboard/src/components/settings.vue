<script setup>
import { ref, reactive } from "vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";

const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);

const ruleFormRef = ref(null);

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (ruleForm.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass");
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  userid: "",
  verifycode: "",
  pass: "",
  checkPass: "",
  nickname: "",
  avatar: "",
});

const rules = reactive({
  userid: [{ validator: validatePass, trigger: "blur" }],
  verifycode: [{ validator: validatePass, trigger: "blur" }],
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
});

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
    }
  });
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
</script>

<template>
  <div class="flex text-2xl font-bold w-max mt-2" :style="{ 'margin-left': isCollapse ? '20px' : '0px',transition:'margin-left .75s ease'}">账户信息</div>
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
            ref="ruleFormRef"
            style="max-width: 600px"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="100px"
            label-position="left"
            class="register_form mt-5"
          >
            <el-form-item label="邮箱" prop="userid">
              <el-input
                size="large"
                v-model="ruleForm.userid"
                type="text"
                autocomplete="off"
                placeholder="请正确输入你的邮箱"
                class="inputbox"
              />
            </el-form-item>
            <el-form-item label="验证码" prop="verifycode">
              <el-input
                size="large"
                v-model="ruleForm.verifycode"
                type="text"
                autocomplete="off"
                placeholder="请输入你的验证码"
                class="inputbox-varify"
              >
                <template #append>
                  <el-button color="#2283e5" class="varify-button"
                    >获取</el-button
                  >
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
              <el-input
                size="large"
                v-model="ruleForm.pass"
                type="password"
                autocomplete="off"
                placeholder="请正确输入你的新密码"
                class="inputbox"
              />
            </el-form-item>
            <el-form-item label="重复新密码" prop="checkPass">
              <el-input
                size="large"
                v-model="ruleForm.checkPass"
                type="password"
                autocomplete="off"
                placeholder="请再次正确输入你的新密码"
                class="inputbox"
              />
            </el-form-item>
            <el-form-item>
              <div class="flex justify-end w-full">
                <el-button
                  type="primary"
                  @click="submitForm(ruleFormRef)"
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
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="80px"
            label-position="left"
            class="register_form mt-5"
          >
            <el-form-item label="昵称" prop="nickname">
              <el-input
                size="large"
                v-model="ruleForm.nickname"
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
