let navSection, mobileNavSection;
let aboutSection, experienceSection, projectsSection;
let navInnerHtml, mobileHeaderHeight;

const socialLinks = [
	{ icon: 'fa-facebook-f', label: 'Facebook' },
	{ icon: 'fa-twitter', label: 'Twitter' },
	{ icon: 'fa-instagram', label: 'Instagram' },
	{ icon: 'fa-youtube', label: 'Youtube' },
];

const commonTags = ['java', 'javascript', 'html', 'css', 'mysql'];

const experienceData = [
	{
		period: '2000-2001',
		title: 'front-end engineer',
		detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores perspiciatis assumenda omnis hic voluptates minus harum quod, consequatur adipisci officiis eligendi, sed inventore nisi velit odio similique reiciendis provident in.',
		tags: commonTags,
	},
	{
		period: '2000-2001',
		title: 'back-end engineer',
		detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores perspiciatis assumenda omnis hic voluptates minus harum quod, consequatur adipisci officiis eligendi, sed inventore nisi velit odio similique reiciendis provident in.',
		tags: commonTags,
	},
	{
		period: '2000-2001',
		title: 'senior engineer and team leader',
		detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores perspiciatis assumenda omnis hic voluptates minus harum quod, consequatur adipisci officiis eligendi, sed inventore nisi velit odio similique reiciendis provident in.',
		tags: commonTags,
	},
	{
		period: '2000-2001',
		title: 'senior engineer and advisor.',
		detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores perspiciatis assumenda omnis hic voluptates minus harum quod, consequatur adipisci officiis eligendi, sed inventore nisi velit odio similique reiciendis provident in.',
		tags: commonTags,
	},
];

const projectsData = [
	{
		title: 'ABCD web application',
		detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores perspiciatis assumenda omnis hic voluptates minus harum quod, consequatur adipisci officiis eligendi, sed inventore nisi velit odio similique reiciendis provident in.',
		tags: commonTags,
	},
	{
		title: 'QR code generator',
		detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores perspiciatis assumenda omnis hic voluptates minus harum quod, consequatur adipisci officiis eligendi, sed inventore nisi velit odio similique reiciendis provident in.',
		tags: commonTags,
	},
	{
		title: 'Find near hospital',
		detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores perspiciatis assumenda omnis hic voluptates minus harum quod, consequatur adipisci officiis eligendi, sed inventore nisi velit odio similique reiciendis provident in.',
		tags: commonTags,
	},
	{
		title: 'Near vegan (find nice vegan restaurant web service)',
		detail: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores perspiciatis assumenda omnis hic voluptates minus harum quod, consequatur adipisci officiis eligendi, sed inventore nisi velit odio similique reiciendis provident in.',
		tags: commonTags,
	},
];

function loadPage() {
	navSection = document.querySelector('nav');
	mobileNavSection = document.querySelector('.mobile_header');

	aboutSection = document.getElementById('about');
	experienceSection = document.getElementById('experience');
	projectsSection = document.getElementById('projects');

	navInnerHtml = navSection.innerHTML;
	mobileHeaderHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile_header_height'));

	renderSocialButtons();
	renderCards(experienceSection, experienceData, 'sub_section flexbox');
	renderCards(projectsSection, projectsData, 'sub_section_hoverable');

	setMobileNavSection();

	document.addEventListener('scroll', scrolling);
	window.addEventListener('resize', setMobileNavSection);
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
	if (!el) return;
	const y = el.getBoundingClientRect().top + window.scrollY - 50;
	window.scrollTo({ top: y });
}