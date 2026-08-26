with open('frontend/src/components/Message/MessageCard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the problematic line
idx = content.index("replace(/'/g")
print("Found at:", idx)
print("Context:", repr(content[idx:idx+50]))
print("Bytes:", [hex(ord(c)) for c in content[idx:idx+50]])