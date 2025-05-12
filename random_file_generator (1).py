from pydub.generators import Sine
from moviepy.editor import ColorClip
from PIL import Image
import random
import sys
import os

# Add the 'vendor' directory to the system path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "vendor"))

def generate_mp3():
    # Generate a 1-second sine wave audio and save as MP3
    sine = Sine(440).to_audio_segment(duration=1000)  # 1 second, 440 Hz
    sine.export("random_file.mp3", format="mp3")
    print("Generated random_file.mp3 (1 second sine wave)")

def generate_mp4():
    # Create a 1-second solid color video and save as MP4
    color = random.choices(range(256), k=3)  # Random RGB color
    clip = ColorClip(size=(320, 240), color=color, duration=1)  # 320x240, 1 second
    clip.write_videofile("random_file.mp4", fps=24)
    print("Generated random_file.mp4 (1 second solid color video)")

def generate_png():
    # Create a 100x100 random color image and save as PNG
    img = Image.new("RGB", (100, 100), tuple(random.choices(range(256), k=3)))
    img.save("random_file.png")
    print("Generated random_file.png (100x100 random color image)")

# Randomly choose a format
formats = [".mp3", ".mp4", ".png"]
chosen_format = random.choice(formats)

if chosen_format == ".mp3":
    generate_mp3()
elif chosen_format == ".mp4":
    generate_mp4()
elif chosen_format == ".png":
    generate_png()
