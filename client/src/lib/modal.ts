export default function createModal(name: string, content: string) {
	const modal = document.createElement('div');
	modal.classList.add('modal-outer');
	modal.innerHTML = `
		<div class="modal">
			<div class="top">
				<div class="text">
					${name}
				</div>

				<button class="close">
					<i class="fa-solid fa-x"></i>
				</button>
			</div>
			<div class="main">
				${content}
			</div>
		</div>
	`;

	const closeModal = () => {
		modal.classList.add('hide');
		setTimeout(() => {
			modal.remove();
		}, 300);

		document.removeEventListener('keydown', keyCloseFunc);
	};

	modal.firstElementChild.children[0].children[1].addEventListener('click', closeModal);

	modal.addEventListener('click', ({ target }) => {
		if (target === modal) {
			closeModal();
		}
	});

	const keyCloseFunc = ({ key }: KeyboardEvent) => {
		if (key === 'Escape') {
			closeModal();
		}
	};

	document.addEventListener('keydown', keyCloseFunc, false);

	return modal;
}