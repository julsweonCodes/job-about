import { sleep } from "@/lib/utils";
import React from "react";
import TestContainer from "./components/TestContainer";

const page = async () => {
  //throw new Error("custom error");
  //await sleep(1500);
  return (
    <div>
      page
      <TestContainer />
    </div>
  );
};

export default page;
