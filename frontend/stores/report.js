import { defineStore } from "pinia";

export const useReportStore = defineStore({
    id: "report",
    state: () => ({
        report_list: [],
    }),
    getters: {
        getReportList() {
            return this.report_list;
        }
    },
    actions: {
        setReportList(report_list) {
            this.report_list = report_list;
        }
    }
});
