export default function mapToArray(map) {
	return Array.from(map, ([key, value]) => ({key, value}));
}
