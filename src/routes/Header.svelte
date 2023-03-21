<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
    import logo from '$lib/images/q1synth-icon.svg';
</script>

<header>
    <nav class="container">
        <img
            src={logo}
            class="mr-3 h-6 sm:h-6"
            alt="Q1Synth Logo"
        />
        <ul class="menu">
            <li class="menu__item"><a href="/about" >About</a></li>
            <li class="menu__item"><a href="/help" >Help</a></li>
            <li class="menu__item"><a href="/faq" >FAQ</a></li>
        </ul>
    
    </nav>
	<!-- <Navbar let:hidden let:toggle color="none" navClass="px-2 sm:px-4 py-3.5 w-full">
        <NavBrand href="/">
            <img
                src={logo}
                class="mr-3 h-6 sm:h-6"
                alt="Q1Synth Logo"
            />
            </NavBrand>
            <NavHamburger on:click={toggle} />
            <NavUl {hidden} ulClass="flex flex-col p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <NavLi href="/about" active={$page.url.pathname === '/about'} class="text-white uppercase text-sm tracking-widest">About</NavLi>
                <NavLi href="/help" active={$page.url.pathname === '/help'} class="text-white uppercase text-sm tracking-widest">Help</NavLi>
                <NavLi href="/faq" active={$page.url.pathname === '/faq'} class="text-white uppercase text-sm tracking-widest">FAQ</NavLi>
            </NavUl>
        </Navbar> -->
</header>

<style>
	header {
		display: flex;
		justify-content: center;
        background-color: var(--color-grey-darkest);
	}

    nav {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0;
    }

    .menu {
        display: flex;
        justify-content: space-between;
        list-style: none;
        padding: 0;
    }

    .menu__item {
        padding-right: 3rem;
        font-size: 0.95rem;
        letter-spacing: 2px;
        font-weight: 500;
    }

    .menu__item a {
        text-transform: uppercase;
        color: #FFF;
    }

    .menu__item a:hover {
        color: var(--color-yellow);

    }

    .menu__item:last-of-type {
        padding-right: 0;
    }
</style>
