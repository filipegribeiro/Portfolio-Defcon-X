//**** MENU MOBILE ****

document.addEventListener('DOMContentLoaded', function () {
	const btnMobile = document.getElementById('btn-Mobile');

	function toggleMenu(event) {
		if (event.type === 'touchstart') event.preventDefault();
		const nav = document.getElementById('nav');
		nav.classList.toggle('active');
		const active = nav.classList.contains('active');
		event.currentTarget.setAttribute('aria-expanded', active);
		if (active) {
			event.currentTarget.setAttribute('aria-label', 'Fecha Menu');
		} else {
			event.currentTarget.setAttribute('aria-label', 'Abrir Menu');
		}
	}
	btnMobile.addEventListener('click', toggleMenu);
	btnMobile.addEventListener('touchstart', toggleMenu);
});

//**** MULTIPLE TESTE TYPED ****

document.addEventListener('DOMContentLoaded', function () {
	let typed = new Typed('#text-changed', {
		strings: ['Junior Fullstack Web Developer', 'Music Therapist', 'Teacher of Musical Education'],
		typeSpeed: 100,
		backSpeed: 100,
		backDelay: 100,
		loop: true,
	});
});
