// Frame-busting：CSP frame-ancestors 在 <meta> 中被浏览器忽略（规范要求 HTTP 头），
// GitHub Pages 无法下发自定义响应头，用同步脚本兜底防点击劫持。
// 必须同步执行（非 module），在页面渲染前跳出 iframe。
if (self !== top) {
  try {
    top.location.href = self.location.href
  } catch (e) {
    // sandbox iframe（无 allow-top-navigation）会抛错：隐藏内容兜底，防止点击劫持展示
    document.documentElement.style.display = 'none'
  }
}
