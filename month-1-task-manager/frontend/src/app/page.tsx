export default function Home() {
  return (
    <main className="p-8 max-w-xl mx-auto mt-10 text-center">
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
        Day 21: Next.js Task Space
      </h1>
      <p className="mt-4 text-slate-600">
        Welcome to your clean Next.js frontend! We will build our full-stack dashboard here step-by-step.
      </p>
      <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-left">
        <h3 className="font-semibold text-slate-700">Today's Goals:</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-650 list-disc list-inside">
          <li>Explore layout.tsx and page.tsx</li>
          <li>Ensure Next.js runs on port 3000</li>
          <li>Understand Server vs. Client rendering basics</li>
        </ul>
      </div>
    </main>
  );
}
