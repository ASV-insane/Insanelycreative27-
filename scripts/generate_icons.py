import zlib
import struct
import math

def create_png(filename, size, is_maskable=False):
    width = size
    height = size
    raw_data = bytearray()
    
    center_x = width / 2.0
    center_y = height / 2.0
    radius = width * (0.35 if is_maskable else 0.42)
    
    for y in range(height):
        raw_data.append(0) # Filter byte: None
        for x in range(width):
            dx = abs(x - center_x)
            dy = abs(y - center_y)
            dist = math.sqrt(dx*dx + dy*dy)
            
            # Corner distance for rounded rect
            box_w = width * (0.35 if is_maskable else 0.40)
            box_h = height * (0.35 if is_maskable else 0.40)
            rx = max(0, dx - box_w + radius * 0.3)
            ry = max(0, dy - box_h + radius * 0.3)
            corner_dist = math.sqrt(rx*rx + ry*ry)
            
            # Background
            bg_r, bg_g, bg_b, bg_a = 12, 13, 20, 255
            
            # Check emblem boundary
            in_rect = dx <= box_w and dy <= box_h
            if in_rect and corner_dist <= (radius * 0.3):
                # Gradient amber to orange
                t = (x + y) / (width + height)
                r = int(251 * (1 - t) + 234 * t)
                g = int(191 * (1 - t) + 88 * t)
                b = int(36 * (1 - t) + 12 * t)
                a = 255
                
                # Simple number '2' and '7' shapes in the center
                # Left digit '2'
                nx = (x - center_x) / (width * 0.5)
                ny = (y - center_y) / (height * 0.5)
                
                is_digit = False
                # 2: top bar, upper right, diag, bottom bar
                if -0.45 <= nx <= -0.1:
                    if (0.20 <= ny <= 0.32) or (-0.32 <= ny <= -0.20):
                        is_digit = True
                    elif -0.32 <= ny <= 0.0 and -0.22 <= nx <= -0.1:
                        is_digit = True
                    elif 0.0 <= ny <= 0.20 and -0.45 <= nx <= -0.32:
                        is_digit = True
                    elif abs(nx - (-0.1 - (ny + 0.1) * 0.8)) < 0.08 and -0.1 <= ny <= 0.20:
                        is_digit = True

                # 7: top bar, diagonal
                if 0.05 <= nx <= 0.42:
                    if -0.32 <= ny <= -0.20:
                        is_digit = True
                    elif abs(nx - (0.42 - (ny + 0.3) * 0.55)) < 0.08 and -0.20 <= ny <= 0.32:
                        is_digit = True
                        
                if is_digit:
                    raw_data.extend([10, 10, 15, 255])
                else:
                    raw_data.extend([r, g, b, a])
            else:
                raw_data.extend([bg_r, bg_g, bg_b, bg_a])

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    compressed = zlib.compress(bytes(raw_data), 9)

    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(png)

create_png('public/pwa-192x192.png', 192)
create_png('public/pwa-512x512.png', 512)
create_png('public/pwa-maskable-512x512.png', 512, is_maskable=True)
create_png('public/apple-touch-icon.png', 180)
print('PWA Icons generated successfully')
