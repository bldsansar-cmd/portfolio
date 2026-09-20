let navSection, mobileNavSection;
let aboutSection, experienceSection, projectsSection;
let navInnerHtml, mobileHeaderHeight;

let currentLang = localStorage.getItem('lang') === 'ja' ? 'ja' : 'en';
const contentCache = {};

const socialLinks = [{
		icon: 'fa-facebook-f',
		label: 'Facebook'
	},
	{
		icon: 'fa-twitter',
		label: 'Twitter'
	},
	{
		icon: 'fa-instagram',
		label: 'Instagram'
	},
	{
		icon: 'fa-youtube',
		label: 'Youtube'
	},
];

async function loadPage() {
	navSection = document.querySelector('nav');
	mobileNavSection = document.querySelector('.mobile_header');

	aboutSection = document.getElementById('about');
	experienceSection = document.getElementById('experience');
	projectsSection = document.getElementById('projects');

	mobileHeaderHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile_header_height'));

	renderSocialButtons();
	await setLanguage(currentLang);

	document.addEventListener('scroll', scrolling);
	window.addEventListener('resize', setMobileNavSection);
	document.addEventListener('click', openCardLink);
}

async function loadContent(lang) {
	if (!contentCache[lang]) {
		const response = await fetch(`content.${lang}.json`);
		contentCache[lang] = await response.json();
	}
	return contentCache[lang];
}

async function setLanguage(lang) {
	const content = await loadContent(lang);
	currentLang = lang;
	localStorage.setItem('lang', lang);
	document.documentElement.lang = lang;
	renderPage(content);
}

function renderPage(content) {
	document.getElementById('tagline').textContent = content.tagline;
	document.getElementById('intro').textContent = content.intro;

	document.getElementById('about_title').textContent = content.sectionTitles.about;
	document.getElementById('experience_title').textContent = content.sectionTitles.experience;
	document.getElementById('resume_download').textContent = content.downloadLabel;
	document.getElementById('projects_title').textContent = content.sectionTitles.projects;

	document.getElementById('about_content').innerHTML = content.aboutData
		.map(paragraph => `<p>${paragraph}</p>`).join('');

	document.getElementById('footer_text').innerHTML =
		`${content.footerData} <a href="https://github.com/bldsansar-cmd/portfolio" target="_blank" rel="noopener noreferrer">GitHub</a>`;

	experienceSection.querySelectorAll('.sub_section.flexbox').forEach(el => el.remove());
	projectsSection.querySelectorAll('.sub_section_hoverable').forEach(el => el.remove());
	renderCards(experienceSection, content.experienceData, 'sub_section flexbox');
	renderCards(projectsSection, content.projectsData, 'sub_section_hoverable');

	navInnerHtml = buildNavHtml(content);
	navSection.innerHTML = '';
	mobileNavSection.innerHTML = '';
	setMobileNavSection();
}

function buildNavHtml(content) {
	const otherLang = currentLang === 'en' ? 'ja' : 'en';
	const switchLabel = otherLang === 'ja' ? '日本語' : 'en';
	return `
		<ul class="flexbox">
			<li><a href="javascript:scrollToElm('about');" class="nav_link" id="nav_about">${content.nav.about}</a></li>
			<li><a href="javascript:scrollToElm('experience');" class="nav_link" id="nav_experience">${content.nav.experience}</a></li>
			<li><a href="javascript:scrollToElm('projects');" class="nav_link" id="nav_projects">${content.nav.projects}</a></li>
			<li><a href="javascript:setLanguage('${otherLang}');" class="lang_link" id="lang_switch">${switchLabel}</a></li>
		</ul>
	`;
}

function renderSocialButtons() {
	const container = document.querySelector('.social_buttons');
	if (!container) return;
	container.innerHTML = socialLinks.map(({
		icon,
		label
	}) => `
		<div class="social_button">
			<div class="icon"><i class="fab ${icon}"></i></div>
			<span>${label}</span>
		</div>
	`).join('');
}

function renderCards(section, items, wrapperClass) {
	section.insertAdjacentHTML('beforeend', items.map(item => `
		<div class="${wrapperClass}"${item.link ? ` data-link="${item.link}"` : ''}>
			<div class="sub_section_item">${item.period || ''}</div>
			<div class="sub_section_content flexbox">
				<h3 class="sub_section_title">${item.title}</h3>
				<div class="sub_section_detail">${item.detail}</div>
				<div class="sub_section_tags flexbox">${renderTags(item.tags)}</div>
				${item.link ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer" class="project_link">GitHub</a>` : ''}
			</div>
		</div>
	`).join(''));
}

function openCardLink(event) {
	if (event.target.closest('a')) return;
	const card = event.target.closest('[data-link]');
	if (!card) return;
	window.open(card.dataset.link, '_blank', 'noopener,noreferrer');
}

function renderTags(tags) {
	return tags.map(tag => `<div class="tag">${tag}</div>`).join('');
}

function setMobileNavSection() {
	if (!aboutSection || !mobileNavSection || !navSection) return;

	const isMobile = window.innerWidth <= 900;
	const scrolled = window.scrollY >= aboutSection.offsetTop - mobileHeaderHeight;

	if (isMobile && scrolled) {
		mobileNavSection.style.display = 'flex';
		if (mobileNavSection.innerHTML.trim() === '') {
			mobileNavSection.innerHTML = navInnerHtml;
		}
		navSection.innerHTML = '';
	} else {
		mobileNavSection.style.display = 'none';
		mobileNavSection.innerHTML = '';
		if (navSection.innerHTML.trim() === '') {
			navSection.innerHTML = navInnerHtml;
		}
	}
}

function scrolling() {
	setMobileNavSection();
	const currentNav = window.getComputedStyle(mobileNavSection).display === 'flex' ?
		mobileNavSection :
		navSection;

	const navLinks = {
		about: currentNav.querySelector('#nav_about'),
		experience: currentNav.querySelector('#nav_experience'),
		projects: currentNav.querySelector('#nav_projects')
	};
	if (!navLinks.about || !navLinks.experience || !navLinks.projects) return;

	Object.values(navLinks).forEach(a => a.classList.remove('selected'));
	const scrollY = window.scrollY + mobileHeaderHeight;

	if (scrollY < aboutSection.offsetTop + aboutSection.offsetHeight) {
		navLinks.about.classList.add('selected');
	} else if (scrollY < experienceSection.offsetTop + experienceSection.offsetHeight) {
		navLinks.experience.classList.add('selected');
	} else {
		navLinks.projects.classList.add('selected');
	}
}

function scrollToElm(id) {
	const el = document.getElementById(id);
	var topScrollHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile_header_height'));
	const isMobile = window.innerWidth <= 900;

	if (!el) return;

	if (!isMobile) {
		topScrollHeight = 50;
	}

	const y = el.getBoundingClientRect().top + window.scrollY - topScrollHeight;
	window.scrollTo({
		top: y
	});
}
