import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="h1-bold text-primary-500 max-sm:text-2xl">
        Welcome to Next.js Owen
      </h1>
    </div>
  );
};

export default Home;
