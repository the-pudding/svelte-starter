/* Usage
<script>
import checkScrollDir from "$utils/checkScrollDir.js";
let scrollY;
$: scrollDir = checkScrollDir(scrollY);
$: console.log(scrollDir)
</script>

<svelte:window bind:scrollY={scrollY} />
*/

let prevY = 0;
let scrollDir;

export default function checkScrollDir(scrollY) {
    if (scrollY) {
        scrollDir = scrollY > prevY ? "down" : "up";
        prevY = scrollY;
        return scrollDir;
    } else {
        scrollDir = undefined;
        return scrollDir;
    }
}