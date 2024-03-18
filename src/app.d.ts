// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
        interface Parameter {
            key: string;
            name: string;
            value: number;
            min: number;
            max: number;
            step: number;
        }        
	}
}


export {};
