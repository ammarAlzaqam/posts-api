import connectDB from "@/libs/mongoose";

export default async function HomePage() {
  await connectDB();
  return <section></section>;
}
