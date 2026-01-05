import { useState } from "react";
import toast from "react-hot-toast";
import { addQuestion } from "../../api/questionnaires";
import { IoMdClose } from "react-icons/io";

const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2)
    throw new Error("CSV must have header and at least one row");

  // Detect delimiter - check if tab or comma separated
  const firstLine = lines[0];
  const delimiter = ",";
  // const delimiter = firstLine.includes("\t") ? "\t" : ",";
  // console.log("Detected delimiter:", delimiter === "\t" ? "TAB" : "COMMA");

  // Parse headers
  const headers = lines[0].split(delimiter).map(
    (h) =>
      h
        .replace(/^\uFEFF/, "")
        .trim()
        .toLowerCase()
        .replace(/"/g, "") // Remove quotes
  );

  // console.log("Headers found:", headers);

  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line with proper quote handling
    let values = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, "")); // Remove surrounding quotes
        current = "";
      } else {
        current += char;
      }
    }
    // Don't forget the last value
    values.push(current.trim().replace(/^"|"$/g, ""));

// const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

    // console.log(`Row ${i + 1} raw values:`, values);

    const row = {};
    headers.forEach((header, idx) => {
      row[header] = (values[idx] || "").replace(/^\uFEFF/, "").trim();
    });

    row._row = i + 1;
    // console.log(`Parsed row ${i + 1}:`, row);
    rows.push(row);
  }

  return rows;
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
        // console.log("All parsed rows:", parsed);

        if (!parsed.length) {
          toast.error("No rows found in CSV");
          return;
        }

        const questionsArray = parsed.map((r) => {
          // Check for questions field with various possible names
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

          return {
            assessmentId: Number(assessmentId),
            questions: questionText,
            order: Number(r.order || r.Order || 0),
            answerType:
              (
                r.answerType ||
                ""
              ).trim() || "MultipleChoice",
            options:
              r.options || r.Options
                ? (r.options || r.Options).split("|").map((o) => o.trim())
                : ["Option A", "Option B", "Option C"],
            questiontypeid: Number(categoryId),
            variant: (r.variant || r.Variant || "").trim(),
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

        <div className="mb-2">
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="w-full text-sm border border-gray-300 rounded-md"
          />
        </div>

        {rows.length > 0 && (
          <div className="mb-4">
           
              <p className="text-green-600 font-medium text-sm">
                {rows.length} questions ready to import
              </p>
           
           
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
