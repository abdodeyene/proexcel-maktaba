import io

with io.open('web/components/store/NiveauPage.tsx', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

content = content.replace('\r\n', '\n')
idx_drawer = content.find('MOBILE FILTER DRAWER')
start_draw = content.find('{filterOpen && (', idx_drawer)
print('idx_drawer:', idx_drawer)
print('start_draw:', start_draw)

# Find first occurrence of "      )}" after start_draw
pos = content.find('      )}', start_draw)
print('First occurrence of "      )}" after start_draw is at:', pos)
if pos != -1:
    print('Snippet at pos:')
    print(repr(content[pos:pos+100]))
    print('---')
    print('Snippet of content[start_draw:pos+8]:')
    print(content[start_draw:pos+8])
