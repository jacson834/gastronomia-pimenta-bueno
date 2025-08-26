document.addEventListener('DOMContentLoaded', () => {
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);

    const navLinks = $('.nav-links');
    const hero = $('.hero');
    const grid = $('.restaurants-grid');

    const setupEventListeners = () => {
        $('.menu-toggle')?.addEventListener('click', () => navLinks?.classList.toggle('active'));

        $('#scrollTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        document.addEventListener('click', e => {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const target = $(anchor.getAttribute('href'));
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks?.classList.remove('active');
            }
            const phoneLink = e.target.closest('.phone-link');
            if (phoneLink) {
                console.log('Contato clicado:', phoneLink.textContent.trim());
            }
        });

        window.addEventListener('scroll', () => {
            $('#scrollTop')?.classList.toggle('visible', window.pageYOffset > 300);
            if (hero) hero.style.transform = `translateY(${window.pageYOffset * -0.5}px)`;
        }, { passive: true });
    };

    const initAnimations = () => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        $$('.fade-in').forEach(el => observer.observe(el));

        const heroTitle = $('.hero h1');
        if (heroTitle?.textContent) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i++);
                    setTimeout(type, 75);
                }
            };
            setTimeout(type, 1000);
        }
    };

    const initContentFeatures = () => {
        if (!grid) return;
        const highlightsGrid = $('#highlights-grid');
        const allCards = Array.from(grid.children);

        if (highlightsGrid && allCards.length >= 3) {
            const selected = [...allCards].sort(() => 0.5 - Math.random()).slice(0, 3);
            highlightsGrid.innerHTML = '';
            selected.forEach(card => highlightsGrid.appendChild(card.cloneNode(true)));
        } else {
            $('#destaques')?.style.setProperty('display', 'none');
        }

        const searchInput = $('#search-input');
        const categoryFilters = $('.category-filters');
        if (!searchInput || !categoryFilters) return;

        let activeFilter = 'all';
        allCards.sort((a, b) => a.querySelector('.restaurant-name').textContent.localeCompare(b.querySelector('.restaurant-name').textContent, 'pt-BR'));
        
        grid.innerHTML = '';
        allCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(card);
        });

        const applyFilters = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            allCards.forEach(card => {
                const category = card.dataset.category || 'restaurante';
                const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
                const matchesFilter = activeFilter === 'all' || category === activeFilter;
                const matchesSearch = name.includes(searchTerm);
                card.style.display = (matchesFilter && matchesSearch) ? 'block' : 'none';
            });
        };

        categoryFilters.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            categoryFilters.querySelector('.active')?.classList.remove('active');
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilters();
        });
        
        searchInput.addEventListener('input', applyFilters);
    };

    setupEventListeners();
    initContentFeatures();
    initAnimations();
});