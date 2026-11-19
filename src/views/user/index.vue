<template>
  <div class="page">
    <h1>用户管理</h1>
    <p>第 6 步在这里做完整的增删改查</p>

    <!-- 搜索区 -->
    <div class="search-bar">
      <el-input
        v-model="query.keyword"
        placeholder="姓名 / 手机号"
        clearable
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 数据表格：给 :data 一个数组，每列 prop 对应字段名 -->
    <el-table :data="list" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="role" label="角色" />
    </el-table>
    <!-- 分页：告诉它总条数，页码/条数双向绑到 query -->

    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.size"
      :page-sizes="[5, 10, 20]"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @current-change="fetchList"
      @size-change="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getUserList } from "@/api/user";
import type { UserItem } from "@/api/user";

// 表格数据：接口返回什么就存什么
const list = ref<UserItem[]>([]);
const total = ref(0);

// 查询三件套：翻页、改条数、关键词都是"查询条件"，装在一起
const query = reactive({ page: 1, size: 10, keyword: "" });

// 拉列表：以后搜索、翻页、增删改完，都重新调它刷新
async function fetchList() {
  const res = await getUserList({ ...query });
  list.value = res.list;
  total.value = res.total;
}

// 搜索：换条件必须回第 1 页
function handleSearch() {
  query.page = 1;
  fetchList();
}

// 重置：清空条件，再搜一次
function handleReset() {
  query.keyword = "";
  handleSearch();
}

onMounted(fetchList);
</script>

<style scoped lang="scss">
.page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  .el-input {
    width: 220px;
  }
}
</style>
