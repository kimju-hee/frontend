<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        class="elevation-1"
    ></v-data-table>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
    name: 'ProcessedResultView',
    components: {
        VDataTable,
    },
    props: {
        value: Object,
        editMode: Boolean,
        isNew: Boolean
    },
    setup() {
        const headers = ref([
            // 필드 디스크립터를 기반으로 헤더 설정
            { title: "manuscriptId", key: "manuscriptId" },
            { title: "summary", key: "summary" },
            { title: "coverImageUrl", key: "coverImageUrl" },
            { title: "subscriptionFee", key: "subscriptionFee" },
            { title: "status", key: "status" },
            { title: "updatedAt", key: "updatedAt" },
        ]);

        const items = ref([]);

        onMounted(async () => {
            try {
                const response = await axios.get('/processedResults');
                const data = response.data._embedded.processedResults;
                data.forEach(obj => {
                    obj.id = obj._links.self.href.split("/").pop();
                });
                items.value = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        });

        return {
            headers,
            items
        };
    }
}
</script>
