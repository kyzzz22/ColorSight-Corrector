#!/usr/bin/env python3
"""
创建最简单的有效 PNG 图标
"""

from PIL import Image, ImageDraw
import os

def create_simple_icon(size):
    """创建最简单的图标"""
    # 使用 RGB 模式，不透明背景
    img = Image.new('RGB', (size, size), (76, 175, 80))  # 绿色背景
    draw = ImageDraw.Draw(img)
    
    # 绘制一个简单的圆形
    margin = max(1, size // 8)
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        fill=(76, 175, 80),
        outline=(255, 255, 255),
        width=max(1, size // 16)
    )
    
    return img

def main():
    sizes = [16, 48, 128]
    icons_dir = 'icons'
    
    os.makedirs(icons_dir, exist_ok=True)
    
    print("正在创建简单图标...")
    for size in sizes:
        icon = create_simple_icon(size)
        filename = os.path.join(icons_dir, f'icon{size}.png')
        # 保存为 PNG，不使用优化以确保兼容性
        icon.save(filename, 'PNG')
        
        # 验证文件
        verify_img = Image.open(filename)
        verify_img.verify()
        print(f"✓ {filename} ({size}x{size}, {os.path.getsize(filename)} bytes) - 验证通过")

if __name__ == '__main__':
    main()

