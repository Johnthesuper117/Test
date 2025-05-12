import os
import random

def generate_random_file(file_format):
    # Define headers for different formats
    headers = {
        ".mp3": b"\xFF\xFB",  # MP3 frame sync header
        ".mp4": b"\x00\x00\x00\x18\x66\x74\x79\x70\x69\x73\x6F\x6D",  # MP4 'ftyp' box
        ".png": b"\x89\x50\x4E\x47\x0D\x0A\x1A\x0A",  # PNG signature
    }

    # Get the header for the chosen format
    header = headers.get(file_format)
    if not header:
        raise ValueError(f"Unsupported file format: {file_format}")

    # Randomize the rest of the file content
    file_size = random.randint(1024, 10240)  # File size between 1 KB and 10 KB
    random_content = os.urandom(file_size - len(header))

    # Combine the header and random content
    binary_data = header + random_content

    # Save the file
    file_name = f"random_file{file_format}"
    with open(file_name, "wb") as f:
        f.write(binary_data)

    print(f"Generated {file_name} ({len(binary_data)} bytes)")

# Randomly choose a format
formats = [".mp3", ".mp4", ".png"]
chosen_format = random.choice(formats)
generate_random_file(chosen_format)