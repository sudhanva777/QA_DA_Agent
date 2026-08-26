with open('frontend/src/components/Message/MessageCard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace three single quotes with HTML entity for apostrophe
content = content.replace("'''", "'")

with open('frontend/src/components/Message/MessageCard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed')