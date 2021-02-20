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

	window.addEventListener('load', async () => {
		//	Load extensions first.
		Extensions();

		//	Initialize the Page Handler.
		PageHandler.initialize();

		//	Load pages dynamically.
		await PageRouter.loadPages(PageHandler);

		//	Initialize WebSocket Interface
		SocketHandler.initialize();

		//	Load random music!
		loadMusic();

		//	Route to the correct page.
		await PageRouter.route();

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
		loadRandomMusic();

		//	Additionally bind and handle play/pause events.
		$('.audio').on('click', _ => {
			toggleMusic();
		});
	}

	async function loadRandomMusic() {
		const randomTrack = await getRandomTrack(Math.random() > 0.5);

		audio = new Audio(randomTrack.music_uri);

		$('.audio').attr('title', randomTrack.name)

		$(audio).on('ended', async _ => {
			await loadRandomMusic();
			audio.play();
		});
	}

	async function getRandomTrack(kkSong = false) {
		if (kkSong) {
			const kkSongs = [
				{
					name: "K.K. Flamenco",
					music_uri: 'https://acnhapi.com/v1/music/34'
				},
				{
					name: "K.K. Metal",
					music_uri: 'https://acnhapi.com/v1/music/50'
				},
				{
					name: "K.K. Bubblegum",
					music_uri: 'https://acnhapi.com/v1/music/4'
				},
				{
					name: "K.K. Cruisin'",
					music_uri: 'https://acnhapi.com/v1/music/27'
				},
				{
					name: "K.K. Jongara",
					music_uri: 'https://acnhapi.com/v1/music/42'
				},
				{
					name: "K.K. I Love You",
					music_uri: 'https://acnhapi.com/v1/music/13'
				},
				{
					name: "K.K. Rockabilly",
					music_uri: 'https://acnhapi.com/v1/music/59'
				},
				{
					name: "To The Edge",
					music_uri: 'https://acnhapi.com/v1/music/92'
				},
				{
					name: "Go K.K. Rider",
					music_uri: 'https://acnhapi.com/v1/music/11'
				}
			];

			return kkSongs[Math.floor(Math.random() * kkSongs.length)];
		} else {
			const hourlyMusic 		= await $.get('http://acnhapi.com/v1/backgroundmusic/');
			const hourlyMusicKeys 	= Object.keys(hourlyMusic);
			const randomTrack 		= hourlyMusic[hourlyMusicKeys[Math.floor(Math.random() * hourlyMusicKeys.length)]];

			const name				= `Hour ${randomTrack.hour}, ${randomTrack.weather}`;

			return {
				name: name,
				music_uri: randomTrack.music_uri
			};
		}
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