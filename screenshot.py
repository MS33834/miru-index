from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    
    # 访问首页
    page.goto('http://localhost:5173/miru-index/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)  # 等待动画完成
    
    # 截图首页
    page.screenshot(path='/tmp/homepage-desktop.png', full_page=True)
    print('✓ 首页桌面端截图完成')
    
    # 截图移动端
    page.set_viewport_size({'width': 375, 'height': 667})
    page.wait_for_timeout(500)
    page.screenshot(path='/tmp/homepage-mobile.png', full_page=True)
    print('✓ 首页移动端截图完成')
    
    # 截图平板端
    page.set_viewport_size({'width': 768, 'height': 1024})
    page.wait_for_timeout(500)
    page.screenshot(path='/tmp/homepage-tablet.png', full_page=True)
    print('✓ 首页平板端截图完成')
    
    browser.close()
