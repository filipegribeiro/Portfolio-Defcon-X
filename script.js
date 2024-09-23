document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM fully loaded and parsed');

	//**** MENU MOBILE ****
	const btnMobile = document.getElementById('btn-mobile');
	if (btnMobile) {
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
	} else {
		console.error('Menu mobile button not found');
	}

	//**** MULTIPLE TESTE TYPED ****
	const typedElement = document.getElementById('text-changed');
	if (typedElement) {
		let typed = new Typed('#text-changed', {
			strings: ['Teacher of Musical Education', 'Music Therapist', 'Junior Fullstack Web Developer'],
			typeSpeed: 100,
			backSpeed: 50,
			backDelay: 50,
			loop: true,
		});
	} else {
		console.error('#text-changed element not found');
	}

	//**** SLIDER ****
	let items = document.querySelectorAll('.slider .list .item');
	let next = document.getElementById('next');
	let prev = document.getElementById('prev');
	let thumbnails = document.querySelectorAll('.thumbnail .item');

	if (items && next && prev && thumbnails) {
		// config param
		let countItem = items.length;
		let itemActive = 0;
		// event next click
		next.onclick = function () {
			itemActive = itemActive + 1;
			if (itemActive >= countItem) {
				itemActive = 0;
			}
			showSlider();
		};
		//event prev click
		prev.onclick = function () {
			itemActive = itemActive - 1;
			if (itemActive < 0) {
				itemActive = countItem - 1;
			}
			showSlider();
		};
		// auto run slider
		let refreshInterval = setInterval(() => {
			next.click();
		}, 10000);

		function showSlider() {
			// remove item active old
			let itemActiveOld = document.querySelector('.slider .list .item.active');
			let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
			itemActiveOld.classList.remove('active');
			thumbnailActiveOld.classList.remove('active');

			// active new item
			items[itemActive].classList.add('active');
			thumbnails[itemActive].classList.add('active');

			// clear auto time run slider
			clearInterval(refreshInterval);
			refreshInterval = setInterval(() => {
				next.click();
			}, 10000);
		}

		// click thumbnail
		thumbnails.forEach((thumbnail, index) => {
			thumbnail.addEventListener('click', () => {
				itemActive = index;
				showSlider();
			});
		});
	} else {
		console.error('Slider elements not found');
	}

	//**** CONTACT FORM ****
	const contactForm = document.getElementById('contactForm');

	if (contactForm) {
		contactForm.addEventListener('submit', async function (event) {
			event.preventDefault(); // Evita o envio padrão do formulário
			console.log('Form submitted');

			const name = document.getElementById('name').value;
			const email = document.getElementById('email').value;
			const message = document.getElementById('message').value;

			// Validação dos campos obrigatórios
			if (!name) {
				showToast('Name is required!', 'warning');
				return;
			}

			if (!email) {
				showToast('Email is required!', 'warning');
				return;
			}

			if (!message) {
				showToast('Message is required!', 'warning');
				return;
			}

			try {
				const response = await fetch('http://localhost:3000/email/send-email', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ name, email, message }),
				});

				// Verificar se a resposta foi bem-sucedida
				if (response.ok) {
					showToast('Message sent successfully! Thanks and see you soon!', 'success');
					setTimeout(() => {
						// Recarregar a página após 4 segundos e ir para o topo
						window.scrollTo(0, 0);
						location.reload();
					}, 4000); // Espera 4 segundos antes de recarregar
				} else {
					const result = await response.json(); // Extrair o corpo da resposta JSON
					if (result.errors) {
						showToast('Something went wrong. Please, try again!', 'error');
					} else {
						showToast('Error sending the message.', 'error');
					}
				}
			} catch (error) {
				showToast('Error sending the message, please try this email: g.filipe.r@gmail.com!', 'error');
				console.log(error);
			}
		});
	} else {
		console.log('Form not found');
	}
});

// *** TOASTS PROCESS ***

// Função para garantir que o contêiner de toasts exista
function getToastContainer() {
	let container = document.querySelector('.toast-container');
	if (!container) {
		container = document.createElement('div');
		container.classList.add('toast-container');
		document.body.appendChild(container);
	}
	return container;
}

// Função para exibir os toasts
function showToast(message, type) {
	const container = getToastContainer(); // Garante que o container existe
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
	container.appendChild(toast);

	setTimeout(() => {
		toast.classList.add('show');
		setTimeout(() => {
			toast.classList.remove('show');
			setTimeout(() => {
				container.removeChild(toast);
			}, 300);
		}, 3000);
	}, 100);
}
