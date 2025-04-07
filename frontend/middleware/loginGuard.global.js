import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
    // console.log('to', to)
    // console.log('from', from)

    const userStore = useUserStore();
    const defectStore = useDefectStore();
    const { user_id, isAdmin } = storeToRefs(userStore);
    const { setFileList } = defectStore;

    if (to.path === '/qr' && !user_id.value) {
        if (process.client) {
            alert('You need to login to access this page.')
        }
        return navigateTo('/')
    }

    if (to.path === '/detectqr' && !user_id.value) {
        if (process.client) {
            alert('You need to login to access this page.')
        }
        return navigateTo('/')
    }

    if (to.path === '/defect' && !user_id.value) {
        if (process.client) {
            alert('You need to login to access this page.')
        }
        return navigateTo('/')
    }

    if (to.path === '/admin/model' && !isAdmin.value) {
        if (process.client) {
            alert('You need to be an admin to access this page')
        }
        return navigateTo('/')
    }

    // if path is registercomplete page and before path is reportlist page
    if (to.path === '/registercomplete' && from.path === '/reportlist') {
        return navigateTo('/')
    }

    if (to.path === '/defect' && from.path !== '/register') {
        setFileList([]);
    }
})