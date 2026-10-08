// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const base = isGitHubPages ? '/rex' : undefined;
const site = isGitHubPages
	? 'https://pannoniae.github.io'
	: (process.env.CF_PAGES_URL ?? 'http://localhost:4321');
/** @param {string} pathname */
const publicAsset = (pathname) => `${base ?? ''}${pathname}`;

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [
		starlight({
			title: 'REX & M2EX Documentation',
			favicon: '/m2exrexicon.png',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Pannoniae/rex' }],
			head: [
				{
					tag: 'script',
					attrs: { src: publicAsset('/theme-switcher.js') },
				},
			],
			customCss: ['./src/styles/Medieval2.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Installation', slug: 'gettingstarted/installation' },
						{ label: 'Configuration', slug: 'gettingstarted/configuration' },
						{ label: 'Running Mods', slug: 'gettingstarted/running-mods' },
						{ label: 'Troubleshooting', slug: 'gettingstarted/troubleshooting' },
						{ label: 'FAQs', slug: 'gettingstarted/faqs' }
					],
				},
				{
					label: 'Game Mechanics',
					items: [{ autogenerate: { directory: 'game-mechanics' } }],
				},
				{
					label: 'For Modders',
					items: [
						{ label: 'Mount and animal variation', slug: 'modders/mount_variation' },
						{ label: 'Soldier variation', slug: 'modders/soldier_variation' },
						{ label: 'Wasteland regions', slug: 'modders/wasteland_regions' },
						{ label: 'Mounts', slug: 'modders/descr_mount' },
						{ label: 'Custom Battle Categories', slug: 'modders/custom_battle_categories' },
						{
							label: 'Scripting',
							items: [{ label: 'Local and target', slug: 'modders/scripting/local_and_target' }],
						},
					],
				},
			],
		}),
	],
});
