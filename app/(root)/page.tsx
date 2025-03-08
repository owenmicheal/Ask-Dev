import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const Home = async () => {
  const questions = [
    {
      _id: "1",
      title: "How to learn React",
      tags: [{ _id: "1", name: "React" }],
    },
    {
      _id: "2",
      title: "How to learn Next",
      tags: [{ _id: "3", name: "Next" }],
    },
    {
      _id: "3",
      title: "How to learn Laravel",
      tags: [{ _id: "3", name: "Laravel" }],
    },
    {
      _id: "4",
      title: "How to learn MongoDB",
      tags: [{ _id: "4", name: "MongoDB" }],
    },
  ];
  return (
    <>
      <section
        className="flex w-full flex-col-reverse sm:flex-row justify-between
      gap-4 sm:items-center"
      >
        <h1 className="h1-bold text-dark100_light900">All questions</h1>
        <Button
          className="primary-gradient min-h-[46px] p-4 py-3 !text-light900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      HomeFilters
      <div className="mt-10 flex w-ful flex-col gap-6"></div>
    </>
  );
};

export default Home;
