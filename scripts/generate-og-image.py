#!/usr/bin/env python3
"""生成漫藏 MIRU INDEX 的 Open Graph 分享图（1200x630）。"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH, HEIGHT = 1200, 630
BG = '#0a0a0a'
SEAL = '#d92020'
GOLD = '#c9a55c'
WASHI = '#f3ece0'
ASHI = '#8a7a68'

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'miru-app', 'public', 'og-image.png')

def draw_rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)

def main():
    img = Image.new('RGB', (WIDTH, HEIGHT), BG)

    # 背景氛围：左上角与右下角微光（RGBA 图层再合并）
    glow = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    for i in range(20):
        alpha = int(12 - i * 0.5)
        glow_draw.ellipse([-(200 + i * 15), -(200 + i * 15), 500 - i * 10, 500 - i * 10], fill=(217, 32, 32, alpha))
    for i in range(20):
        alpha = int(8 - i * 0.35)
        glow_draw.ellipse([WIDTH - 520 + i * 10, HEIGHT - 420 + i * 10, WIDTH + 200 + i * 15, HEIGHT + 200 + i * 15], fill=(201, 165, 92, alpha))
    img = Image.alpha_composite(img.convert('RGBA'), glow).convert('RGB')
    draw = ImageDraw.Draw(img)

    # 印章
    seal_size = 160
    seal_x, seal_y = 140, 235
    draw.rounded_rectangle([seal_x, seal_y, seal_x + seal_size, seal_size + seal_y], radius=24, fill=SEAL)
    draw.rounded_rectangle([seal_x + 12, seal_y + 12, seal_x + seal_size - 12, seal_y + seal_size - 12], radius=14, outline=WASHI, width=4)

    try:
        seal_font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc', 72)
    except Exception:
        seal_font = ImageFont.load_default()

    draw.text((seal_x + seal_size // 2, seal_y + 44), '漫', font=seal_font, fill=WASHI, anchor='mm')
    draw.text((seal_x + seal_size // 2, seal_y + seal_size - 48), '藏', font=seal_font, fill=WASHI, anchor='mm')

    # 标题
    try:
        title_font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc', 96)
        subtitle_font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 36)
        desc_font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 28)
        mono_font = ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', 22)
    except Exception:
        title_font = subtitle_font = desc_font = mono_font = ImageFont.load_default()

    draw.text((340, 215), '漫藏', font=title_font, fill=WASHI, anchor='lm')
    draw.text((540, 220), '· MIRU INDEX', font=subtitle_font, fill=GOLD, anchor='lm')

    # 描述
    draw.text((340, 300), 'ACGN 资源导航站', font=desc_font, fill=ASHI, anchor='lm')

    # 底部分类标签
    tags = ['网络代理', '下载器', 'AI 工具', '漫画', '番剧', 'GalGame', '轻小说']
    x = 340
    y = 380
    for tag in tags:
        bbox = draw.textbbox((0, 0), tag, font=mono_font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        pad_x, pad_y = 14, 8
        draw.rounded_rectangle([x, y, x + tw + pad_x * 2, y + th + pad_y * 2], radius=4, outline=SEAL, width=1)
        draw.text((x + pad_x, y + pad_y - 2), tag, font=mono_font, fill=WASHI, anchor='lm')
        x += tw + pad_x * 2 + 12

    # 底部装饰线
    draw.line([(340, 480), (820, 480)], fill=ASHI, width=1)
    draw.text((340, 510), '新和风杂志美学 · 精选资源索引', font=desc_font, fill=ASHI, anchor='lm')
    draw.text((340, 560), 'MS33834.github.io/miru-index', font=mono_font, fill=GOLD, anchor='lm')

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    img.save(OUT, 'PNG')
    print(f'✓ {OUT}')

if __name__ == '__main__':
    main()
