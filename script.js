
Action: file_editor create /app/frontend/src/App.js --file-text "import { useState } from \"react\";
import \"@/App.css\";
import { BrowserRouter, Routes, Route } from \"react-router-dom\";
import {
  Zap,
  BookOpen,
  Play,
  FileText,
  ClipboardList,
  Calculator,
  BarChart3,
  Sigma,
  BatteryCharging,
  Wrench,
  Briefcase,
  GraduationCap,
  FileUser,
  Download,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from \"lucide-react\";

const SEMESTER_DATA = {
  1: [\"Fundamental of Electrical Engineering\", \"Engineering Mathematics\"],
  2: [\"Fundamental of Electronics Engineering\", \"Applied Science\"],
  3: [\"Electrical Engineering\", \"Electrical Panel Engineering\", \"Digital Electronics\"],
  4: [
    \"Power Electronics\",
    \"Industrial Automation and Control\",
    \"Microcontroller and IoT\",
    \"Motor and Transformer\",
  ],
  5: [\"Power Electronics for Electric Vehicle\", \"Renewable Technology\"],
  6: [
    \"Project Work\",
    \"Industrial Training\",
    \"Electric Vehicle Technology\",
    \"Smart Grid Technology\",
  ],
};

const RESOURCES = [
  { icon: FileText, title: \"Notes PDF\", desc: \"Semester-wise study notes\", tag: \"PDF\", anchor: \"notes\" },
  { icon: Play, title: \"Video Lectures\", desc: \"Subject-wise video library\", tag: \"Video\" },
  { icon: ClipboardList, title: \"Question Papers\", desc: \"Previous year papers archive\", tag: \"Papers\" },
  { icon: BookOpen, title: \"MCQ Quiz\", desc: \"Practice quizzes & tests\", tag: \"Quiz\" },
  { icon: BarChart3, title: \"Attendance Calculator\", desc: \"Track your attendance %\", tag: \"Tool\" },
  { icon: Calculator, title: \"CGPA Calculator\", desc: \"Compute grade point average\", tag: \"Tool\" },
  { icon: Sigma, title: \"Electrical Formulas\", desc: \"Essential engineering formulae\", tag: \"Ref\", anchor: \"formulas\" },
  { icon: BatteryCharging, title: \"EV Learning\", desc: \"Electric vehicle fundamentals\", tag: \"Track\", anchor: \"ev\" },
  { icon: Wrench, title: \"Projects\", desc: \"Final year project ideas\", tag: \"Build\" },
  { icon: Briefcase, title: \"Jobs\", desc: \"Latest career opportunities\", tag: \"Career\" },
  { icon: GraduationCap, title: \"Internships\", desc: \"Industry internship listings\", tag: \"Career\" },
  { icon: FileUser, title: \"Resume Builder\", desc: \"Craft a professional CV\", tag: \"Tool\" },
];

const FORMULAS = [
  { label: \"Ohm's Law\", eq: \"V = I × R\", note: \"Voltage from current & resistance\" },
  { label: \"DC Power\", eq: \"P = V × I\", note: \"Power in a DC circuit\" },
  { label: \"3-Phase Power\", eq: \"P = √3 × V × I × PF\", note: \"Three-phase active power\" },
  { label: \"Energy\", eq: \"E = P × t\", note: \"Energy consumed over time\" },
  { label: \"Transformer Ratio\", eq: \"N₁/N₂ = V₁/V₂\", note: \"Turns to voltage relation\" },
];

const EV_IDEAS = [
  \"Smart EV Battery Monitoring System\",
  \"Solar EV Charging Station\",
  \"IoT Energy Meter\",
  \"EV Fault Detection System\",
];

const Register = ({ onEnter }) => {
  const [name, setName] = useState(\"\");
  const [err, setErr] = useState(\"\");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErr(\"Please enter your name to continue\");
      return;
    }
    onEnter(name.trim());
  };

  return (
    <div className=\"register-shell\" data-testid=\"register-page\">
      <div className=\"grid-bg\" aria-hidden />
      <div className=\"register-wrap\">
        <div className=\"register-left\">
          <div className=\"brand-row\">
            <div className=\"brand-mark\"><Zap size={18} strokeWidth={2.5} /></div>
            <span className=\"brand-name\">EE / STUDY HUB</span>
          </div>

          <h1 className=\"hero-title\">
            Engineer your <em>edge</em>.<br />
            Study smarter,<br />build brighter.
          </h1>

          <p className=\"hero-sub\">
            A focused study workspace for Electrical Engineering students —
            semester notes, formulas, EV tracks, and career prep, all in one place.
          </p>

          <div className=\"stats\">
            <div><span className=\"num\">6</span><span className=\"lbl\">Semesters</span></div>
            <div><span className=\"num\">18+</span><span className=\"lbl\">Subjects</span></div>
            <div><span className=\"num\">12</span><span className=\"lbl\">Resources</span></div>
          </div>
        </div>

        <form className=\"register-card\" onSubmit={submit}>
          <div className=\"tag-row\">
            <span className=\"dot\" /> Student registration
          </div>
          <h2 className=\"card-title\">Enter the hub</h2>
          <p className=\"card-sub\">One name away from your study dashboard.</p>

          <label className=\"field-label\" htmlFor=\"studentName\">Your name</label>
          <input
            id=\"studentName\"
            data-testid=\"student-name-input\"
            value={name}
            onChange={(e) => { setName(e.target.value); if (err) setErr(\"\"); }}
            placeholder=\"e.g. Aditya Sharma\"
            autoComplete=\"off\"
            className=\"text-input\"
          />
          {err && <div className=\"err\" data-testid=\"name-error\">{err}</div>}

          <button type=\"submit\" className=\"cta\" data-testid=\"enter-website-btn\">
            Enter website <ArrowRight size={18} />
          </button>

          <div className=\"fine\">
            No password. No tracking. Just study.
          </div>
        </form>
      </div>
    </div>
  );
};

const Home = ({ username, onLogout }) => {
  const [semester, setSemester] = useState(\"\");
  const [subject, setSubject] = useState(\"\");

  const subjects = semester ? SEMESTER_DATA[semester] || [] : [];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: \"smooth\", block: \"start\" });
  };

  return (
    <div className=\"home-shell\" data-testid=\"home-page\">
      <div className=\"grid-bg\" aria-hidden />

      <nav className=\"topnav\">
        <div className=\"brand-row\">
          <div className=\"brand-mark\"><Zap size={16} strokeWidth={2.5} /></div>
          <span className=\"brand-name\">EE / STUDY HUB</span>
        </div>
        <div className=\"nav-user\">
          <span className=\"user-hi\">Hey, <b data-testid=\"username-display\">{username}</b></span>
          <button className=\"btn-ghost\" onClick={onLogout} data-testid=\"logout-btn\">Sign out</button>
        </div>
      </nav>

      <header className=\"home-hero\">
        <div className=\"hero-eyebrow\"><Sparkles size={14} /> Semester dashboard</div>
        <h1 className=\"home-title\">
          Welcome back, <span className=\"accent\">{username}</span>.<br />
          Pick a semester and dive in.
        </h1>
        <p className=\"home-sub\">
          Curated notes, formulas, EV tracks and career tools — all tuned for
          Electrical Engineering diploma & degree students.
        </p>

        <div className=\"picker\">
          <div className=\"picker-field\">
            <label>Semester</label>
            <select
              data-testid=\"semester-select\"
              value={semester}
              onChange={(e) => { setSemester(e.target.value); setSubject(\"\"); }}
            >
              <option value=\"\">Select semester</option>
              {[1,2,3,4,5,6].map((s) => (
                <option key={s} value={s}>{s}{s===1?\"st\":s===2?\"nd\":s===3?\"rd\":\"th\"} Semester</option>
              ))}
            </select>
          </div>
          <div className=\"picker-field\">
            <label>Subject</label>
            <select
              data-testid=\"subject-select\"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!subjects.length}
            >
              <option value=\"\">
                {subjects.length ? \"Select subject\" : \"Choose semester first\"}
              </option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <button
            className=\"btn-solid\"
            data-testid=\"jump-to-notes-btn\"
            onClick={() => scrollTo(\"notes\")}
          >
            Open notes <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <section className=\"section\">
        <div className=\"section-head\">
          <h2>Student resources</h2>
          <p>Everything you'd normally scatter across 12 tabs — bundled.</p>
        </div>

        <div className=\"res-grid\">
          {RESOURCES.map((r, i) => {
            const Icon = r.icon;
            return (
              <button
                key={r.title}
                className=\"res-card\"
                data-testid={`resource-card-${r.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`}
                onClick={() => r.anchor && scrollTo(r.anchor)}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className=\"res-icon\"><Icon size={22} strokeWidth={1.8} /></div>
                <div className=\"res-tag\">{r.tag}</div>
                <div className=\"res-title\">{r.title}</div>
                <div className=\"res-desc\">{r.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className=\"section\" id=\"notes\">
        <div className=\"section-head\">
          <h2>Notes PDF <span className=\"chip\">Featured</span></h2>
          <p>Open the semester notes right here, or download for offline study.</p>
        </div>

        <div className=\"pdf-panel\" data-testid=\"pdf-panel\">
          <div className=\"pdf-meta\">
            <div className=\"pdf-badge\">PDF · 694 KB</div>
            <h3>Electrical Engineering — Semester Notes</h3>
            <p>
              Handpicked notes covering core Electrical Engineering topics.
              View in-browser or download to your device.
            </p>
            <div className=\"pdf-actions\">
              <a
                className=\"btn-solid\"
                href=\"/notes/48.pdf\"
                target=\"_blank\"
                rel=\"noopener noreferrer\"
                data-testid=\"pdf-view-btn\"
              >
                Open full view <ArrowRight size={16} />
              </a>
              <a
                className=\"btn-ghost\"
                href=\"/notes/48.pdf\"
                download=\"EE-Notes.pdf\"
                data-testid=\"pdf-download-btn\"
              >
                <Download size={16} /> Download
              </a>
            </div>
            <ul className=\"pdf-check\">
              <li>Curriculum-aligned</li>
              <li>Exam-ready summaries</li>
              <li>Diagrams &amp; formulas included</li>
            </ul>
          </div>

          <div className=\"pdf-viewer\">
            <iframe
              title=\"EE Notes PDF\"
              src=\"/notes/48.pdf#view=FitH\"
              data-testid=\"pdf-iframe\"
            />
          </div>
        </div>
      </section>

      <section className=\"section\" id=\"formulas\">
        <div className=\"section-head\">
          <h2>Electrical formulas</h2>
          <p>The load-bearing beams of every EE syllabus.</p>
        </div>

        <div className=\"formula-grid\">
          {FORMULAS.map((f) => (
            <div className=\"formula-card\" key={f.label} data-testid={`formula-${f.label.replace(/\W+/g,'-').toLowerCase()}`}>
              <div className=\"formula-label\">{f.label}</div>
              <div className=\"formula-eq\">{f.eq}</div>
              <div className=\"formula-note\">{f.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className=\"section\" id=\"ev\">
        <div className=\"section-head\">
          <h2>EV project ideas</h2>
          <p>Final-year project seeds tuned for the electric future.</p>
        </div>

        <div className=\"ev-grid\">
          {EV_IDEAS.map((idea, i) => (
            <div className=\"ev-card\" key={idea} data-testid={`ev-idea-${i}`}>
              <div className=\"ev-num\">{String(i+1).padStart(2,\"0\")}</div>
              <div className=\"ev-title\">{idea}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className=\"foot\">
        <div className=\"brand-row\">
          <div className=\"brand-mark\"><Zap size={14} strokeWidth={2.5} /></div>
          <span className=\"brand-name\">EE / STUDY HUB</span>
        </div>
        <div className=\"foot-note\">Built for Electrical Engineering students · © {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
};

function App() {
  const [username, setUsername] = useState(\"\");

  return (
    <div className=\"App\">
      <BrowserRouter>
        <Routes>
          <Route
            path=\"/\"
            element={
              username
                ? <Home username={username} onLogout={() => setUsername(\"\")} />
                : <Register onEnter={setUsername} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
"
Observation: Overwrite successful: /app/frontend/src/App.js