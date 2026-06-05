const fs = require('fs');
const path = require('path');

const bestOffersPath = path.join('c:', 'Users', 'abdd6', 'OneDrive', 'Bureau', 'sas', 'web', 'app', '(store)', 'best-offers', 'BestOffersClient.tsx');
let content = fs.readFileSync(bestOffersPath, 'utf8');

// 1. Replace CheckRow
content = content.replace(/function CheckRow\(\{[\s\S]*?className=\{`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md transition-all duration-\[180ms\] border-2[\s\S]*?\}\)[\s\S]*?\}[\s\S]*?\}/, `function CheckRow({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={\`flex items-center gap-3 rounded-[14px] px-3 py-2.5 mb-1.5 cursor-pointer select-none transition-all duration-200 border filter-check-row \${selected ? 'selected' : ''}\`}
    >
      <div className="filter-checkbox flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200 border-2">
        {selected && (
          <Check style={{ width: '11px', height: '11px', color: '#fff', strokeWidth: 3 }} />
        )}
      </div>
      {children}
    </div>
  )
}`);

// 2. Replace "Filtres" span
content = content.replace(/<span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">Filtres<\/span>/, '<span className="filter-title">Filtres</span>');

// 3. Replace Search Input
content = content.replace(/className="w-full h-12 pl-11 text-sm font-medium rounded-xl outline-none transition-all duration-150 border-\[1.5px\] border-slate-200 bg-\[#f8fafc\] text-slate-800 focus:border-\[#ef233c\] focus:bg-white focus:ring-4 focus:ring-\[#ef233c\]\/10 dark:border-slate-700\/60 dark:bg-slate-800\/50 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:border-\[#ef233c\]"/, 'className="filter-search-input"');

// 4. Replace Category Thumb
content = content.replace(/<div className="w-\[34px\] h-\[34px\] rounded-\[10px\] shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">/, '<div className="filter-cat-thumb flex items-center justify-center shrink-0 w-[34px] h-[34px] rounded-[10px] overflow-hidden">');

// 5. Replace Category Name
content = content.replace(/<span className=\{`text-\[15px\] font-bold flex-1 truncate transition-colors duration-150 \$\{selected \? 'text-red-600 dark:text-red-500' : 'text-slate-800 dark:text-slate-200'\}`\}>/, '<span className="filter-cat-name text-[15px] font-bold flex-1 truncate transition-colors duration-150">');

// 6. Replace Category Count
content = content.replace(/<span className=\{`text-\[12px\] shrink-0 \$\{selected \? 'text-red-600 dark:text-red-500' : 'text-slate-400 dark:text-slate-500'\}`\}>/g, '<span className="filter-cat-count text-[12px] shrink-0 transition-colors duration-150">');

// 7. Replace Price Inputs
content = content.replace(/className="flex-1 h-11 px-2 text-center text-sm font-bold rounded-xl outline-none transition-all duration-150 border-\[1.5px\] border-slate-200 bg-\[#f8fafc\] text-slate-800 focus:border-\[#ef233c\] focus:bg-white dark:border-slate-700\/60 dark:bg-slate-800\/50 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:border-\[#ef233c\]"/g, 'className="filter-price-input flex-1 h-11 px-2 text-center text-sm font-bold rounded-xl outline-none transition-all duration-150 border-[1.5px]"');

// 8. Replace Availability Name
content = content.replace(/<span className=\{`text-\[15px\] font-bold transition-colors duration-150 \$\{opt\.value \? 'text-red-600 dark:text-red-500' : 'text-slate-800 dark:text-slate-200'\}`\}>/g, '<span className="filter-cat-name text-[15px] font-bold transition-colors duration-150">');

fs.writeFileSync(bestOffersPath, content, 'utf8');

const globalsPath = path.join('c:', 'Users', 'abdd6', 'OneDrive', 'Bureau', 'sas', 'web', 'app', 'globals.css');
let globalsCSS = fs.readFileSync(globalsPath, 'utf8');

// Cart CSS replacement
globalsCSS = globalsCSS.replace(/@media\(max-width: 640px\) \{\s*\.cart-item \{\s*flex-direction: column;\s*align-items: flex-start;\s*gap: 0\.75rem;\s*position: relative;\s*\}\s*\.ci-controls \{\s*width: 100%;\s*justify-content: space-between;\s*margin-top: 0\.5rem;\s*\}\s*\.ci-remove \{\s*position: absolute;\s*top: 0\.5rem;\s*right: 0\.5rem;\s*\}\s*\.ci-img \{\s*width: 50px;\s*height: 65px;\s*\}\s*\.ci-title \{\s*padding-right: 2rem;\s*\}\s*\}/, `@media(max-width: 640px) {
  .cart-item {
    display: grid;
    grid-template-columns: 50px 1fr;
    gap: 0.5rem 1rem;
    position: relative;
    padding: 1rem;
  }
  .ci-img {
    grid-column: 1;
    grid-row: 1;
    width: 50px;
    height: 65px;
  }
  .ci-details {
    grid-column: 2;
    grid-row: 1;
    padding-right: 1.5rem;
  }
  .ci-controls {
    grid-column: 1 / 3;
    grid-row: 2;
    width: 100%;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
  .ci-remove {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
  }
}`);

const filterCSS = `
/* Filter Panel Custom Styling for Light/Dark Mode (OS independent) */
.filter-title {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.01em;
  color: var(--text);
}
.filter-search-input, .filter-price-input {
  width: 100%; height: 48px; box-sizing: border-box;
  font-size: 14px; font-weight: 500;
  border-color: var(--border);
  background: var(--bg);
  color: var(--text);
}
.filter-search-input:focus, .filter-price-input:focus {
  border-color: #ef233c;
  background: var(--card);
  box-shadow: 0 0 0 3px rgba(239,35,60,0.1);
}
.filter-check-row {
  border-color: transparent;
}
.filter-check-row:not(.selected):hover {
  background: rgba(0,0,0,0.03);
}
[data-theme="dark"] .filter-check-row:not(.selected):hover {
  background: rgba(255,255,255,0.04);
}
.filter-check-row.selected {
  background: #fff1f2;
  border-color: #fecdd3;
}
[data-theme="dark"] .filter-check-row.selected {
  background: rgba(239, 35, 60, 0.1);
  border-color: rgba(239, 35, 60, 0.2);
}
.filter-checkbox {
  border-color: var(--border);
  background: var(--card);
}
.filter-check-row.selected .filter-checkbox {
  border-color: #ef233c;
  background: #ef233c;
}
.filter-cat-thumb {
  background: var(--bg);
  border-color: var(--border);
}
.filter-cat-name {
  color: var(--text);
}
.filter-check-row.selected .filter-cat-name {
  color: #dc2626;
}
[data-theme="dark"] .filter-check-row.selected .filter-cat-name {
  color: #ef4444;
}
.filter-cat-count {
  color: var(--text2);
}
.filter-check-row.selected .filter-cat-count {
  color: #dc2626;
}
[data-theme="dark"] .filter-check-row.selected .filter-cat-count {
  color: #ef4444;
}

/* Products Grid spacing */
.products-grid {
  margin-top: 1.5rem;
}
`;

if (!globalsCSS.includes('.filter-title {')) {
  globalsCSS += '\\n' + filterCSS;
}

fs.writeFileSync(globalsPath, globalsCSS, 'utf8');
console.log('Filters updated and CSS applied.');
