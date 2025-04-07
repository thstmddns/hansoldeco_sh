<script setup>
import { onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useModalStore } from "../../stores/modal";
import { signup } from "../../api/auth";

const modalStore = useModalStore();

const { isShowSignUpModal } = storeToRefs(modalStore);
const { setLoginModal, setSignUpModal } = useModalStore();

const clickModalOutside = (e) => {
  if (e.target.classList.contains("modal_wrapper")) setSignUpModal(false);
};

const handleClickClose = () => {
  setSignUpModal(false);
};

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

  // add regex over 8 characters, 1 number, 1 special character
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,}$/;
  if (regex.test(state.confirmPassword)) {
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
    alert("비밀번호 확인은 8자 이상, 1개의 숫자, 1개의 특수문자를 포함해야 합니다.");
    return;
  }

  if (state.password !== state.confirmPassword) {
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
    setSignUpModal(false);
    setLoginModal(true);
  }
};
</script>
<template>
  <div v-if="isShowSignUpModal" class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full m-auto modal_wrapper z-9999">
    <div class="fixed flex flex-col items-center left-0 top-0 right-0 bottom-0 m-auto px-10 w-[496px] h-[600px] bg-[#fff] shadow shadow-[rgba(0,0,0,0.25)] flex flex-col justify-center rounded-xl relative">
      <img src="/assets/cross.png" alt="cross" class="w-[20px] h-[20px] absolute right-10 top-10 cursor-pointer" @click="handleClickClose()" />
      <div class="w-[348px] flex flex-col">
        <img src="/assets/logo.svg" alt="logo" class="w-[300px] h-[70px] mr-[50px] mb-[16px]" />
        <input type="text" class="w-[348px] h-[52px] pl-4 border border-[#93D07F] rounded-lg outline-[#3EAE09] mt-[44px]" placeholder="Email" @input="handleInputEmail" />
        <span v-if="!state.checkEmail" class="tooltiptext whitespace-nowrap text-sm text-[#ff0000] mt-4">이메일 형식이 올바르지 않습니다.</span>
        <input type="password" class="w-[348px] h-[52px] pl-4 border border-[#93D07F] rounded-lg outline-[#3EAE09] mt-[44px]" placeholder="Password" @input="handleInputPassword" />
        <span v-if="!state.checkPassword" class="tooltiptext whitespace-nowrap text-sm text-[#ff0000] mt-4">8자 이상, 최소 1개 숫자와 특수문자가 포함되어야 합니다.</span>
        <input type="password" class="w-[348px] h-[52px] pl-4 border border-[#93D07F] rounded-lg outline-[#3EAE09] mt-[44px]" placeholder="Confirm Password" @input="handleInputConfirmPassword" />
        <span v-if="!state.checkConfirmPassword" class="tooltiptext whitespace-nowrap text-sm text-[#ff0000] mt-4">8자 이상, 최소 1개 숫자와 특수문자가 포함되어야 합니다.</span>
        <div class="flex justify-center w-full">
          <button class="w-[142px] h-[52px] bg-[#93D07F] text-[22px] text-[#FFFFFF] rounded-lg mt-[44px]" @click="handleClickSignup">가입하기</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
input::placeholder {
  color: #c5c5c5;
}
</style>
