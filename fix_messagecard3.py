with open('frontend/src/components/Message/MessageCard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the escape function - single quotes don't need escaping in double-quoted HTML attributes
# Remove the broken single quote replacement line entirely
content = content.replace(
    "    .replace(/&/g, '&')\n    .replace(/\"/g, '\"')\n    .replace(/'/g, ''')\n    .replace(/</g, '<')\n    .replace(/>/g, '>')",
    "    .replace(/&/g, '&')\n    .replace(/\"/g, '\"')\n    .replace(/</g, '<')\n    .replace(/>/g, '>')"
)

with open('frontend/src/components/Message/MessageCard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed')