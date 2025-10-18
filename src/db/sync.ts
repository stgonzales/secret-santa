import { mkdir } from "node:fs/promises";

const main = async () => {
    await mkdir("./.db", { recursive: true });
    const { client } = await import(".");
    await client.sync()
    console.info("Sync completed!")
}

main().catch((err) => {
  console.error('Sync replica failed:', err)
  process.exit(1)
})