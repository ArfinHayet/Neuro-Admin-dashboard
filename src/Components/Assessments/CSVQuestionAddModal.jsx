import { useState } from "react";
import toast from "react-hot-toast";
import { addQuestion } from "../../api/questionnaires";

const parseCSV = (text) => {
  const lines = text.trim().split("\n");

  if (lines.length < 2)
    throw new Error("CSV must have header and at least one row");

  const headers = lines[0].split("\t").map((h) => h.trim()); // using tab-separated CSV

  return lines.slice(1).map((line, index) => {
    const values = line.split("\t").map((v) => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    row._row = index + 2; // for error messages
    return row;
  });
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

       const mapped = parsed.map((r) => ({
         assessmentId: Number(r.assessmentId),
         questions: r.questions,
         order: Number(r.order),
         answerType: r.answerType,
         options: r.options ? r.options.split("|").map((o) => o.trim()) : [], // split options by "|" if present
         questiontypeid: Number(r.questiontypeid),
         variant: r.variant,
         row: r._row, 
       }));


        // validation
        const invalid = mapped.find(
          (q) => !q.questions || !q.order || !q.answerType
        );

        if (invalid) {
          toast.error(`Invalid data at row ${invalid.row}`);
          return;
        }

        setRows(mapped);
      } catch {
        toast.error("Invalid CSV format");
      }
    };

    reader.readAsText(file);
  };

 const handleSubmit = async () => {
   if (!rows.length) {
     toast.error("No valid questions");
     return;
   }

   setLoading(true);
   try {
     for (let q of rows) {
       await addQuestion(q); 
     }

     toast.success("Questions imported successfully");
     onSuccess();
     onClose();
   } catch (err) {
     console.error(err);
     toast.error("CSV import failed");
   } finally {
     setLoading(false);
   }
 };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="font-semibold mb-4">Import Questions from CSV</h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="mb-4"
        />

        {rows.length > 0 && (
          <p className="text-sm text-gray-600 mb-3">
            {rows.length} questions ready to import
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-1 font-semibold">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1 bg-[#114654] text-white rounded"
          >
            {loading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVQuestionAddModal;
