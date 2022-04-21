


<h1 class="text-3xl text-center font-bold">
    Hello world!
</h1>
<canvas id="game" class="w-full h-full"></canvas>
<p class="text-gray-300">Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script>

    import { onMount } from "svelte"
    import {setup} from "../game/index"

    onMount(setup)
    

</script>