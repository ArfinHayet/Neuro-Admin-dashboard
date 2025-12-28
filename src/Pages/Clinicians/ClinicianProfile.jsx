import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import DataTable from "../../Components/Common/DataTable";
import { getUserById, getLeaves, getAvailability } from "../../api/user";
import { MdLocationPin, MdEmail } from "react-icons/md";
import { RiPhoneFill } from "react-icons/ri";
import { BiSolidMessageRoundedDots } from "react-icons/bi";

import { FaUserTag, FaUserPlus, FaUserCog } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";

const ClinicianProfile = () => {
  const { id } = useParams();
  const [clinician, setClinician] = useState(null);
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageURL = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(id);
        if (!userData.payload) {
          setClinician(null);
          return;
        }
        console.log(userData.payload);
        setClinician(userData.payload);

        const allLeaves = await getLeaves();
        const userLeaves = allLeaves.payload.filter(
          (l) => String(l.userId) === String(id)
        );
        console.log(userLeaves);
        setLeaves(userLeaves);

        const allAvailability = await getAvailability();
        const userAvailability = allAvailability.payload.filter(
          (a) => String(a.userId) === String(id)
        );
        console.log(userAvailability);
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
        cell: (info) => new Date(info.getValue()).toLocaleDateString("en-GB"),
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("en-GB"),
      },
      {
        accessorKey: "leaveType",
        header: "Type",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    []
  );

  const availabilityColumns = useMemo(
    () => [
      {
        accessorKey: "day",
        header: "Day",
      },
      {
        accessorKey: "time",
        header: "Start Time",
      },
      {
        accessorKey: "endTime",
        header: "End Time",
      },
      {
        accessorKey: "availabilityType",
        header: "Type",
      },
    ],
    []
  );

  const leaveTable = useReactTable({
    data: leaves,
    columns: leaveColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  const availabilityTable = useReactTable({
    data: availability,
    columns: availabilityColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <section className="h-[90vh] flex flex-col justify-center items-center">
        <div className="custom-loader"></div>
        <p className="mt-4 text-sm text-gray-500">
          Loading Clinician Profile...
        </p>
      </section>
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
    <section className=" ">
      {" "}
      <h1 className="font-semibold text-xl mb-4">{clinician.name}'s Details</h1>
      <section className="space-y-6">
        <section className="space-y-4  mb-6 flex justify-start  items-center gap-10">
          <section className="w-[30%] flex flex-col justify-center items-center space-y-2">
            <img
              src={
                clinician.image
                  ? `${imageURL}${clinician.image}`
                  : "/png/placeholder.png"
              }
              className="rounded-full h-20 w-20 object-cover "
            />
            <div className="flex flex-col items-center gap-0.5 justify-center">
              {/* <h2 className=" font-semibold mb-2">Login Information</h2> */}
              <p className="text-xl font-semibold ">{clinician.name}</p>
              <p className="flex gap-2 items-center text-sm ">
                <MdEmail className="text-gray-500" size={18} />{" "}
                {clinician.email}
              </p>
              <p className="flex gap-2 items-center  text-sm">
                <RiPhoneFill className="text-gray-500" size={16} />{" "}
                {clinician.phone}
              </p>
              <p className="flex gap-2 items-center  text-sm">
                <FaUserCog className=" text-gray-500" size={18} />
                <strong>{clinician.role}</strong>
              </p>
            </div>
          </section>

          <section className="w-[50%] rounded-lg border shadow-md  p-5 ">
            <h2 className=" font-semibold mb-3">Personal Information</h2>
            <div className="flex justify-start gap-14">
              <div className="space-y-2 text-sm">
                {/* <p className=" flex items-center gap-2">
                  <FaUserCog className=" text-gray-500" size={18} />{" "}
                  <strong>Role </strong>{" "}
                </p> */}
                <p className=" flex items-center gap-2">
                  <BiSolidMessageRoundedDots
                    className="text-gray-500 -ml-0.5 "
                    size={18}
                  />{" "}
                  <strong>Know How </strong>{" "}
                </p>

                <p className="flex gap-2 items-center ">
                  <FaUserTag size={18} className="-ml-1 text-gray-500" />{" "}
                  <strong>HCPC Title</strong>
                </p>
                <p className="flex gap-2 items-center ">
                  <FaUserPen size={18} className="-ml-1 text-gray-500" />{" "}
                  <strong>Practice Name</strong>
                </p>
                <p className="flex gap-2 items-center ">
                  <FaUserPlus size={18} className="-ml-1 text-gray-500" />{" "}
                  <strong>Reg No</strong>
                </p>
                <p className="flex gap-2 items-center ">
                  <MdLocationPin size={18} className="-ml-2 text-gray-500" />
                  <strong>Address</strong>
                </p>
              </div>
              <div className="space-y-2 text-sm">
                {/* <p className=" ">{clinician.role || "N/A"}</p> */}
                <p className=" ">{clinician.knowHow || "N/A"}</p>

                <p className=" ">{clinician.hcpcTitle || "N/A"}</p>
                <p className="">{clinician.practiceName || "N/A"}</p>
                <p className="">{clinician.regNo}</p>
                <p>
                  {clinician.street ||
                  clinician.state ||
                  clinician.country ||
                  clinician.postCode
                    ? `${clinician.street || ""}, ${clinician.state || ""}, ${
                        clinician.country || ""
                      }, ${clinician.postCode || ""}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </section>
        </section>

        <div className="space-y-4">
          <div className="">
            <h3 className=" font-semibold mb-2 text-lg">Leaves</h3>
            {leaves.length === 0 ? (
              <p className="text-gray-500 text-sm">No leave records.</p>
            ) : (
              <div className=" py-2 max-w-[90vw]">
                <DataTable table={leaveTable} />
              </div>
            )}
          </div>

          <div className="">
            <h3 className=" font-semibold mb-2 text-lg">Availability</h3>
            {availability.length === 0 ? (
              <p className="text-sm text-gray-500">No availability records.</p>
            ) : (
              <div className=" py-2 max-w-[90vw]">
                <DataTable table={availabilityTable} />
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default ClinicianProfile;
