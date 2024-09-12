//**** MENU MOBILE ****

document.addEventListener('DOMContentLoaded', function () {
	const btnMobile = document.getElementById('btn-mobile');

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
		strings: ['Teacher of Musical Education', 'Music Therapist', 'Junior Fullstack Web Developer'],
		typeSpeed: 100,
		backSpeed: 50,
		backDelay: 50,
		loop: true,
	});
});

//**** DOWNLOAD BUTTON ****

$('.btn-circle-download').click(function () {
	$(this).addClass('load');
	setTimeout(function () {
		$('.btn-circle-download').addClass('done');
	}, 1000);
	setTimeout(function () {
		$('.btn-circle-download').removeClass('load done');
	}, 5000);
});

//**** SLIDER ****

const slider = document.querySelector('[data-slider]');
const sliderContainer = document.querySelector('[data-slider-container]');
const sliderPrevBtn = document.querySelector('[data-slider-prev]');
const sliderNextBtn = document.querySelector('[data-slider-next]');

let totalSliderVisibleItems = Number(getComputedStyle(slider).getPropertyValue('--slider-items'));
let totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

let currentSlidePos = 0;

const moveSliderItem = function () {
	sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
};

/* NEXT SLIDE */

const slideNext = function () {
	const slideEnd = currentSlidePos >= totalSlidableItems;

	if (slideEnd) {
		currentSlidePos = 0;
	} else {
		currentSlidePos++;
	}

	moveSliderItem();
};

sliderNextBtn.addEventListener('click', slideNext);

/* PREVIOUS SLIDE */

const slidePrev = function () {
	if (currentSlidePos <= 0) {
		currentSlidePos = totalSlidableItems;
	} else {
		currentSlidePos--;
	}

	moveSliderItem();
};

sliderPrevBtn.addEventListener('click', slidePrev);

/* RESPONSIVE */

window.addEventListener('resize', function () {
	totalSliderVisibleItems = Number(getComputedStyle(slider).getPropertyValue('--slider-items'));
	totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

	moveSliderItem();
});

//**** CONTACT FORM ****

document.getElementById('contactForm').addEventListener('submit', async function (event) {
	event.preventDefault(); // Evita o envio padrão do formulário

	const name = document.getElementById('name').value;
	const email = document.getElementById('email').value;
	const message = document.getElementById('message').value;

	try {
		const response = await fetch('http://localhost:3000/email/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, email, message }),
		});

		const result = await response.json();

		if (response.ok) {
			document.getElementById('responseMessage').textContent = 'Mensagem enviada com sucesso!';
		} else {
			document.getElementById('responseMessage').textContent = `Erro: ${result.errors.map(err => err.msg).join(', ')}`;
		}
	} catch (error) {
		document.getElementById('responseMessage').textContent = 'Erro ao enviar a mensagem.';
	}
});

//**** TOAST PROCESS ****/

function showToast(message, type) {
	const toast = document.createElement('div');
	toast.classList.add('toast');
	toast.classList.add(type);

	const icon = document.createElement('i');
	icon.classList.add('icon', 'fa');

	switch (type) {
		case 'success':
			icon.classList.add('fa-circle-check');
			break;
		case 'warning':
			icon.classList.add('fa-circle-exclamation');
			break;
		case 'info':
			icon.classList.add('fa-circle-info');
			break;
		case 'error':
			icon.classList.add('fa-circle-xmark');
			break;
		default:
			icon.classList.add('fa-circle-info');
	}

	toast.appendChild(icon);
	toast.appendChild(document.createTextNode(message));
	document.body.appendChild(toast);

	setTimeout(() => {
		toast.classList.add('show');
		setTimeout(() => {
			toast.classList.remove('show');
			setTimeout(() => {
				document.body.removeChild(toast);
			}, 300);
		}, 3000);
	}, 100);
}
