import io

# Read the file
with io.open('web/components/store/NiveauPage.tsx', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Normalize line endings to LF to avoid issues with CRLF matching
content_normalized = content.replace('\r\n', '\n')

# 1. State variables
target1 = "  const [filterOpen,       setFilterOpen]       = useState(false)"
replace1 = "  const [filterOpen,       setFilterOpen]       = useState(false)\n  const [sortOpen,         setSortOpen]         = useState(false)"

if target1 in content_normalized:
    content_normalized = content_normalized.replace(target1, replace1)
    print("Replace 1 (states) successful")
else:
    print("Replace 1 (states) failed: target1 not found")

# 2. Sort dropdown
if "Trier par :" in content_normalized:
    idx = content_normalized.find("Trier par :")
    start = content_normalized.rfind('<div className="flex items-center gap-2 text-sm">', 0, idx)
    end = content_normalized.find('</div>\n            </div>', idx)
    if end != -1:
        end += 24
    if start != -1 and end != -1 and start < end:
        target2_real = content_normalized[start:end]
        if target2_real.strip() != "":
            replace2 = """            <div className="flex items-center gap-2 text-sm">
              <label className="sort-label-custom font-medium hidden sm:block">Trier par :</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-semibold bg-white dark:bg-zinc-900 shadow-sm hover:border-red-300 dark:hover:border-red-900 transition-all duration-200 h-[38px] cursor-pointer"
                >
                  <span>
                    {sortBy === 'price_asc'
                      ? 'Prix croissant'
                      : sortBy === 'price_desc'
                      ? 'Prix décroissant'
                      : sortBy === 'newest'
                      ? 'Nouveautés'
                      : sortBy === 'popular'
                      ? 'Popularité'
                      : 'Par défaut'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
                </button>

                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-lg py-1.5 z-50 animate-fade-in-up">
                      {[
                        { value: 'default', label: 'Par défaut' },
                        { value: 'price_asc', label: 'Prix croissant' },
                        { value: 'price_desc', label: 'Prix décroissant' },
                        { value: 'newest', label: 'Nouveautés' },
                        { value: 'popular', label: 'Popularité' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value)
                            setSortOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                            sortBy === opt.value
                              ? 'text-red-600 bg-red-50/50 dark:bg-red-950/20'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-red-600" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>"""
            content_normalized = content_normalized.replace(target2_real, replace2)
            print("Replace 2 (sort dropdown) successful")
        else:
            print("Replace 2 failed: target2_real is empty")
    else:
        print(f"Replace 2 failed: start={start}, end={end}")
else:
    print("Replace 2 failed: 'Trier par :' not found")

# 3. Mobile drawer
idx_drawer = content_normalized.find("MOBILE FILTER DRAWER")
if idx_drawer != -1:
    start_draw = content_normalized.find("{filterOpen && (", idx_drawer)
    if start_draw == -1:
        start_draw = content_normalized.find("{filterOpen && (", idx_drawer - 100)
    end_draw = content_normalized.find("      )}", start_draw)
    if end_draw != -1:
        end_draw += 8
    if start_draw != -1 and end_draw != -1 and start_draw < end_draw:
        target3_real = content_normalized[start_draw:end_draw]
        if target3_real.strip() != "":
            replace3 = """{filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setFilterOpen(false)}
          />
          <div
            className="relative mr-auto h-full w-[310px] max-w-[85vw] flex flex-col shadow-2xl animate-slide-in-left"
            style={{ background: 'var(--bg)', borderRight: '1px solid var(--border)' }}
          >
            {/* Mobile drawer header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal style={{ width: '18px', height: '18px', color: '#ef233c' }} strokeWidth={2.2} />
                <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight">Filtres</span>
                {activeFilterCount > 0 && (
                  <span style={{
                    background: '#ef233c', color: '#fff', fontSize: '11px', fontWeight: 700,
                    minWidth: '20px', height: '20px', padding: '0 6px',
                    borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--bg2)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{ overflowY: 'auto', overscrollBehavior: 'contain', padding: '20px', flex: 1 }}>
              <FilterPanel {...filterProps} onApply={() => setFilterOpen(false)} />
            </div>
          </div>
        </div>
      )}"""
            content_normalized = content_normalized.replace(target3_real, replace3)
            print("Replace 3 (mobile drawer) successful")
        else:
            print("Replace 3 failed: target3_real is empty")
    else:
        print(f"Replace 3 failed: start_draw={start_draw}, end_draw={end_draw}")
else:
    print("Replace 3 failed: 'MOBILE FILTER DRAWER' not found")

# 4. Grid columns update & ProductCard prop map update
target_grid = """          ) : (
            <div className="products-grid">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))}
            </div>
          )}"""

target_grid_normalized = target_grid.replace('\r\n', '\n')

replace_grid = """          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-8 lg:gap-10">
              {filtered.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}"""

replace_grid_normalized = replace_grid.replace('\r\n', '\n')

if target_grid_normalized in content_normalized:
    content_normalized = content_normalized.replace(target_grid_normalized, replace_grid_normalized)
    print("Replace 4 (grid & mapping) successful")
else:
    print("Replace 4 (grid & mapping) failed: target_grid not found")

# 5. Background theme color on parent div
target_bg = '<div className="niveau-page">'
replace_bg = '<div className="niveau-page bg-white dark:bg-[#0a0a0a]">'
if target_bg in content_normalized:
    content_normalized = content_normalized.replace(target_bg, replace_bg)
    print("Replace 5 (background theme) successful")
else:
    print("Replace 5 (background theme) failed: niveau-page tag not found")

# Save file
with io.open('web/components/store/NiveauPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content_normalized)
print("Saved successfully")
