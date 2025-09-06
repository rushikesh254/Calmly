// Flat ESLint config for Next.js 15
import next from 'eslint-config-next';

export default [
	...next,
	{
		rules: {
			'no-unused-vars': 'warn',
			'no-console': 'warn',
			'prefer-const': 'error',
			'no-var': 'error'
		}
	}
];
