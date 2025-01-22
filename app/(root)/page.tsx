import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="h1-bold text-primary-500">Welcome to Next.js Owen</h1>

      <form
        className="ml-4"
        action={async () => {
          "use server";

          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <button
          className="border border-slate-400 py-1.5 px-4 rounded-md"
          type="submit"
        >
          logout
        </button>
      </form>
    </div>
  );
};

export default Home;
