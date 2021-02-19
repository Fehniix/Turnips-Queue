'use strict';

import PageHandler from './pageHandler.js';
import PageRouter from './pageRouter.js';
import Animator from './animator.js';
import Extensions from './extensions.js';
import SocketHandler from './socketHandler.js';

//	Main, and strictly anonoymous, entry point.
(() => {
	//	Audio object used to control random music from ACNH API.
	let audio = undefined;
	let audioPlaying = false;

	window.addEventListener('load', () => {
		//	Load extensions first.
		Extensions();

		//	Initialize the Page Handler.
		PageHandler.initialize();

		//	Load pages dynamically.
		PageRouter.loadPages(PageHandler);

		//	Initialize WebSocket Interface
		SocketHandler.initialize();

		//	Load random music!
		loadMusic();

		//	Global binds.

		//	Available custom events:
		//	- islandsLoaded, pageSwapped.
		$(window).on('islandsLoaded', _ => {
			$('.island').each((index, element) => {
				//	Rotate island notes randomly.
				console.log(element)
			});
		});

		//	Modals
		$('#linkRules').on('click', _ => {
			Animator.showModal('modalRules');
		});

		$('#linkFAQ').on('click', _ => {
			Animator.showModal('modalFAQ');
		});

		$('.blackOverlay').on('click', _ => {
			Animator.hideModal();
		});
	});

	/**
	 * Loads random music from the ACNH API website that freely hosts ACNH data.
	 */
	async function loadMusic() {
		const hourlyMusic 		= await $.get('http://acnhapi.com/v1/backgroundmusic/');
		const hourlyMusicKeys 	= Object.keys(hourlyMusic);
		const randomTrack 		= hourlyMusic[hourlyMusicKeys[Math.floor(Math.random() * hourlyMusicKeys.length)]];
		
		audio = new Audio(randomTrack.music_uri);

		//	Additionally bind and handle play/pause events.
		$('.audio').on('click', _ => {
			toggleMusic();
		});
	}

	function toggleMusic() {
		if (audioPlaying === true) {
			$('.audio .play').show();
			$('.audio .pause').hide();
			audio.pause();
		} else {
			$('.audio .play').hide();
			$('.audio .pause').show();
			audio.play();
		}

		audioPlaying = !audioPlaying;
	}
})();