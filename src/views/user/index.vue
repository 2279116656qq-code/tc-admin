<template>
  <div class="page">
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
      <el-button type="primary" plain class="add-btn" @click="openAdd">
        新增用户
      </el-button>
    </div>

    <!-- 数据表格：给 :data 一个数组，每列 prop 对应字段名 -->
    <el-table :data="list" border>
      <el-table-column type="index" label="序号" width="80" />
      <!-- <el-table-column prop="id" label="ID" width="80" /> -->
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="role" label="角色" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="openEdit(row as UserItem)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(row as UserItem)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
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

  <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role">
          <el-option label="管理员" value="管理员" />
          <el-option label="运营" value="运营" />
          <el-option label="访客" value="访客" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getUserList, deleteUser, addUser, updateUser } from "@/api/user";
import type { UserItem } from "@/api/user";
import type { FormInstance, FormRules } from "element-plus";

// 表格数据：接口返回什么就存什么
const list = ref<UserItem[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("新增用户");
const form = reactive({ name: "", phone: "", role: "运营" });
const formRef = ref<FormInstance>();

// 校验规则：每个字段一条数组，可以有多个条件依次检查
const rules: FormRules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1\d{10}$/,
      message: "手机号格式不对（1开头共11位）",
      trigger: "blur",
    },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};
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

// 删除：先确认，再调接口，成功后刷新
async function handleDelete(row: UserItem) {
  try {
    await ElMessageBox.confirm(`确定删除 ${row.name} 吗？`, "提示", {
      type: "warning",
    });
  } catch {
    return; // 用户点了取消，什么都不干
  }
  await deleteUser(row.id);
  ElMessage.success("删除成功");
  fetchList();
}

// 正在编辑的用户 id：null = 新增模式，有值 = 编辑模式
let editingId: number | null = null;
// 打开"新增"：先清空旧数据再开门
function openAdd() {
  editingId = null;
  dialogTitle.value = "新增用户";
  form.name = "";
  form.phone = "";
  form.role = "运营";
  dialogVisible.value = true;
}
// 打开"编辑"：把这行数据回填进表单再开门
function openEdit(row: UserItem) {
  editingId = row.id;
  dialogTitle.value = "编辑用户";
  form.name = row.name;
  form.phone = row.phone;
  form.role = row.role;
  dialogVisible.value = true;
}

// 提交
async function handleSubmit() {
  // 先过校验：没过会 reject，红字自动显示，停在这
  try {
    await formRef.value?.validate();
  } catch {
    return;
  }
  if (editingId === null) {
    await addUser({ ...form });
    ElMessage.success("新增成功");
  } else {
    await updateUser(editingId, { ...form });
    ElMessage.success("修改成功");
  }
  dialogVisible.value = false;
  fetchList();
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

  // 新增按钮推到最右，和搜索区隔开
  .add-btn {
    margin-left: auto;
  }
}

.el-pagination {
  justify-content: flex-end;
  margin-top: 16px;
}

// 弹窗里的下拉框撑满表单行
:deep(.el-select) {
  width: 100%;
}
</style>
