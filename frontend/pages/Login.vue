<script setup>
import { reactive } from "vue";
import { login } from "../../api/auth";
import Header from "../../components/Header/Mobile.vue";
import { useUserStore } from "../../stores/user";

const router = useRouter()

const userStore = useUserStore();

const state = reactive({
  nickname: "",
  email: "",
  password: "",
});

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

    router.push("/");
  }
};
</script>
<template>
  <Header />
  <main class="flex flex-col items-center justify-center">
    <div class="w-screen h-full">
      <div class="max-w-[768px] flex flex-col items-center m-auto px-10 mt-[50px] bg-[#fff]] justify-center">
        <img src="/assets/logo.svg" alt="logo" class="w-[200px] h-[70px] mb-[20px]" />
        <h2 v-if="service_type === 'Signup'" class="text-md text-[#ff0000] mb-[36px] self-center">로그인 해주세요.</h2>
        <input type="text" class="w-[248px] h-[52px] pl-4 border border-[#93D07F] outline-[#3EAE09] mb-[38px]" placeholder="Email" @input="handleInputEmail" />
        <input type="password" class="w-[248px] h-[52px] pl-4 border border-[#93D07F] outline-[#3EAE09] mb-[44px]" placeholder="Password" @input="handleInputPassword" />
        <div class="w-full flex justify-center mb-[38px]">
          <button class="w-[140px] h-[52px] bg-[#93D07F] text-[22px] text-[#FFFFFF] rounded-lg ml-[10px]" @click="handleClickLogin">로그인</button>
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
