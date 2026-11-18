<template>
  <div class="page">
    <h1>用户管理</h1>
    <p>第 6 步在这里做完整的增删改查</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getUserList } from "@/api/user";

onMounted(async () => {
  const res = await getUserList({ page: 1, size: 10, keyword: "" });
  console.log("用户列表", res);
});
</script>

<style scoped lang="scss">
.page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}
</style>
