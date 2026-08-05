const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const opened = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(element => {
  revealObserver.observe(element);
});

const projectsGrid = document.getElementById('projects-grid');

const escapeHtml = value =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

async function loadRepositories() {
  if (!projectsGrid) return;

  try {
    const response = await fetch(
      'https://api.github.com/users/leopedroso84/repos?sort=updated&per_page=100',
      { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (!response.ok) {
      throw new Error(`GitHub API: ${response.status}`);
    }

    const repositories = await response.json();

    const selected = repositories
      .filter(repo => !repo.fork && repo.name !== 'leopedroso84.github.io')
      .slice(0, 6);

    if (!selected.length) {
      throw new Error('Nenhum repositório público encontrado.');
    }

    projectsGrid.innerHTML = selected.map(repo => {
      const description = repo.description || 'Projeto e conteúdo técnico publicado no GitHub.';
      const language = repo.language || 'Projeto';
      const updated = new Intl.DateTimeFormat('pt-BR', {
        month: 'short',
        year: 'numeric'
      }).format(new Date(repo.updated_at));

      return `
        <article class="project-card reveal visible">
          <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">
            <span class="project-icon">⌁</span>
            <h3>${escapeHtml(repo.name)}</h3>
            <p>${escapeHtml(description)}</p>
            <div class="project-meta">
              <span>${escapeHtml(language)}</span>
              <span>Atualizado em ${escapeHtml(updated)}</span>
            </div>
          </a>
        </article>
      `;
    }).join('');
  } catch (error) {
    projectsGrid.innerHTML = `
      <article class="project-card reveal visible">
        <a href="https://github.com/leopedroso84?tab=repositories" target="_blank" rel="noopener noreferrer">
          <span class="project-icon">⌁</span>
          <h3>Repositórios no GitHub</h3>
          <p>Não foi possível carregar a lista automaticamente neste momento. Acesse o perfil para visualizar os projetos publicados.</p>
          <div class="project-meta">
            <span>GitHub</span>
            <span>Abrir perfil</span>
          </div>
        </a>
      </article>
    `;
    console.warn(error);
  }
}

loadRepositories();
