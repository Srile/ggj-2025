import * as Bun from "bun"

const server = Bun.serve<{ authToken: string; }>({
    port: 3000,
    fetch(req, server) {
        server.upgrade(req, {
            data: "foobar",
        });
    },
    websocket: {
        async message(ws, message) {
            console.log(`${message}`);
            ws.send("Received!");
        },
    },
});

console.log(`Listening on localhost:${server.port}`);