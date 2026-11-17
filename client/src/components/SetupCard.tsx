import type { Setup } from "../types";

const roles = ["Software Engineer", "Backend Engineer", "Frontend Engineer", "AI/ML Engineer", "Full-Stack Engineer"];
const experiences = ["Fresher", "0–2 years", "2–4 years"];
const focuses = ["DSA", "System Design", "Backend", "Frontend", "AI Agents", "RAG", "Databases", "Behavioral"];

type Props = {
  setup: Setup;
  setSetup: (next: Setup) => void;
  onStart: () => void;
};

export function SetupCard({ setup, setSetup, onStart }: Props) {
  const toggleFocus = (focus: string) => {
    setSetup({
      ...setup,
      focus: setup.focus.includes(focus)
        ? setup.focus.filter((x) => x !== focus)
        : [...setup.focus, focus]
    });
  };

  return (
    <div className="card p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-indigo-400">SESSION CONFIGURATION</p>
        <h2 className="mt-1 text-2xl font-bold text-white">Build your interview</h2>
        <p className="mt-2 text-sm text-slate-400">Choose what you want the coach to challenge you on.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm text-slate-300">Target role</span>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            value={setup.role}
            onChange={(e) => setSetup({ ...setup, role: e.target.value })}
          >
            {roles.map((role) => <option key={role}>{role}</option>)}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm text-slate-300">Experience</span>
          <select
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            value={setup.experience}
            onChange={(e) => setSetup({ ...setup, experience: e.target.value })}
          >
            {experiences.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-5">
        <span className="mb-2 block text-sm text-slate-300">Interview focus</span>
        <div className="flex flex-wrap gap-2">
          {focuses.map((focus) => {
            const active = setup.focus.includes(focus);
            return (
              <button
                type="button"
                key={focus}
                onClick={() => toggleFocus(focus)}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  active
                    ? "border-indigo-400 bg-indigo-500/15 text-indigo-200"
                    : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600"
                }`}
              >
                {focus}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <span className="mb-2 block text-sm text-slate-300">Difficulty</span>
        <div className="grid grid-cols-3 gap-2">
          {["Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSetup({ ...setup, difficulty: level })}
              className={`rounded-xl border px-3 py-2.5 text-sm ${
                setup.difficulty === level
                  ? "border-indigo-400 bg-indigo-500/15 text-white"
                  : "border-slate-700 text-slate-400"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <button className="btn-primary mt-6 w-full" onClick={onStart} disabled={!setup.focus.length}>
        Start mock interview
      </button>
    </div>
  );
}
