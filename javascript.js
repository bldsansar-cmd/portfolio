let fixedSection, mainSection, navSection, mobileNavSection;
let aboutSection, experienceSection, projectsSection;
let navInnerHtml;

let currentLang = localStorage.getItem('lang') === 'ja' ? 'ja' : 'en';

const socialLinks = [
	{ icon: 'fa-facebook-f', label: 'Facebook' },
	{ icon: 'fa-twitter', label: 'Twitter' },
	{ icon: 'fa-instagram', label: 'Instagram' },
	{ icon: 'fa-youtube', label: 'Youtube' },
];

function getMessages() {
	return currentLang === 'ja' ? message_ja : message_en;
}

function loadPage() {
	mainSection = document.querySelector('main');
	navSection = document.querySelector('nav');
	mobileNavSection = document.querySelector('.mobile_header');
	fixedSection = document.querySelector('.fixed_section');

	aboutSection = document.getElementById('about');
	experienceSection = document.getElementById('experience');
	projectsSection = document.getElementById('projects');

	renderSocialButtons();
	renderPage();

	createPage();

	document.addEventListener('scroll', scrolling);
	window.addEventListener('resize', createPage);
}

function setLanguage(lang) {
	if (lang === currentLang) return;
	currentLang = lang;
	localStorage.setItem('lang', lang);
	renderPage();
}

function buildNavHtml(messages) {
	const otherLang = currentLang === 'en' ? 'ja' : 'en';
	return `
		<ul class="flexbox">
			<li><a href="javascript:scrollToElm('about');" class="nav_link" id="nav_about">${messages.nav.about}</a></li>
			<li><a href="javascript:scrollToElm('experience');" class="nav_link" id="nav_experience">${messages.nav.experience}</a></li>
			<li><a href="javascript:scrollToElm('projects');" class="nav_link" id="nav_projects">${messages.nav.projects}</a></li>
		</ul>
		<div class="lang_switcher flexbox">
			<a href="javascript:setLanguage('${otherLang}');" class="lang_link" id="lang_switch">${messages.switchLabel}</a>
		</div>
	`;
}

function renderPage() {
	const messages = getMessages();

	document.documentElement.lang = currentLang;

	document.getElementById('tagline').textContent = messages.tagline;
	document.getElementById('intro').textContent = messages.intro;

	document.getElementById('about_title').textContent = messages.sections.about;
	document.getElementById('experience_title').textContent = messages.sections.experience;
	document.getElementById('projects_title').textContent = messages.sections.projects;

	document.getElementById('about_content').innerHTML = messages.aboutText
		.map(text => `<p>${text}</p>`).join('');

	document.getElementById('footer_text').textContent = messages.footer;

	experienceSection.querySelectorAll('.sub_section.flexbox').forEach(el => el.remove());
	projectsSection.querySelectorAll('.sub_section_hoverable').forEach(el => el.remove());
	renderCards(experienceSection, messages.experience, 'sub_section flexbox');
	renderCards(projectsSection, messages.projects, 'sub_section_hoverable');

	navInnerHtml = buildNavHtml(messages);
	navSection.innerHTML = '';
	mobileNavSection.innerHTML = '';
	setMobileNavSection();
}

function renderSocialButtons() {
	const container = document.querySelector('.social_buttons');
	container.innerHTML = socialLinks.map(({ icon, label }) => `
		<div class="social_button">
			<div class="icon"><i class="fab ${icon}"></i></div>
			<span>${label}</span>
		</div>
	`).join('');
}

function renderCards(section, items, wrapperClass) {
	section.insertAdjacentHTML('beforeend', items.map(item => `
		<div class="${wrapperClass}">
			<div class="sub_section_item">${item.period || ''}</div>
			<div class="sub_section_content flexbox">
				<h3 class="sub_section_title">${item.title}</h3>
				<div class="sub_section_detail">${item.detail}</div>
				<div class="sub_section_tags flexbox">${renderTags(item.tags)}</div>
			</div>
		</div>
	`).join(''));
}

function renderTags(tags) {
	return tags.map(tag => `<div class="tag">${tag}</div>`).join('');
}

function setMobileNavSection() {
	if (!aboutSection || !mobileNavSection || !navSection) return;

	const isMobile = window.innerWidth <= 900;
	const scrolled = window.scrollY >= aboutSection.offsetTop;

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
	const scrollY = window.scrollY + 60;

	if (scrollY < experienceSection.offsetTop) {
		navLinks.about.classList.add('selected');
	} else if (scrollY < projectsSection.offsetTop) {
		navLinks.experience.classList.add('selected');
	} else {
		navLinks.projects.classList.add('selected');
	}
}

function createPage() {
	setMainSection();
	setMobileNavSection();
}

function setMainSection() {
	const isMobile = window.innerWidth <= 900;
	fixedSection.style.position = isMobile ? 'absolute' : '';
	mainSection.style.marginTop = isMobile ? '400px' : '';
}

function scrollToElm(id) {
	const el = document.getElementById(id);
	if (!el) return;
	const mobileHeaderVisible = window.getComputedStyle(mobileNavSection).display === 'flex';
	const headerOffset = mobileHeaderVisible ? mobileNavSection.offsetHeight + 10 : 50;
	const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
	window.scrollTo({ top: y });
}