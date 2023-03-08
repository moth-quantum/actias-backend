<script>
	import { page } from '$app/stores';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
</script>

<header>
	<Navbar let:hidden let:toggle>
        <NavBrand href="/">
          <img
            src="https://cdn2.iconfinder.com/data/icons/modern-future-technology/128/quantum-computer-512.png"
            class="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Q1Synth
          </span>
        </NavBrand>
        <NavHamburger on:click={toggle} />
        <NavUl {hidden}>
          <NavLi href="/about" active={$page.url.pathname === '/about'}>About</NavLi>
          <NavLi href="/help" active={$page.url.pathname === '/help'}>Help</NavLi>
          <NavLi href="/faq" active={$page.url.pathname === '/faq'}>FAQ</NavLi>
        </NavUl>
      </Navbar>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}
</style>
