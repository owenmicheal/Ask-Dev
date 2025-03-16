import Image from "next/image";
import RegisterForm from "@/components/form/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  // Only get the user, skip patient check
  const user = await getUser(userId);

  return (
    <div
      className="flex w-full flex-col-reverse sm:flex-row
      gap-4 sm:items-center"
    >
      <section className=" container">
        <div className="flex-col">
          <RegisterForm user={user} />
          <p className="copyright py-12">© 2025 Skin Dictionary</p>
        </div>
      </section>
    </div>
  );
};

export default Register;
