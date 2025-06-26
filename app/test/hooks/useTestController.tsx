/*import { createTests, deleteTests, getTests, updateTests } from "@/apis/test";
import { Database } from "@/types/supabase";
import { useState, useEffect } from "react";

type testDto = Database["public"]["Tables"]["test"]["Row"];

const useTestController = () => {
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState<testDto[]>([]);

  const onGetTests = async () => {
    setLoading(true);
    try {
      const resultTests = await getTests();
      if (resultTests) setTests(resultTests);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onGetTests();
  }, []);

  const onCreateEmptyTests = async () => {
    await createTests("");
    await onGetTests();
  };

  const onUpdateTests = async (id: number, content: string) => {
    await updateTests(id, content);
    await onGetTests();
  };

  const onDeleteTests = async (id: number) => {
    await deleteTests(id);
    await onGetTests();
  };

  return { loading, tests };
};

export default useTestController;*/
