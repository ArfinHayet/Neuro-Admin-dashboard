import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { getUserById, getLeaves, getAvailability } from "../../api/user";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";


const ClinicianProfile = () => {
  const { id } = useParams();
  const [clinician, setClinician] = useState(null);
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(id);
        if (!userData.payload) {
          setClinician(null);
          return;
        }
        setClinician(userData.payload);

        const allLeaves = await getLeaves();
        const userLeaves = allLeaves.payload.filter((l) => 
          String(l.userId) === String(id));
        setLeaves(userLeaves);

        const allAvailability = await getAvailability();
        const userAvailability = allAvailability.payload.filter((a) => 
          String(a.userId) === String(id));
        setAvailability(userAvailability);

      } catch (err) {
        console.error(err);
        setClinician(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

 const leaveColumns = useMemo(
    () => [
      { 
        accessorKey: "startDate", 
        header: "Start Date", 
        cell: (info) => new Date(info.getValue()).toLocaleDateString("en-GB") 
      },
      { 
        accessorKey: "endDate", 
        header: "End Date", 
        cell: (info) => new Date(info.getValue()).toLocaleDateString("en-GB") },
      { 
        accessorKey: "leaveType", 
        header: "Type" },
      { 
        accessorKey: "status", 
        header: "Status" },
    ],
    []
  );

  const availabilityColumns = useMemo(
    () => [
      { 
        accessorKey: "day", 
        header: "Day" 
      },
      { 
        accessorKey: "time", 
        header: "Time" 
      },
      { 
        accessorKey: "availabilityType", 
        header: "Type" 
      },
    ],
    []
  );

  const leaveTable = useReactTable(
    { data: leaves, 
      columns: leaveColumns, 
      getCoreRowModel: getCoreRowModel() 
    });
  const availabilityTable = useReactTable({ 
    data: availability, 
    columns: availabilityColumns, 
    getCoreRowModel: getCoreRowModel() 
  });

    if (loading) {
    return (
      <div className="flex justify-center items-center  text-gray-500">
        Loading clinician details...
      </div>
    );
  }
  if (!clinician) {
    return (
      <div className="p-6 ">
        <h2>User not found</h2>
        <button
          onClick={() => navigate("/clinicians")}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Back to User List
        </button>
      </div>
    );
  }



  return (
      <section className="h-[90vh] overflow-y-auto bg-white rounded-2xl px-4 pt-4">
      <h2 className="text-xl font-semibold mb-4">{clinician.name}'s Details</h2>
     <div className="space-y-4">
      <div className="">
          <h2 className=" font-semibold mb-2">Login Information</h2>
        <p className="flex gap-2 items-center justify-start text-sm mb-1">
               <MdOutlineMailOutline size={18} /> {clinician.email}
             </p>
             <p className="flex gap-2 items-center justify-start text-sm">
               <LuPhone size={16} /> {clinician.phone}
             </p>
       </div> 

       <div className="space-y-1">
          <h2 className=" font-semibold mb-1">Personal Information</h2>
          
          <p className="flex gap-2 items-center text-sm">
            <FaRegAddressCard size={16} /> {clinician.street}
          </p>

          </div>

      <div className="">
        <h3 className=" font-semibold mb-2">Leaves</h3>
        {leaves.length === 0 ? (
          <p className="text-gray-500 text-sm">No leave records.</p>
        ) : (
          <div className=" py-2 max-w-[70vw]">
            <DataTable table={leaveTable} />
          </div>
        )}
      </div>

      <div className="">
        <h3 className=" font-semibold mb-2">Availability</h3>
        {availability.length === 0 ? (
          <p className="text-sm text-gray-500">No availability records.</p>
        ) : (
          <div className=" py-2 max-w-[70vw]">
            <DataTable table={availabilityTable} />
          </div>
        )}
      </div>
      </div>
    </section>
  );
};

export default ClinicianProfile;
