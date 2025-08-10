const Privilege = ({
  sectionTitle,
  fieldName,
  handleAddChange,
  handleViewChange,
  handleEditChange,
  handleDeleteChange,
  addArr,
  viewArr,
  editArr,
  deleteArr,
}) => (
  <>
    <td className="text-[#6C6C6C] text-xs font-normal">{sectionTitle}</td>
    <td className="flex flex-row gap-8 text-[#6C6C6C] text-xs font-normal">
      <div className="flex gap-[2px] form-check form-check-inline">
        <input
          className=" accent-[#0A6876] focus:accent-[#0A6876]"
          type="checkbox"
          id={`${fieldName}Add`}
          value={fieldName}
          onChange={handleAddChange}
          checked={addArr.includes(fieldName)}
        />
        <label className="form-check-label" htmlFor={`${fieldName}Add`}>
          Add
        </label>
      </div>
      <div className="flex gap-[2px] form-check form-check-inline">
        <input
          className=" accent-[#0A6876] focus:accent-[#0A6876]"
          type="checkbox"
          id={`${fieldName}View`}
          value={fieldName}
          onChange={handleViewChange}
          checked={viewArr.includes(fieldName)}
        />
        <label className="form-check-label" htmlFor={`${fieldName}View`}>
          View
        </label>
      </div>
      <div className="flex gap-[2px] form-check form-check-inline">
        <input
          className=" accent-[#0A6876] focus:accent-[#0A6876]"
          type="checkbox"
          id={`${fieldName}Edit`}
          value={fieldName}
          onChange={handleEditChange}
          checked={editArr.includes(fieldName)}
        />
        <label className="form-check-label" htmlFor={`${fieldName}Edit`}>
          Edit
        </label>
      </div>
      <div className="flex gap-[2px] form-check form-check-inline">
        <input
          className=" accent-[#0A6876] focus:accent-[#0A6876]"
          type="checkbox"
          id={`${fieldName}Delete`}
          value={fieldName}
          onChange={handleDeleteChange}
          checked={deleteArr.includes(fieldName)}
        />
        <label className="form-check-label" htmlFor={`${fieldName}Delete`}>
          Delete
        </label>
      </div>
    </td>
  </>
);

export default Privilege;


