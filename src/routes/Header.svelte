<script>
	import { page } from '$app/stores';
    import logo from '$lib/images/q1synth-icon.svg';
</script>

<header>
    <nav class="container">
        <a href="/">
            <img
                src={logo}
                class="mr-3 h-6 sm:h-6"
                alt="Q1Synth Logo"
            />
        </a>
        <ul class="menu">
            <li class="menu__item"><a class={$page.url.pathname === '/about' ? 'active' : ''} href="/about">About</a></li>
            <!-- <li class="menu__item"><a class={$page.url.pathname === '/help' ? 'active' : ''} href="/help">Help</a></li>
            <li class="menu__item"><a class={$page.url.pathname === '/faq' ? 'active' : ''} href="/faq">FAQ</a></li> -->
        </ul>
    
    </nav>
</header>

<style lang="scss">
	header {
		display: flex;
		justify-content: center;
        background-color: var(--color-grey-darkest);
	}

    nav {
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 2rem;
        padding-right: 2rem;

        $var: calc(1600px - 4rem);

        @media (min-width: 1664px) {
            padding-left: 0rem;
            padding-right: 0rem;
        }
    }

    .menu {
        display: flex;
        justify-content: space-between;
        list-style: none;
        padding: 0;
    }

    .menu__item {
        padding-right: 3rem;
        font-size: var(--text-sm);
        font-weight: 500;
        display: flex;
        align-items: center;
    }

    .menu__item a {
        text-transform: uppercase;
        text-decoration: none;
        color: #FFF;
    }

    .menu__item a:hover {
        color: var(--color-theme-2);

    }

    a.active {
        color: var(--color-theme-2);
    }

    .menu__item:last-of-type {
        padding-right: 0;
    }
</style>
