<script setup>
import { storeToRefs } from "pinia";
import { reactive } from "vue";
import { login } from "../../api/auth";
import { useModalStore } from "../../stores/modal";
import { useUserStore } from "../../stores/user";

const modalStore = useModalStore();
const userStore = useUserStore();

const { isShowLoginModal } = storeToRefs(modalStore);
const { user_id } = storeToRefs(userStore);

const { setLoginModal, setSignUpModal } = modalStore;

const state = reactive({
  nickname: "",
  email: "",
  password: "",
});

const clickModalOutside = (e) => {
  if (e.target.classList.contains("modal_wrapper")) setLoginModal(false);
};

const handleClickClose = () => {
  setLoginModal(false);
};

const handleInputEmail = (e) => {
  state.email = e.target.value;
};

const handleInputPassword = (e) => {
  state.password = e.target.value;
};

const handleClickLogin = async () => {
  const res = await login(state.email, state.password).catch((err) => {
    console.log(err);
    alert("로그인 실패\n아이디와 비밀번호를 확인해주세요.\n혹은 이메일 인증을 완료해주세요.");
  });

  if (res.status === 200) {
    alert("로그인 성공");
    localStorage.setItem("jt", res.data.jwt);
    localStorage.setItem("user_id", res.data.user.id);
    userStore.setUser(res.data.user);

    setLoginModal(false);
  }
};

const handleClickSignUp = () => {
  setLoginModal(false);
  setSignUpModal(true);
};
</script>
<template>
  <div v-if="isShowLoginModal" class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full m-auto modal_wrapper z-9999">
    <div class="fixed flex flex-col items-center left-0 top-0 right-0 bottom-0 m-auto px-10 w-[496px] h-[524px] bg-[#fff] shadow shadow-[rgba(0,0,0,0.25)] flex flex-col justify-center rounded-xl relative">
      <img src="/assets/cross.png" alt="cross" class="w-[20] h-[20] absolute right-10 top-10 cursor-pointer" @click="handleClickClose()" />
      <div class="w-[348px] flex flex-col">
        <img src="/assets/logo.svg" alt="logo" class="w-[300px] h-[70px] mr-[50px] mb-[46px]" />
        <input type="text" class="w-[348px] h-[52px] pl-4 border border-[#93D07F] rounded-lg outline-[#3EAE09] mb-[38px]" placeholder="Email" @input="handleInputEmail" />
        <input type="password" class="w-[348px] h-[52px] pl-4 border border-[#93D07F] rounded-lg outline-[#3EAE09] mb-[44px]" placeholder="Password" @input="handleInputPassword" />
        <div class="w-full flex justify-between mb-[38px]">
          <button class="w-[142px] h-[52px] bg-[#93D07F] text-[22px] text-[#FFFFFF] rounded-lg items-end ml-[10px]" @click="handleClickLogin">로그인</button>
          <button class="w-[142px] h-[52px] bg-[#93D07F] text-[22px] text-[#FFFFFF] rounded-lg mr-[10px]" @click="handleClickSignUp">회원가입</button>
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
