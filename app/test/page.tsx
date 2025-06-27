import { sleep } from "@/lib/utils";
import React from "react";
import TestContainer from "./components/TestContainer";
import AuthUI from "@/components/auth";

const page = async () => {
  //throw new Error("custom error");
  //await sleep(1500);
  return (
    <div>
      <AuthUI />
    </div>
  );
};

export default page;
