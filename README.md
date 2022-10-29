# tsh
typescript shell for duckOS
### Building
Run `pnpm install` then `pnpm build`, or `pnpm build:prod` for production
### Development server
I personally used [serve](https://github.com/vercel/serve), for the development server (`serve -C dist`). But you can use any server you'd like (as long as its running on port 3000 and has a bundle.js file on the root dir)
