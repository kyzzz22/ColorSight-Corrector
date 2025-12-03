#!/usr/bin/env python3
"""
生成 Chrome 扩展图标
创建一个简单的色彩校正图标（眼睛+调色板）
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("需要安装 Pillow 库: pip install Pillow")
    exit(1)

def create_icon(size):
    """创建指定尺寸的图标"""
    # 创建 RGB 模式图像（Chrome 扩展更兼容 RGB）
    img = Image.new('RGB', (size, size), (76, 175, 80))  # 绿色背景
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    radius = size // 2 - 1
    
    # 绘制背景圆形
    draw.ellipse(
        [1, 1, size - 1, size - 1],
        fill=(76, 175, 80),  # 绿色
        outline=(255, 255, 255),
        width=max(1, size // 16)
    )
    
    # 绘制眼睛形状（简化版）
    if size >= 16:
        eye_width = max(4, size // 3)
        eye_height = max(3, size // 4)
        eye_x = center - eye_width // 2
        eye_y = center - eye_height // 2 - size // 12
        
        # 眼睛轮廓
        draw.ellipse(
            [eye_x, eye_y, eye_x + eye_width, eye_y + eye_height],
            outline=(255, 255, 255),
            width=max(1, size // 16)
        )
        
        # 眼球
        pupil_size = max(2, eye_width // 3)
        draw.ellipse(
            [center - pupil_size // 2, center - size // 12 - pupil_size // 2,
             center + pupil_size // 2, center - size // 12 + pupil_size // 2],
            fill=(255, 255, 255)
        )
    
    # 绘制调色板（简化版，在眼睛下方）
    if size >= 16:
        palette_y = center + size // 8
        palette_size = max(3, size // 4)
        
        # 调色板形状（圆形）
        draw.ellipse(
            [center - palette_size // 2, palette_y - palette_size // 2,
             center + palette_size // 2, palette_y + palette_size // 2],
            fill=(255, 193, 7)  # 黄色
        )
        
        # 调色板上的颜色点（仅当尺寸足够大时）
        if size >= 32:
            dot_size = max(2, size // 16)
            # 红色点
            draw.ellipse(
                [center - palette_size // 3, palette_y - palette_size // 4,
                 center - palette_size // 3 + dot_size, palette_y - palette_size // 4 + dot_size],
                fill=(244, 67, 54)
            )
            # 绿色点
            draw.ellipse(
                [center, palette_y - palette_size // 4,
                 center + dot_size, palette_y - palette_size // 4 + dot_size],
                fill=(76, 175, 80)
            )
            # 蓝色点
            draw.ellipse(
                [center - palette_size // 6, palette_y + palette_size // 6,
                 center - palette_size // 6 + dot_size, palette_y + palette_size // 6 + dot_size],
                fill=(33, 150, 243)
            )
    
    return img

def main():
    """生成所有尺寸的图标"""
    sizes = [16, 48, 128]
    icons_dir = 'icons'
    
    # 确保 icons 目录存在
    os.makedirs(icons_dir, exist_ok=True)
    
    print("正在生成图标...")
    for size in sizes:
        icon = create_icon(size)
        filename = os.path.join(icons_dir, f'icon{size}.png')
        # 确保保存为有效的 PNG 格式
        icon.save(filename, 'PNG', optimize=True)
        print(f"✓ 已创建 {filename} ({size}x{size})")
    
    print("\n所有图标生成完成！")

if __name__ == '__main__':
    main()

