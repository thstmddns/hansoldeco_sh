<script setup>
import "./output.css";
import LoadingModal from "./components/Modal/LoadingModal.vue";
import LoginModal from "./components/Modal/LoginModal.vue";
import LogoutModal from "./components/Modal/LogoutModal.vue";
import SignupModal from "./components/Modal/SignupModal.vue";
import ImageViewModal from "./components/Modal/ImageViewModal.vue";
import ImageEditModal from "./components/Modal/ImageEditModal.vue";
import DeleteQrModal from "./components/Modal/DeleteQrModal.vue";
import Chatbot from "./components/Modal/Chatbot.vue";

</script>
<template>
  <div class="">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
  <Teleport to="body">
    <LoadingModal />
    <LoginModal />
    <LogoutModal />
    <SignupModal />
    <ImageViewModal />
    <ImageEditModal />
    <DeleteQrModal />
    <Chatbot />
  </Teleport>
</template>
