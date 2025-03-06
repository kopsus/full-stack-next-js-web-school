// create a button that goes back to the previous page
// use useRoute() to get the current route

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ButtonBack() {
  const route = useRouter();

  function goBack() {
    route.back();
  }

  return (
    <button
      onClick={goBack}
      className="flex items-center gap-2 p-2 text-sm text-gray-500 hover:text-gray-700"
    >
      <ArrowLeftIcon size={16} />
      Kembali
    </button>
  );
}
