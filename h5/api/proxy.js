// Vercel Serverless Function
// 用于代理API请求，解决跨域问题

module.exports = async (req, res) => {
  // 记录请求信息
  console.log('API代理收到请求:', {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body
  });

  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  const { url } = req.query;
  
  if (!url) {
    console.error('URL参数缺失');
    return res.status(400).json({ 
      success: false,
      error: 'URL参数缺失' 
    });
  }

  const targetUrl = `https://xjeubhfwkdwt.sealoshzh.site${url}`;
  console.log('转发请求到:', targetUrl);
  
  try {
    const fetch = require('node-fetch');
    
    // 构建请求头
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // 获取请求体
    let body = undefined;
    if (req.method !== 'GET' && req.body) {
      body = JSON.stringify(req.body);
      console.log('请求体:', body);
    }
    
    let fetchOptions = {
      method: req.method,
      headers,
      body
    };
    
    // 使用node-fetch版本2.x的超时设置方法
    const timeout = 30000; // 30秒超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    fetchOptions.signal = controller.signal;
      
    console.log('发送请求选项:', fetchOptions);
    
    const response = await fetch(targetUrl, fetchOptions);
    clearTimeout(timeoutId);
    
    console.log('服务器响应状态:', response.status);
    
    // 获取响应内容
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('服务器响应数据类型: JSON');
    } else {
      const text = await response.text();
      console.log('服务器响应文本长度:', text.length);
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { success: false, error: '服务器响应不是有效的JSON', text };
      }
    }
    
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('代理请求出错:', error.message);
    
    // 特殊处理AbortError
    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        success: false,
        error: '请求超时，服务器响应时间过长' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: '请求失败', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};