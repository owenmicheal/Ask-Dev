import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return <div className="">Welecome to Ask dev</div>;
};

export default Home;
