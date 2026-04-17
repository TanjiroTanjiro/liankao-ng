
<template>
  <div class="user-detail-container">
    <div class="header">
      <h1>用户详情</h1>
    </div>

    <div class="basic-info" v-loading="loading">
      <div v-if="userInfo" class="info-grid">
        <div class="info-item">
          <span class="label">ID：</span>
          <span class="value">{{ userInfo.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">昵称：</span>
          <span class="value">{{ userInfo.nickname || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">XsyUsername：</span>
          <span class="value">{{ userInfo.xsyusername || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">Rating：</span>
          <span class="value">{{ userInfo.rating !== null && userInfo.rating !== undefined ? userInfo.rating : '-' }}</span>
        </div>
        <div class="info-item">
          <span class="label">Realname：</span>
          <span class="value">{{ userInfo.realname || '-' }}</span>
        </div>
      </div>
    </div>

    <div class="chart-container">
      <div ref="chartRef" class="chart" v-loading="chartLoading"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getUserDetail, getUserRatingChanges } from '../api/user'

const route = useRoute()
const loading = ref(false)
const chartLoading = ref(false)
const userInfo = ref(null)
const chartRef = ref(null)
let chartInstance = null

const fetchUserDetail = async () => {
  loading.value = true
  try {
    const res = await getUserDetail(route.params.id)
    userInfo.value = res.data
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

const fetchRatingChanges = async () => {
  chartLoading.value = true
  try {
    const res = await getUserRatingChanges(route.params.id)
    const changes = res.data || []

    if (chartInstance && chartRef.value) {
      // 按比赛ID排序
      const sortedChanges = [...changes].sort((a, b) => a.contestId - b.contestId)

      const xData = sortedChanges.map(item => `比赛 ${item.contestId}`)
      const yData = sortedChanges.map(item => item.newRating)

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const dataIndex = params[0].dataIndex
            const change = sortedChanges[dataIndex]
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${change.contestName || `比赛 ${change.contestId}`}</div>
                <div>排名：${change.rank !== undefined ? change.rank : '-'}</div>
                <div>Rating：${change.newRating}</div>
              </div>
            `
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
          name: '比赛',
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: 'Rating',
          nameLocation: 'middle',
          nameGap: 50
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            name: 'Rating',
            type: 'line',
            data: yData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 2
            },
            itemStyle: {
              color: '#409EFF'
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        ]
      }

      chartInstance.setOption(option)
    }
  } catch (error) {
    ElMessage.error('获取 Rating 变化数据失败')
  } finally {
    chartLoading.value = false
  }
}

const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    fetchRatingChanges()

    // 响应式调整
    window.addEventListener('resize', handleResize)
  }
}

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  fetchUserDetail()
  initChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.user-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  color: #303133;
}

.basic-info {
  margin-bottom: 32px;
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
}

.value {
  color: #303133;
}

.chart-container {
  width: 100%;
  height: 500px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
