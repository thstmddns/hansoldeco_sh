<script setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { getUser } from "../../api/user";
import { useDefectStore } from "../../stores/defect";
import { useModalStore } from "../../stores/modal";
import { useUserStore } from "../../stores/user";

const router = useRouter();
const userStore = useUserStore();
const { user_id, email, isAdmin } = storeToRefs(userStore);
const { setUser } = useUserStore();
const { setLoginModal, setLogoutModal } = useModalStore();

const defectStore = useDefectStore();

const handleClickLogoutButton = () => {
  const res = confirm("로그아웃 하시겠습니까?");
  if (res) {
    localStorage.removeItem("jt");
    localStorage.removeItem("user_id");
    userStore.clearUser();
    defectStore.clearDefectInfo();
    router.push("/");
  }
};

const handleClickLogo = () => {
  router.push("/");
};

onMounted(async () => {
  const user_id_local = localStorage.getItem("user_id");

  if (user_id === null && user_id_local !== null) {
    const res = await getUser(signedId).catch((err) => {
      console.log(err);
    });

    if (res.status === 200) {
      setUser(res.data);
    }
  }
});
</script>
<template>
  <header class="max-w-full min-h-70 px-5 bg-[#fff] flex items-center justify-between border-b">
    <div class="flex items-center w-full">
      <img src="/assets/logo_s.svg" alt="logo" class="px-10 max-h-70 max-w-70 mr-10" @click="handleClickLogo" />
      <nav class="block">
        <ul class="flex gap-10">
          <li v-if="user_id !== null && isAdmin" class="min-w-80 text-16 list-none cursor-pointer hover:text-[#93D07F]"><NuxtLink to="/admin/model">모델 관리</NuxtLink></li>
        </ul>
      </nav>
    </div>
    <div :class="{ 'min-w-200': user_id === null, 'min-w-80': user_id != null }" class="flex gap-10 justify-end mr-18">
      <span v-if="user_id !== null" class="text-16 cursor-pointer hover:text-[#93D07F]" @click="handleClickLogoutButton">로그아웃</span>
      <span v-if="user_id === null" class="text-16 cursor-pointer hover:text-[#93D07F]"><NuxtLink to="/login">로그인</NuxtLink></span>
      <span v-if="user_id === null" class="text-16 cursor-pointer hover:text-[#93D07F]"><NuxtLink to="/signup">회원가입</NuxtLink></span>
    </div>
  </header>
</template>
<style></style>
