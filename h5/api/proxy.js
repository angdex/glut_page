// Vercel Serverless Function
// 用于代理API请求，解决跨域问题

module.exports = async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL参数缺失' });
  }

  const targetUrl = `https://xjeubhfwkdwt.sealoshzh.site${url}`;
  
  try {
    const fetch = require('node-fetch');
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    
    const data = await response.json();
    
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: '请求失败', 
      message: error.message 
    });
  }
}; 