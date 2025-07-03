import Typography from "@/components/ui/Typography";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Typography
            as="span"
            variant="headlineMd"
            className="text-xl font-bold md:text-2xl text-white"
          >
            job:about
          </Typography>
        </div>
        <div className="border-t border-gray-800 pt-8 text-gray-400">
          <Typography as="p" variant="bodySm" className="text-white/70">
            &copy; 2025 Grit200.
          </Typography>
        </div>
      </div>
    </footer>
  );
}
