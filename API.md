# 课表查询系统 API 接口文档

## 概述
本文档详细说明课表查询系统的 API 接口设计，包括请求方式、请求参数和返回数据格式，方便前后端对接使用。

## 通用约定

### 响应格式
所有 API 返回数据均为 JSON 格式，包含以下通用字段：

- `success`: 布尔值，表示请求是否成功
- `data`: 请求成功时返回的数据（可能为数组或对象）
- `error`: 请求失败时的错误信息

### 错误码
当请求失败时，系统会返回相应的错误信息。常见错误情况：

- 认证失败：用户名或密码错误
- 会话过期：需要重新登录
- 网络异常：无法连接到教务系统
- 服务器错误：服务端异常

## API 接口

### 1. 获取课表信息

#### 接口说明
获取指定日期的课程安排信息。

#### 请求方法
`GET`

#### 请求路径
`/api/schedule`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| username | string | 是 | 学号/用户名 |
| password | string | 是 | 密码 |
| date | string | 否 | 查询日期，格式为 YYYY-MM-DD，如不提供则默认为当天 |
| loginOnly | boolean | 否 | 是否仅执行登录不获取课表，默认为 false |

#### 响应示例（成功）

```json
{
  "success": true,
  "data": [
    {
      "course": "高等数学",
      "time": "1-2节",
      "location": "文科楼A201",
      "startTime": "08:00",
      "endTime": "09:35",
      "date": "2023-09-15"
    },
    {
      "course": "大学英语",
      "time": "3-4节",
      "location": "外语楼203",
      "startTime": "09:55",
      "endTime": "11:30",
      "date": "2023-09-15"
    }
  ]
}
```

#### 响应示例（无课程）

```json
{
  "success": true,
  "data": []
}
```

#### 响应示例（失败）

```json
{
  "success": false,
  "error": "登录失败，请检查用户名和密码!"
}
```

```json
{
  "success": false,
  "error": "会话已过期，请重新登录"
}
```

### 2. 执行登录

#### 接口说明
仅执行登录操作，验证用户名和密码是否正确。

#### 请求方法
`POST`

#### 请求路径
`/api/login`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| username | string | 是 | 学号/用户名 |
| password | string | 是 | 密码 |

#### 响应示例（成功）

```json
{
  "success": true
}
```

#### 响应示例（失败）

```json
{
  "success": false,
  "error": "登录失败，请检查用户名和密码!"
}
```

## 数据结构

### 课程信息（Schedule）

课程信息对象包含以下字段：

| 字段名 | 类型 | 说明 |
|-------|------|-----|
| course | string | 课程名称 |
| time | string | 上课时间（第几节） |
| location | string | 上课地点 |
| startTime | string | 上课具体时间，如 "08:00" |
| endTime | string | 下课具体时间，如 "09:35" |
| date | string | 课程日期，格式为 YYYY-MM-DD |
| teacher | string | 教师姓名（可能不存在） |

## 使用示例

### 使用 axios 调用示例（前端）

```javascript
import axios from 'axios';

// 获取课表
async function getSchedule(username, password, date) {
  try {
    const response = await axios.get('/api/schedule', {
      params: {
        username,
        password,
        date
      }
    });
    
    if (response.data.success) {
      // 课表获取成功，处理数据
      console.log('课表数据:', response.data.data);
      return response.data.data;
    } else {
      // 显示错误信息
      console.error('获取课表失败:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('请求异常:', error);
    return null;
  }
}
```

### 使用 fetch 调用示例（前端）

```javascript
// 登录验证
async function login(username, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('登录成功!');
      return true;
    } else {
      console.error('登录失败:', data.error);
      return false;
    }
  } catch (error) {
    console.error('请求异常:', error);
    return false;
  }
}
``` 