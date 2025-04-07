<script setup>
import { reactive } from "vue";
import { signup } from "../../api/auth";
import Header from "../../components/Header/Mobile.vue";

const router = useRouter();

const state = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  checkEmail: true,
  checkPassword: true,
  checkConfirmPassword: true,
  phone: "",
});

const handleInputEmail = (e) => {
  state.email = e.target.value;

  // add regex for email
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (regex.test(state.email)) {
    state.checkEmail = true;
  } else {
    state.checkEmail = false;
  }
};

const handleInputPassword = (e) => {
  state.password = e.target.value;

  // add regex over 8 characters, 1 number, 1 special character
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,}$/;
  if (regex.test(state.password)) {
    state.checkPassword = true;
  } else {
    state.checkPassword = false;
  }
};

const handleInputConfirmPassword = (e) => {
  state.confirmPassword = e.target.value;

  if (state.password === state.confirmPassword) {
    state.checkConfirmPassword = true;
  } else {
    state.checkConfirmPassword = false;
  }
};

const handleClickSignup = async () => {
  if (state.checkEmail === false) {
    alert("이메일 형식이 올바르지 않습니다.");
    return;
  }

  if (state.checkPassword === false) {
    alert("비밀번호는 8자 이상, 1개의 숫자, 1개의 특수문자를 포함해야 합니다.");
    return;
  }

  if (state.checkConfirmPassword === false) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const res = await signup(state.email, state.email, state.password).catch((err) => {
    console.log(err);
    alert("회원가입 실패, 이미 가입된 이메일인지 확인해주세요.");
    return;
  });

  if (res.status === 200) {
    // localStorage.setItem("signedId", res.data.user.id);
    // alert("회원가입 성공, 이메일 인증을 해주세요!");
    // router.push("/login");
    alert("회원가입 성공");
    router.push("/login");
  }
};
</script>
<template>
  <Header />
  <main class="flex flex-col items-center justify-center">
    <div class="w-screen h-full">
      <div class="max-w-[768px] flex flex-col items-center m-auto px-10 mt-[50px] bg-[#fff]] justify-center">
        <img src="/assets/logo.svg" alt="logo" class="w-[200px] h-[70px] mb-[10px]" />
        <input type="text" class="w-[278px] h-[52px] pl-4 border border-[#93D07F] outline-[#3EAE09] mt-[24px]" placeholder="Email" @input="handleInputEmail" />
        <span v-if="!state.checkEmail" class="tooltiptext whitespace-nowrap text-sm text-[#ff0000] mt-4 self-center">이메일 형식이 올바르지 않습니다.</span>
        <input type="password" class="w-[278px] h-[52px] pl-4 border border-[#93D07F] outline-[#3EAE09] mt-[24px]" placeholder="Password" @input="handleInputPassword" />
        <span v-if="!state.checkPassword" class="tooltiptext whitespace-nowrap text-sm text-[#ff0000] mt-4 self-center">8자 이상, 최소 1개 숫자와 특수문자가 포함되어야 합니다.</span>
        <input type="password" class="w-[278px] h-[52px] pl-4 border border-[#93D07F] outline-[#3EAE09] mt-[24px]" placeholder="Confirm Password" @input="handleInputConfirmPassword" />
        <span v-if="!state.checkConfirmPassword" class="tooltiptext whitespace-nowrap text-sm text-[#ff0000] mt-4 self-center">비밀번호 입력 값이 일치하지 않습니다.</span>
        <div class="flex justify-center w-full">
          <button class="w-[142px] h-[52px] bg-[#93D07F] text-[22px] text-[#FFFFFF] rounded-lg mt-[44px]" @click="handleClickSignup">가입하기</button>
        </div>
      </div>
    </div>
  </main>
</template>
<style>
input::placeholder {
  color: #c5c5c5;
}
</style>
