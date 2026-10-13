const configuredClientOrigins = (process.env.CLIENT_URL ?? "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean)
	.map((origin) => new URL(origin).origin);

export const allowedOrigins = [
	...configuredClientOrigins,
	"https://figma-e-commerce-website-client.vercel.app",
	"https://figma-e-commerce-website-backend.vercel.app",
	"http://172.30.0.1:5173",
	"http://192.168.1.13:5173",
	"http://localhost:5173",
	"http://localhost:5000",
	"chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd",
];

export const isAllowedOrigin = (origin) => {
	if (!origin) return true;
	if (allowedOrigins.includes(origin)) return true;

	try {
		const { protocol, hostname } = new URL(origin);
		return (
			(protocol === "http:" || protocol === "https:") &&
			["localhost", "127.0.0.1", "[::1]"].includes(hostname)
		);
	} catch {
		return false;
	}
};
