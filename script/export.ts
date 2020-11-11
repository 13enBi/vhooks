const fs = require('fs');
const exclude = ['utils', 'index.ts', '__tests__'];

const special = {
	useStore: 'export * from "./useStore";\n',
};

const files = fs
	.readdirSync('../packages/')
	.filter((name) => !exclude.includes(name))
	.map((name) => name.split('.')[0]);

fs.writeFileSync(
	'../packages/index.ts',
	files.reduce(
		(total, name) => (
			console.log(name), (total += special[name] || `export { default as ${name} } from './${name}';\n`)
		),
		`export * from 'axios';\nexport { default as axios } from 'axios';\n`
	)
);

console.log(`\n\n${files.length} done`);
