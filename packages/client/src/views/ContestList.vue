
<template>
  <div class="contest-list-container">
    <div class="header">
      <h1>比赛列表</h1>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索比赛名称"
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
          <el-option label="开始时间（最新）" value="desc" />
          <el-option label="开始时间（最早）" value="asc" />
          <el-option label="质量评分（从高到低）" value="qualities-desc" />
          <el-option label="质量评分（从低到高）" value="qualities-asc" />
        </el-select>
      </div>
    </div>
    <div class="contest-list" v-loading="loading">
      <ContestCard
        v-for="contest in contests"
        :key="contest.id"
        :contest="contest"
        :user-rating="userRatings[contest.id] || 0"
        @rated="handleRated"
      />
      <el-empty v-if="!loading && contests.length === 0" description="暂无比赛" />
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
import ContestCard from '../components/ContestCard.vue'
import { getContestList } from '../api/contest'

const loading = ref(false)
const contests = ref([])
const searchQuery = ref('')
const sortBy = ref('desc')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const userRatings = ref({})

const fetchContests = async () => {
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
    const res = await getContestList(params)
    contests.value = res.data.items
    total.value = res.data.total
  } catch (error) {
    ElMessage.error('获取比赛列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchContests()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchContests()
}

const handleSizeChange = () => {
  currentPage.value = 1
  fetchContests()
}

const handlePageChange = () => {
  fetchContests()
}

const handleRated = ({ contestId, rating }) => {
  userRatings.value[contestId] = rating
  // 重新获取列表以更新质量评分
  fetchContests()
}

onMounted(() => {
  fetchContests()
})
</script>

<style scoped>
.contest-list-container {
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

.contest-list {
  min-height: 200px;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
