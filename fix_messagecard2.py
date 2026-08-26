with open('frontend/src/components/Message/MessageCard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken single quote with proper HTML entity
# Current: .replace(/'/g, ')  -> bytes: 0x27 0x29
# Should be: .replace(/'/g, ''')
content = content.replace(".replace(/'/g, ')", ".replace(/'/g, ''')")

with open('frontend/src/components/Message/MessageCard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed')