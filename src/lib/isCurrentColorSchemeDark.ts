export default function isCurrentColorSchemeDark() {
	return matchMedia('(prefers-color-scheme: dark)').matches;
}
