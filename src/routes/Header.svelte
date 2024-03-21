<script>
    import logo from '$lib/images/q1synth-icon.svg';
    import { isApp } from '$lib/stores/global';
</script>

<header>
    <nav class="container nav {isApp() ? 'nav--app' : ''}">
        <a href="/">
            <img
                src={logo}
                class="mr-3 h-6 sm:h-6"
                alt="Q1Synth Logo"
            />
        </a>
        <ul class="menu">
            <!-- <li class="menu__item"><a class={$page.url.pathname === '/about' ? 'active' : ''} href="/about">About</a></li> -->
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
        
        z-index: 100;
	}

    .nav {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        padding-left: 96px;


        @media (min-width: 1200px) {
            padding: 1rem 2rem;
            padding-left: 96px;

        }

        @media (min-width: calc(var(--max-width))) {
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
