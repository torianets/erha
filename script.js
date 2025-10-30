let chapters = [];
let current = 0;

const contentDiv = document.getElementById('chapter-content');
const select = document.getElementById('chapter-select');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

async function init() {
  try {
    const res = await fetch('chapters.json');
    chapters = await res.json();
    populateSelect();
    loadChapter(0);
  } catch (e) {
    contentDiv.innerHTML = '<p>Не удалось загрузить список глав.</p>';
    console.error(e);
  }
}

function populateSelect() {
  select.innerHTML = '';
  chapters.forEach((ch, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = ch.title;
    select.appendChild(opt);
  });
}

async function loadChapter(index) {
  if (!chapters[index]) return;
  current = index;
  updateButtons();

  try {
    const res = await fetch(chapters[index].file);
    if (!res.ok) throw new Error('Не удалось загрузить файл главы');
    const text = await res.text();

    const lines = text
      .replace(/\r/g, '') 
      .trim()
      .split(/\n\s*\n/);

  
    const formatted = lines
      .map(p => {
        if (p.startsWith('# ')) {
          return `<h2>${p.replace(/^#\s*/, '')}</h2>`;
        } else {
          return `<p>${p.replace(/\n/g, ' ').trim()}</p>`;
        }
      })
      .join('\n');

    contentDiv.innerHTML = formatted;
    select.value = index;
    window.scrollTo({ top: 0, behavior: 'instant' });
  } catch (err) {
    contentDiv.innerHTML = '<p>Ошибка при загрузке главы.</p>';
    console.error(err);
  }
}

function updateButtons() {
  prevBtn.disabled = current <= 0;
  nextBtn.disabled = current >= chapters.length - 1;
}

prevBtn.addEventListener('click', () => {
  if (current > 0) loadChapter(current - 1);
});

nextBtn.addEventListener('click', () => {
  if (current < chapters.length - 1) loadChapter(current + 1);
});

select.addEventListener('change', (e) => loadChapter(Number(e.target.value)));

init();
