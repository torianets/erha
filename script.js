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

    // Убираем пробелы и разбиваем по строкам
    const lines = text.replace(/\r/g, '').trim().split('\n');

    let html = '';
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('# ')) {
        html += `<h2>${line.replace(/^#\s*/, '')}</h2>`;
      } else if (line === '') {
        html += '<br>'; // пустая строка = визуальный отступ
      } else {
        html += `<p>${line}</p>`;
      }
    }

    contentDiv.innerHTML = html;
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
