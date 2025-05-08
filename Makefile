.PHONY: setup client server dev clean

# Setup the project
setup:
	npm install
	mkdir -p client
	cd client && npm create vite@latest . --template react-ts -- --skip-git
	cd client && npm install

# Run the React client with npm
client:
	cd client && npm run dev

# Run the server with Bun
server:
	bun run dev

# Run both client and server concurrently
dev:
	(cd client && npm run dev) & (bun run dev) & wait

# Clean up
clean:
	rm -rf client/node_modules
	rm -rf node_modules
