<script setup>
import { reactive, ref } from "vue";
import { sendChat } from "~/api/chatbot";
import generateUUID from "~/lib/getnerateUUID";
import { marked } from "marked";

const messageBox = ref(null);
const inputBox = ref(null);

const state = reactive({
    isChatbotModal: false,
    chat_id: '',
    chatList: [
        {
            id: 0,
            message: '안녕하세요, 어떻게 도와드릴까요?',
            profile: '/assets/chatbot.png',
            type: 'bot',
            createdAt: new Date()
        }
    ],
    sendText: '',
    isLoading: false
});

const setChatbotModal = (value) => {
    state.isChatbotModal = value;
}

const handleInputText = (e) => {
    if (state.isLoading) {
        state.sendText = '';
        inputBox.value.value = '';
        return;
    }
    state.sendText = e.target.value;
}

const handleClickSend = async () => {
    if (state.sendText.trim() === '') return;

    const message = state.sendText.trim();
    state.sendText = '';
    inputBox.value.focus();
    state.isLoading = true;

    state.chatList.push({
        id: state.chatList.length + 1,
        message: message,
        profile: '/assets/chatbot.png',
        type: 'user',
        createdAt: new Date()
    });

    const res = await sendChat(state.chat_id, message).catch((err) => {
        console.error(err);
    });

    if (res.status === 200) {
        state.chatList.push({
            id: state.chatList.length + 1,
            message: res.data.answer,
            visualize: res.data.visualize ?? null,
            profile: '/assets/chatbot.png',
            type: 'bot',
            createdAt: new Date()
        });
    }

    
    state.isLoading = false;


    // scroll to bottom
    setTimeout(() => {
        messageBox.value.scrollTop = messageBox.value.scrollHeight;
    }, 10);
}

onMounted(() => {
    state.chat_id = generateUUID();

    if (process.client) {
        window.addEventListener('keydown', (e) => {
            if (state.isLoading) return;

            // if press shift + enter
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                const value = state.sendText;
                state.sendText = value + '\n';
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                handleClickSend();
            }

        });
    }
})

</script>
<template>
    <section class="fixed flex justify-end bottom-30 right-30 z-[999]" :class="{'mr-[-28px]': $device.isMobile, 'w-full': state.isChatbotModal }">
        <img v-if="!state.isChatbotModal" src="/assets/chatbot.png" alt="chatbot" class="w-60 h-60 cursor-pointer" @click="setChatbotModal(true)" />
        <div v-if="state.isChatbotModal" class="ml-auto h-600 bg-white border rounded-xl overflow-hidden relative" :class="{'w-[calc(100%-8px)]': $device.isMobile, 'w-[calc(100%-50px)]': $device.isIpad, 'w-[calc(100%-50px)]': $device.isDesktop }">
            <img src="/assets/close_chatbot.png" alt="cross" class="w-14 h-7 absolute top-30 right-30 cursor-pointer" @click="setChatbotModal(false)" />
            <div class="pl-20 w-full h-74 bg-[#A2DB8F] flex items-center">
                <img src="/assets/SH_Chat.png" alt="SH Chat" />
            </div>
            <div ref="messageBox" class="text_box p-20 w-full h-422 flex flex-col gap-10 overflow-y-scroll">
                <div v-for="chat in state.chatList" :key="chat.id" class="flex gap-10">
                    <img v-if="chat.type === 'bot'" :src="chat.profile" alt="profile" class="w-40 h-40" />
                    <div class="w-full" :class="{ 'flex justify-end' : chat.type !== 'bot'}">
                        <div v-if="chat.type === 'bot'" class="bg-[#A2DB8F] p-10 max-w-[95%] rounded-xl inline-block whitespace-pre overflow-x-scroll scrollbar_hidden">
                            <!-- <p class="text-14">{{ chat.message }}</p> -->
                            <div v-html="marked.parse(chat.message)"></div>
                            <img v-if="chat.visualize" :src="chat.visualize" alt="visualize" class="max-w-full max-h-full" />
                        </div>
                        <div v-else class="bg-[#E3F2E0] p-10 rounded-xl inline-block whitespace-pre">
                            <p class="text-14">{{ chat.message }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <textarea ref="inputBox" :placeholder="state.isLoading ? '채팅 응답을 기다리는 중 입니다!' : ''" class="p-20 w-full h-100 bg-[#E3F2E0] outline-none resize-none scroll absolute bottom-0 z-10 scrollbar_hidden" :value="state.sendText" @input="handleInputText"></textarea>
            <img src="/assets/chat_send.png" alt="send" class="w-60 h-60 absolute bottom-10 right-10 cursor-pointer z-11" @click="handleClickSend" />
        </div>
    </section>
</template>
<style>
.scrollbar_hidden::-webkit-scrollbar {
    display: none;
}
.scrollbar_hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
table { border-collapse: collapse; }
tr { border-bottom: solid 1px black; }
tr:nth-child(even) {background-color: #f2f2f2;}
</style>
