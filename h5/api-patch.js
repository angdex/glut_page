// API修复补丁
console.log('API修复补丁已加载');

// 强制在vercel环境下使用代理
window.__FORCE_USE_PROXY__ = true;

// 监听所有网络请求错误
window.addEventListener('error', function(event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT') {
    console.log('资源加载错误:', event.target.src);
  }
}, true);

// 替换fetch函数以捕获所有请求
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
  try {
    console.log('拦截到fetch请求:', url, options);
    
    // 检查是否是API请求
    if ((typeof url === 'string') && url.includes('/api/') && !url.includes('/api/proxy')) {
      console.log('拦截API请求并重定向到代理');
      // 修改URL使用代理
      const newUrl = '/api/proxy?url=' + encodeURIComponent(url.replace('https://xjeubhfwkdwt.sealoshzh.site/api', ''));
      console.log('重定向到:', newUrl);
      return originalFetch(newUrl, options);
    }
    
    return originalFetch(url, options);
  } catch (error) {
    console.error('fetch请求错误:', error);
    throw error;
  }
};

// 如果小程序环境中不存在AbortController，提供一个基本实现
if (typeof AbortController === 'undefined') {
  console.log('添加AbortController兼容实现');
  
  class AbortSignal {
    constructor() {
      this.aborted = false;
      this._listeners = [];
    }
    
    addEventListener(type, listener) {
      if (type === 'abort') {
        this._listeners.push(listener);
      }
    }
    
    removeEventListener(type, listener) {
      if (type === 'abort') {
        this._listeners = this._listeners.filter(l => l !== listener);
      }
    }
    
    dispatchEvent(event) {
      if (event.type === 'abort') {
        this.aborted = true;
        this._listeners.forEach(listener => listener(event));
      }
    }
  }
  
  class AbortController {
    constructor() {
      this.signal = new AbortSignal();
    }
    
    abort() {
      if (!this.signal.aborted) {
        this.signal.dispatchEvent({ type: 'abort' });
      }
    }
  }
  
  window.AbortController = AbortController;
  window.AbortSignal = AbortSignal;
}

console.log('API修复补丁已应用'); 