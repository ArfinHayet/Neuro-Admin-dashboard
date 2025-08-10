import React from "react";

const InitialAssessmentsection = () => {
  return (
    <section className="bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Initial Assessments</h2>
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">Question List</h3>
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm">Add Question</button>
      </div>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Question</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {["What is your name?", "How do you feel today?"]?.map((q, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{q}</td>
              <td className="p-2 space-x-2">
                <button className="text-blue-600">Edit</button>
                <button className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default InitialAssessmentsection;