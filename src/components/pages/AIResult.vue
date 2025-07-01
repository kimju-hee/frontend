<template>
    <VDataTable
        :headers="headers"
        :items="items"
        :items-per-page="5"
        class="elevation-1"
    >
        <template v-slot:item.coverImageUrl="{ item }">
            <v-img
                :src="item.coverImageUrl" 
                alt="AI 커버 이미지" 
                height="80"
                max-width="60"
                contain
                class="my-2"
            ></v-img>
        </template>
    </VDataTable>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
    name: 'AIResult',
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
            { title: "Id", key: "id" }, // 만약 백엔드에서 'Id'로 내려온다면, item-value 등으로 매핑하거나, computed 속성에서 소문자로 변환하는 것을 고려해야 합니다.
            { title: "원고 Id", key: "manuscriptId" },
            { title: "요약", key: "summary" },
            { title: "AI 커버 이미지", key: "coverImageUrl" },
            { title: "대여료", key: "subscriptionFee" },
            { title: "상태", key: "status" },
        ]);

        const items = ref([]);

        onMounted(async () => {
            try {
                const response = await axios.get('/processedResults');
                let data = response.data._embedded.processedResults;
                if (data && Array.isArray(data)) {
                    data.forEach(obj => {
                        obj.id = obj.Id; // 대문자 Id를 소문자 id로 매핑
                        if (obj.updatedAt) {
                            obj.updatedAt = new Date(obj.updatedAt).toLocaleString();
                        }
                    });
                }
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
