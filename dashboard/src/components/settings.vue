<script setup>
import { ref, reactive, inject, onMounted, onUnmounted, computed } from "vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";
import getUserInfo from "~/api/getUserInfo";
import { useTokenStore } from "~/stores/tokenstore";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

// 需要的常量
const timer = ref(0);
const userId = ref(null);
const nickname = ref(null);
const canSend = ref(true);
const axios = inject("axios");
const store = useLayoutStore();
const avatar = ref(null);
const tokenStore = useTokenStore();
const router = useRouter();
const { isCollapse } = storeToRefs(store);
const passFormRef = ref(null);
const basicInfoFormRef = ref(null);
// 头像上传
const imageUrl = ref(null);
const apiUrl = ref("/api/user/uploadPic");

// 基本信息表单及其验证规则
const basicInfoForm = reactive({
  nickname: "",
});

const validateNickname = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入新的昵称"));
  } else {
    if (basicInfoForm.nickname !== "") {
      if (!basicInfoFormRef.value) return;
      basicInfoFormRef.value.validateField("nickname");
    }
    callback();
  }
};

const basicInfoFormRules = reactive({
  nickname: [{ validator: validateNickname, trigger: "blur" }],
});

const resetBasicInfo = async (formEl) => {
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
    console.log(basicInfoForm);
    axios
      .patch("/user/updateNickname", basicInfoForm, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (!response.data.code) {
          ElMessage({
            type: "success",
            message: "修改成功!",
          });
        } else {
          console.log(response.data.message);
          ElMessage({
            type: "error",
            message: `修改失败：请确保新昵称与旧昵称没有重复`,
          });
        }
      })
      .catch((error) => {
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

// 密码表单及其验证规则
const passForm = reactive({
  userId: "",
  verifyCode: "",
  pass: "",
  checkPass: "",
});

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

const passFormRules = reactive({
  verifyCode: [{ validator: validateCode, trigger: "blur" }],
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
});

// 验证码请求
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

// 重置密码表单提交
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
          Authorization: token,
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
          console.log(response.data.message);
          ElMessage({
            type: "error",
            message: "请确保验证码填写正确",
          });
        }
      })
      .catch((error) => {
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



const handleAvatarSuccess = async (response, uploadFile) => {
  console.log(response);
  if (!response.code) {
    imageUrl.value = response.info;
    ElMessage({
      type: "success",
      message: "修改成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "修改失败",
    });
    throw new error("上传图片错误");
  }
};

const beforeAvatarUpload = (rawFile) => {
  // 允许图片格式为 JPEG 或 PNG
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("Avatar picture must be JPG or PNG format!");
    return false;
  }
  // 文件大小限制调整为不超过 4MB
  else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error("Avatar picture size can not exceed 4MB!");
    return false;
  }
  return true;
};

// 获取用户信息：账户id, 昵称nickName, 头像
onMounted(async () => {
  const tokenStore = useTokenStore();
  try {
    const info = await getUserInfo(tokenStore, axios);
    userId.value = info.user_name;
    nickname.value = info.nickname;
    avatar.value = info.user_pic;
    passForm.userId = userId.value;
    basicInfoForm.nickname = nickname.value;
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
});


// 页面大小小于一定大小时自动收缩侧边栏
const handleResize = () => {
  width.value = window.innerWidth;
  isCollapse.value = window.innerWidth < 1024;
};

const width = ref(window.innerWidth);

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const showCard = computed(() => {
  return width.value > 1024;
});

</script>
<template>
  <div class="flex text-2xl font-bold w-max mt-2 animate__animated animate__fadeInDown" :style="{
    'margin-left': isCollapse ? '20px' : '0px',
    transition: 'margin-left .75s ease',
  }">
    账户信息
  </div>
  <el-divider />
  <!-- 头像1 -->
  <el-row>
    <el-col>
      <el-card class='config-all animate__animated animate__fadeInDown' shadow="always">
        <template #header>
          <div class="font-bold mb-xs" style="font-size: 18px;">头像修改</div>
        </template>
        <el-form>
          <el-form-item style=" margin-left: 10%;" label="头像" prop="avatar">
            <el-popover placement="right-start" width="auto" trigger="hover" auto-close="1000" content="点击此处更换头像QAQ">
              <template #reference>
                <el-upload class="avatar-uploader" :action="apiUrl" :headers="{
                  Authorization: tokenStore.token,
                }" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                  style=" margin-left: 5%;">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <el-avatar :src="avatar" v-else class="avatar-uploader-icon" shape="square" :size="125"></el-avatar>
                </el-upload>
              </template>
            </el-popover>

          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
  <!-- 基本信息1 -->
  <el-row>
    <el-col>
      <el-card class='config-all animate__animated animate__fadeInDown' shadow="always">
        <template #header>
          <div class="font-bold mb-xs" style="font-size: 18px; ">基本信息</div>
        </template>
        <div>
          <el-form ref="basicInfoFormRef" style="max-width: 600px; margin-left: 10%;" :model="basicInfoForm"
            :rules="basicInfoFormRules" label-width="80px" label-position="left" class="register_form mt-5 left-align">
            <el-form-item label="昵称" prop="nickname">
              <el-input size="large" v-model="basicInfoForm.nickname" type="text" autocomplete="off" class="inputbox" />
            </el-form-item>
            <el-form-item>
              <div class="flex justify-end w-full">
                <el-button type="primary" @click="resetBasicInfo(basicInfoFormRef)"
                  class="text-sm h-[40px] w-[90px] mt-4 mb-5" color="#2283e5">
                  确认修改
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 修改密码 -->
  <el-row>
    <el-col>
      <el-card class="config-all animate__animated animate__fadeInDown" shadow="always">
        <template #header>
          <div class="font-bold mb-xs" style="font-size: 18px;">更改密码</div>
        </template>
        <div>
          <el-form ref="passFormRef" style="max-width: 600px; margin-left: 10%;" :model="passForm" status-icon
            :rules="passFormRules" label-width="100px" label-position="left" class="register_form mt-5">
            <el-form-item label="当前账户" prop="userId">
              <el-input size="large" v-model="passForm.userId" type="text" autocomplete="off" :placeholder="userId"
                class="inputbox" disabled />
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode">
              <el-input size="large" v-model="passForm.verifyCode" type="text" autocomplete="off" placeholder="请输入你的验证码"
                class="inputbox-varify">
                <template #append>
                  <el-button color="#2283e5" v-model="passForm.verifyCode" @click="sendverifyCode(passFormRef)"
                    class="varify-button" :disabled="!canSend">{{ canSend ? "获取" : ` ${timer} s` }}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
              <el-input size="large" v-model="passForm.pass" type="text" autocomplete="off" placeholder="请正确输入你的新密码"
                class="inputbox" />
            </el-form-item>
            <el-form-item label="重复新密码" prop="checkPass">
              <el-input size="large" v-model="passForm.checkPass" type="text" autocomplete="off"
                placeholder="请再次正确输入你的新密码" class="inputbox" />
            </el-form-item>
            <el-form-item>
              <div class="flex justify-end w-full">
                <el-button type="primary" @click="resetPass(passFormRef)" class="text-sm h-[40px] w-[90px] mt-4 mb-5"
                  color="#2283e5">
                  确认修改
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 关于我们 -->
  <el-row>
    <el-col>
      <el-card class='config-all animate__animated animate__fadeInDown' shadow="always">
        <template #header>
          <div class="font-bold mb-xs" style="font-size: 18px">关于我们</div>
        </template>
        <div>
          <el-form style="max-width: 600px; margin-left: 10%; font-size: 18px" label-width="20%" label-position="left ">
            <el-form-item label="于潇">
              <div class="about-us-content">
                于--组长，全栈工程师，任务协调者，文档编写者--潇
              </div>
            </el-form-item>
            <el-form-item label="李青阳">
              <div class="about-us-content">
                全栈工程师
              </div>
            </el-form-item>
            <el-form-item label="于钊京">
              <div class="about-us-content">
                全栈工程师
              </div>
            </el-form-item>
            <el-form-item label="李某某">
              <div class="about-us-content">
                全栈工程师
              </div>
            </el-form-item>
            <el-form-item label="雪烩梨汁">
              <div class="about-us-content">
                全栈工程师
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-upload) {
  width: 125px;
  height: 125px;
  display: block;
}

.config-basic-collapsed,
.config-basic-expand {
  min-height: 90%;
}

.config-basic-collapsed {

  margin: 60px 0 0 50px;
  width: 80%;
}

.config-basic-expand {

  margin: 30px 0 0 50px;
  width: 80%;
  height: 450px;
}

.config-basic-collapsed1 {

  margin: 50px auto;
}

.config-basic-expand1 {

  margin: 50px auto;
}

.config-all {
  border-radius: 10px;
  margin-left: 15%;
  margin-right: 15%;
  margin-bottom: 20px;
}

.config-allCollaspe {
  border-radius: 10px;
  margin-left: 7%;
  margin-right: 7%;
  margin-bottom: 20px;
}

.login {

  color: #2283e5;
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
  position: absolute;
  top: 50%;
  /* 垂直居中 */
  left: 50%;
  /* 水平居中 */
  transform: translate(-50%, -50%);
  /* 精确居中定位 */
  font-size: 28px;
  color: #8c939d;
  text-align: left;
}
</style>
