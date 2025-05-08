<template>
  <div class="schedule-container">
    <el-card class="schedule-card">
      <template #header>
        <div class="schedule-header">
          <h2>课表查询</h2>
          <el-button @click="handleLogout" type="text">
            <el-icon><SwitchButton /></el-icon> 退出登录
          </el-button>
        </div>
      </template>
      
      <div class="date-selector">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled="loading"
          @change="loadSchedule"
        />
      </div>
      
      <el-empty
        v-if="!loading && (!scheduleData || scheduleData.length === 0)"
        description="当天没有课程安排"
      />
      
      <div v-else class="schedule-list">
        <el-card
          v-for="(course, index) in scheduleData"
          :key="index"
          class="course-card"
          shadow="hover"
        >
          <div class="course-header">
            <h3>{{ course.course }}</h3>
            <el-tag size="small" type="success">{{ course.time }}</el-tag>
          </div>
          
          <div class="course-info">
            <p>
              <el-icon><Timer /></el-icon>
              {{ course.startTime }} - {{ course.endTime }}
            </p>
            <p>
              <el-icon><Location /></el-icon>
              {{ course.location }}
            </p>
            <p v-if="course.teacher">
              <el-icon><User /></el-icon>
              {{ course.teacher }}
            </p>
          </div>
        </el-card>
      </div>
      
      <el-backtop :right="20" :bottom="20" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Timer, Location, User, SwitchButton } from '@element-plus/icons-vue'

interface Course {
  course: string
  time: string
  location: string
  startTime: string
  endTime: string
  date: string
  teacher?: string
}

const router = useRouter()
const loading = ref(false)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const scheduleData = ref<Course[]>([])

const loadSchedule = async () => {
  const username = localStorage.getItem('username')
  const password = localStorage.getItem('password')
  
  if (!username || !password) {
    ElMessage.error('登录信息已失效，请重新登录')
    router.push('/login')
    return
  }
  
  try {
    loading.value = true
    const response = await fetch(`https://xjeubhfwkdwt.sealoshzh.site/api/schedule?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&date=${selectedDate.value}`)
    const data = await response.json()
    
    if (data.success) {
      scheduleData.value = data.data
    } else {
      ElMessage.error(data.error || '获取课表失败')
      if (data.error?.includes('登录')) {
        router.push('/login')
      }
    }
  } catch (error) {
    console.error('获取课表失败:', error)
    ElMessage.error('网络异常，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('username')
  localStorage.removeItem('password')
  router.push('/login')
}

onMounted(() => {
  loadSchedule()
})
</script>

<style scoped>
.schedule-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.schedule-card {
  max-width: 800px;
  margin: 0 auto;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schedule-header h2 {
  margin: 0;
  color: #409eff;
}

.date-selector {
  margin-bottom: 20px;
  text-align: center;
}

.schedule-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.course-card {
  transition: all 0.3s;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.course-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.course-info {
  color: #606266;
}

.course-info p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.course-info .el-icon {
  color: #909399;
}
</style>