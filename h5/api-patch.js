// API补丁文件
// 用于在H5环境中处理API请求

(function() {
  // 判断是否在H5环境中
  if (typeof window === 'undefined' || !window.location || window.location.host.indexOf('vercel') === -1) {
    return;
  }

  // 保存原始的fetch函数
  const originalFetch = window.fetch;

  // 重写fetch函数
  window.fetch = async function(url, options = {}) {
    // 检查是否是API请求
    if (url.startsWith('https://xjeubhfwkdwt.sealoshzh.site/api')) {
      // 提取API路径
      const apiPath = url.replace('https://xjeubhfwkdwt.sealoshzh.site/api', '');
      
      // 构建新的URL
      const newUrl = `/api/proxy?url=/api${apiPath}`;
      
      console.log('API请求被重定向:', {
        originalUrl: url,
        newUrl: newUrl
      });
      
      // 使用新的URL发起请求
      return originalFetch(newUrl, options);
    }
    
    // 非API请求，使用原始fetch
    return originalFetch(url, options);
  };

  console.log('API补丁已加载');
})(); 