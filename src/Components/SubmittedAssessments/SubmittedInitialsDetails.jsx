

const SubmittedInitialsDetails = ({ assessment, onBack }) => {
  if (!assessment) {
    return <p>Assessment not found.</p>;
  }

  return (
    <section className="p-6 max-w-4xl mx-auto bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-semibold mb-4">{assessment.name}</h1>
      <p className="mb-2"><strong>Date Taken:</strong> {assessment.dateTaken}</p>
      <p className="mb-6"><strong>Type:</strong> {assessment.type}</p>

      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-gray-300">Question</th>
            <th className="p-2 border border-gray-300">Answer</th>
          </tr>
        </thead>
        <tbody>
          {assessment.answers.map(({ question, answer }, i) => (
            <tr key={i} className="border border-gray-300">
              <td className="p-2 border border-gray-300">{question}</td>
              <td className="p-2 border border-gray-300">{answer}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to List
        </button>
      </div>
    </section>
  );
};

export default SubmittedInitialsDetails;
