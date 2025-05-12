import random

def generate_mp3():
    # MP3 file with a valid frame sync header and repetitive pattern
    header = b"\xFF\xFB"  # MP3 frame sync header
    body = b"\x00" * 1024  # Repetitive pattern for simplicity
    with open("random_file.mp3", "wb") as f:
        f.write(header + body)
    print("Generated random_file.mp3 (basic MP3-like file)")

def generate_mp4():
    # MP4 file with a minimal ftyp box
    header = b"\x00\x00\x00\x18\x66\x74\x79\x70\x69\x73\x6F\x6D"  # MP4 'ftyp' box
    body = b"\x00" * 2048  # Repetitive pattern for simplicity
    with open("random_file.mp4", "wb") as f:
        f.write(header + body)
    print("Generated random_file.mp4 (basic MP4-like file)")

def generate_png():
    # PNG file with a valid signature and simple pixel data
    header = b"\x89\x50\x4E\x47\x0D\x0A\x1A\x0A"  # PNG signature
    ihdr = (b"\x00\x00\x00\x0D\x49\x48\x44\x52"  # IHDR chunk
            b"\x00\x00\x00\x10\x00\x00\x00\x10"  # Width and height: 16x16
            b"\x08\x02\x00\x00\x00\x90\x77\x53\xDE")  # Bit depth, color type, etc.
    idat = b"\x00\x00\x00\x0A\x49\x44\x41\x54" + b"\x78\xDA" + b"\x00" * 10  # Simple compressed data
    iend = b"\x00\x00\x00\x00\x49\x45\x4E\x44\xAE\x42\x60\x82"  # IEND chunk
    with open("random_file.png", "wb") as f:
        f.write(header + ihdr + idat + iend)
    print("Generated random_file.png (basic PNG-like file)")

# Randomly choose a format
formats = [".mp3", ".mp4", ".png"]
chosen_format = random.choice(formats)

if chosen_format == ".mp3":
    generate_mp3()
elif chosen_format == ".mp4":
    generate_mp4()
elif chosen_format == ".png":
    generate_png()
