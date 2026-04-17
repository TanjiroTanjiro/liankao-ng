
<template>
  <div class="problem-list-container">
    <div class="header">
      <h1>题目列表</h1>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索题目名称"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="sort-bar">
        <el-select v-model="sortBy" @change="handleSortChange" placeholder="排序方式">
          <el-option label="ID（从大到小）" value="desc" />
          <el-option label="ID（从小到大）" value="asc" />
          <el-option label="难度（从高到低）" value="difficulties-desc" />
          <el-option label="难度（从低到高）" value="difficulties-asc" />
          <el-option label="质量（从高到低）" value="qualities-desc" />
          <el-option label="质量（从低到高）" value="qualities-asc" />
        </el-select>
      </div>
    </div>
    <div class="problem-list" v-loading="loading">
      <ProblemItem
        v-for="problem in problems"
        :key="problem.id"
        :problem="problem"
        :user-rating="userRatings[problem.id] || 0"
        @rated="handleRated"
      />
      <el-empty v-if="!loading && problems.length === 0" description="暂无题目" />
    </div>
    <div class="pagination" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElInput, ElSelect, ElOption, ElPagination, ElEmpty, ElIcon, ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import ProblemItem from '../components/ProblemItem.vue'
import { getProblemList } from '../api/problem'

const loading = ref(false)
const problems = ref([])
const searchQuery = ref('')
const sortBy = ref('desc')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const userRatings = ref({})

const fetchProblems = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      order: sortBy.value
    }
    if (searchQuery.value) {
      params.name = searchQuery.value
    }
    const res = await getProblemList(params)
    problems.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取题目列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchProblems()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchProblems()
}

const handleSizeChange = () => {
  currentPage.value = 1
  fetchProblems()
}

const handlePageChange = () => {
  fetchProblems()
}

const handleRated = ({ problemId, rating }) => {
  userRatings.value[problemId] = rating
  // 重新获取列表以更新质量评分
  fetchProblems()
}

onMounted(() => {
  fetchProblems()
})
</script>

<style scoped>
.problem-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  margin: 0 0 16px 0;
  font-size: 28px;
  color: #303133;
}

.search-bar {
  margin-bottom: 16px;
  max-width: 400px;
}

.sort-bar {
  margin-bottom: 16px;
}

.problem-list {
  min-height: 200px;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
