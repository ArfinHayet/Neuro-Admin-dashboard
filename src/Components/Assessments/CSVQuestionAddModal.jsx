import { useState } from "react";
import toast from "react-hot-toast";
import { addQuestion } from "../../api/questionnaires";
import { IoMdClose } from "react-icons/io";

const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2)
    throw new Error("CSV must have header and at least one row");

  const delimiter = ",";

  // Parse headers
  const headers = lines[0].split(delimiter).map((h) =>
    h
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
      .replace(/"/g, ""),
  );

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // ✅ FIXED: Proper CSV parsing with quote handling
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (char === '"' && nextChar === '"') {
        // Handle escaped quotes ("")
        current += '"';
        j++; // Skip next quote
      } else if (char === '"') {
        // Toggle quote state
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        // Split only if not inside quotes
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    // Don't forget the last value
    values.push(current.trim());

    const row = {};
    headers.forEach((header, idx) => {
      // ✅ Remove surrounding quotes but keep internal content
      let value = (values[idx] || "").trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1); // Remove outer quotes only
      }
      row[header] = value;
    });

    row._row = i + 1;
    rows.push(row);
  }

  return rows;
};

const parseOptionsWithScores = (optionsString) => {
  if (!optionsString || optionsString.trim() === "") {
    return undefined;
  }

  try {
    // Format: "Yes:1|No:0|Maybe:0.5"
    return optionsString.split("|").map((opt) => {
      const parts = opt.trim().split(":");

      if (parts.length !== 2) {
        throw new Error(`Invalid option format: ${opt}`);
      }

      const label = parts[0].trim();
      const scoreStr = parts[1].trim();

      if (!label) {
        throw new Error("Option label cannot be empty");
      }

      const score = parseFloat(scoreStr);

      if (isNaN(score)) {
        throw new Error(`Invalid score value: ${scoreStr}`);
      }

      return {
        label,
        score,
      };
    });
  } catch (err) {
    console.error("Error parsing options:", err);
    throw new Error(`Options parsing failed: ${err.message}`);
  }
};

const CSVQuestionAddModal = ({
  isOpen,
  onClose,
  assessmentId,
  categoryId,
  onSuccess,
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCSV(reader.result);

        if (!parsed.length) {
          toast.error("No rows found in CSV");
          return;
        }

        const questionsArray = parsed.map((r) => {
          // Get question text
          const questionText = (
            r.questions ||
            r.question ||
            r.Questions ||
            r.Question ||
            ""
          ).trim();

          if (!questionText) {
            console.error(`Row ${r._row} data:`, r);
            throw new Error(`Missing question at row ${r._row}`);
          }

          // Parse options with scores
          const optionsString = (r.options || r.Options || "").trim();
          let parsedOptions;

          try {
            parsedOptions = parseOptionsWithScores(optionsString);
          } catch (err) {
            throw new Error(`Row ${r._row}: ${err.message}`);
          }

          // Parse domain
          const domain = (r.domain || r.Domain || "").trim();

          return {
            assessmentId: Number(assessmentId),
            questions: questionText,
            order: Number(r.order || r.Order || 0),
            answerType:
              (r.answertype || r.answerType || "").trim() || "MultipleChoice",
            options: parsedOptions,
            questiontypeid: Number(categoryId),
            variant: (r.variant || r.Variant || "").trim(),
            domain: domain || undefined, // ✅ NEW: Add domain field
          };
        });

        setRows(questionsArray);
        toast.success(`${questionsArray.length} questions parsed successfully`);
        console.log("Final payload ready to send:", questionsArray);
      } catch (err) {
        console.error("Parsing error:", err);
        toast.error(err.message || "Invalid CSV format");
      }
    };

    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!rows.length) {
      toast.error("No valid questions to import");
      return;
    }

    setLoading(true);
    try {
      for (let q of rows) {
        console.log("Sending payload to backend:", q);
        await addQuestion(q);
      }
      toast.success("CSV questions imported successfully");
      setRows([]);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Import error:", err);
      toast.error("CSV import failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Import Questions from CSV</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            <IoMdClose />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            CSV Format: questions, order, answerType, options, variant, domain
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Example options:{" "}
            <code className="bg-gray-100 px-1 rounded">
              "Yes:1|No:0|Maybe:0.5"
            </code>
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="w-full text-sm border border-gray-300 rounded-md p-2"
          />
        </div>

        {rows.length > 0 && (
          <div className="mb-4">
            <p className="text-green-600 font-medium text-sm mb-2">
              {rows.length} questions ready to import
            </p>
            <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded text-xs">
              {rows.map((row, idx) => (
                <div
                  key={idx}
                  className="mb-2 pb-2 border-b border-gray-200 last:border-0"
                >
                  <div className="font-semibold text-gray-800">
                    {idx + 1}. {row.questions}
                  </div>
                  <div className="flex gap-3 mt-1 text-gray-600">
                    {row.domain && (
                      <span className="text-blue-600">📁 {row.domain}</span>
                    )}
                    {row.variant && (
                      <span className="text-purple-600">🏷️ {row.variant}</span>
                    )}
                    {row.options && (
                      <span className="text-green-600">
                        ✓ {row.options.length} options
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="text-sm py-2 text-gray-600 font-semibold px-4 rounded-md bg-slate-100 hover:bg-slate-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !rows.length}
            className="px-4 py-2 bg-[#114654] text-white rounded-md hover:bg-[#114654]/90 disabled:bg-gray-300 text-sm disabled:cursor-not-allowed"
          >
            {loading ? "Importing..." : "Import Questions"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVQuestionAddModal;





// (questions, order, answerType, options, variant, domain);
// ("Do you exercise regularly?",
//   1,
//   MultipleChoice,
//   "Yes:1|No:0",
//   internal,
//   "Physical Health");
// ("How many hours do you sleep?", 2, Text, "", internal, "Sleep Habits");
// ("Are you satisfied?",
//   3,
//   Yes / No,
//   "Yes:1|No:0|Maybe:0.5",
//   external,
//   "Mental Health");